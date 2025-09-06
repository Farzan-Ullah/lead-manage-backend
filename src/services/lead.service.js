import Lead from "../models/Lead.js";

export async function createLead(payload) {
  return await Lead.create(payload);
}

export async function getLeadById(id) {
  return await Lead.findOne({ _id: id, isDeleted: false });
}

export async function updateLead(id, payload) {
  const lead = await Lead.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true }
  );
  return lead;
}

export async function softDeleteLead(id) {
  return await Lead.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
}

export async function listLeads(query) {
  const {
    page = 1,
    limit = 20,
    sort = "-createdAt",
    search,
    status,
    source,
    owner,
    minValue,
    maxValue,
    fromDate,
    toDate,
    tags,
  } = query;

  const filter = { isDeleted: false };
  if (status) filter.status = { $in: String(status).split(",") };
  if (source) filter.source = { $in: String(source).split(",") };
  if (owner) filter.owner = { $in: String(owner).split(",") };
  if (minValue || maxValue)
    filter.value = {
      ...(minValue ? { $gte: Number(minValue) } : {}),
      ...(maxValue ? { $lte: Number(maxValue) } : {}),
    };
  if (fromDate || toDate)
    filter.createdAt = {
      ...(fromDate ? { $gte: new Date(fromDate) } : {}),
      ...(toDate ? { $lte: new Date(toDate) } : {}),
    };
  if (tags)
    filter.tags = {
      $all: String(tags)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

  const baseQuery = Lead.find(filter);

  if (search) {
    baseQuery.find({ $text: { $search: search } });
  }

  const pageNum = Math.max(parseInt(page), 1);
  const pageSize = Math.min(Math.max(parseInt(limit), 1), 100);

  const [items, total] = await Promise.all([
    baseQuery
      .sort(sort)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return { items, total, page: pageNum, limit: pageSize };
}

export async function addActivity(id, activity) {
  const lead = await Lead.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $push: { activities: { $each: [activity], $position: 0 } } },
    { new: true }
  );
  return lead;
}

export async function changeStatus(id, to, changedBy) {
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) return null;
  const from = lead.status;
  if (from === to) return lead;
  lead.status = to;
  lead.statusHistory.unshift({ from, to, changedBy });
  lead.activities.unshift({
    type: "status-change",
    note: `${from} → ${to}`,
    createdBy: changedBy,
  });
  await lead.save();
  return lead;
}

export async function assignOwner(id, owner, changedBy) {
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) return null;
  const prev = lead.owner;
  lead.owner = owner;
  lead.activities.unshift({
    type: "note",
    note: `owner: ${prev || "-"} → ${owner}`,
    createdBy: changedBy,
  });
  await lead.save();
  return lead;
}

export async function upsertLeadByEmailOrPhone(payload) {
  const { email, phone } = payload;
  if (!email && !phone) throw new Error("email or phone required");
  const query = {
    isDeleted: false,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
  };
  const lead = await Lead.findOneAndUpdate(
    query,
    { $set: payload },
    { new: true }
  );
  return lead || (await Lead.create(payload));
}

export async function findDuplicates() {
  // group by email/phone to find duplicates
  const dupEmails = await Lead.aggregate([
    { $match: { email: { $ne: null }, isDeleted: false } },
    { $group: { _id: "$email", ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  const dupPhones = await Lead.aggregate([
    { $match: { phone: { $ne: null }, isDeleted: false } },
    { $group: { _id: "$phone", ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  return { dupEmails, dupPhones };
}
