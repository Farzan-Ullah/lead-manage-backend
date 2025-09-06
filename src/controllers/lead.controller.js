import * as service from "../services/lead.service.js";
import { success } from "../utils/ApiResponse.js";
import { parseCSVBuffer, leadsToCSV } from "../utils/csv.js";

export const create = async (req, res) => {
  const lead = await service.createLead(req.body);
  res.status(201).json(success(lead));
};

export const upsert = async (req, res) => {
  const lead = await service.upsertLeadByEmailOrPhone(req.body);
  res.status(200).json(success(lead));
};

export const list = async (req, res) => {
  const page = await service.listLeads(req.query);
  res.json(success(page));
};

export const getById = async (req, res) => {
  const lead = await service.getLeadById(req.params.id);
  if (!lead)
    return res.status(404).json({ ok: false, error: "Lead not found" });
  res.json(success(lead));
};

export const update = async (req, res) => {
  const lead = await service.updateLead(req.params.id, req.body);
  if (!lead)
    return res.status(404).json({ ok: false, error: "Lead not found" });
  res.json(success(lead));
};

export const remove = async (req, res) => {
  const lead = await service.softDeleteLead(req.params.id);
  if (!lead)
    return res.status(404).json({ ok: false, error: "Lead not found" });
  res.json(success({ deleted: true, lead }));
};

export const addLeadActivity = async (req, res) => {
  const lead = await service.addActivity(req.params.id, {
    type: req.body.type || "note",
    note: req.body.note,
    createdBy: req.body.createdBy,
  });
  if (!lead)
    return res.status(404).json({ ok: false, error: "Lead not found" });
  res.json(success(lead));
};

export const setStatus = async (req, res) => {
  const lead = await service.changeStatus(
    req.params.id,
    req.body.status,
    req.body.changedBy
  );
  if (!lead)
    return res.status(404).json({ ok: false, error: "Lead not found" });
  res.json(success(lead));
};

export const setOwner = async (req, res) => {
  const lead = await service.assignOwner(
    req.params.id,
    req.body.owner,
    req.body.changedBy
  );
  if (!lead)
    return res.status(404).json({ ok: false, error: "Lead not found" });
  res.json(success(lead));
};

export const duplicates = async (req, res) => {
  const dups = await service.findDuplicates();
  res.json(success(dups));
};

export const importCSV = async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ ok: false, error: "CSV file is required (field name: file)" });
  const rows = await parseCSVBuffer(req.file.buffer);
  const created = [];
  for (const row of rows) {
    // Normalize: expect headers like firstName,lastName,email,phone,company,source,status,owner,value,tags
    const payload = {
      firstName: row.firstName || row.firstname || row.first || "Unknown",
      lastName: row.lastName || row.lastname || row.last || "",
      email: row.email || null,
      phone: row.phone || null,
      company: row.company || "",
      source: row.source || "unknown",
      status: row.status || "new",
      owner: row.owner || "",
      value: row.value ? Number(row.value) : 0,
      tags: row.tags
        ? String(row.tags)
            .split(",")
            .map((s) => s.trim())
        : [],
    };
    const lead = await service.upsertLeadByEmailOrPhone(payload);
    created.push(lead);
  }
  res.status(201).json(success({ imported: created.length }));
};

export const exportCSV = async (req, res) => {
  const { items } = await service.listLeads({ ...req.query, limit: 10000 });
  const csv = leadsToCSV(items);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
  res.status(200).send(csv);
};
