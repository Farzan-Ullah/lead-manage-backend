import { parse } from "csv-parse/sync";

export async function parseCSVBuffer(buffer) {
  const text = buffer.toString("utf8");
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return rows;
}

export function leadsToCSV(items) {
  const headers = [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "title",
    "source",
    "status",
    "owner",
    "value",
    "tags",
    "createdAt",
  ];
  const lines = [headers.join(",")];
  for (const it of items) {
    const row = [
      it._id,
      it.firstName || "",
      it.lastName || "",
      it.email || "",
      it.phone || "",
      it.company || "",
      it.title || "",
      it.source || "",
      it.status || "",
      it.owner || "",
      it.value != null ? it.value : "",
      Array.isArray(it.tags) ? it.tags.join("|") : "",
      it.createdAt ? new Date(it.createdAt).toISOString() : "",
    ].map(escapeCSV);
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

function escapeCSV(val) {
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replaceAll('"', '""') + '"';
  }
  return s;
}
