const VALID_CRM_STATUSES = new Set([
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
]);

const VALID_DATA_SOURCES = new Set([
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
]);

const CRM_FIELDS = [
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
];

function hasContactInfo(data) {
  const email = data?.email?.toString().trim();
  const mobile = data?.mobile_without_country_code?.toString().trim();
  return Boolean(email || mobile);
}

function normalizeCRMRecord(record) {
  const data = {};
  const rawData = record?.data || record;

  for (const field of CRM_FIELDS) {
    const value = rawData[field];
    data[field] = value === undefined || value === "" ? null : String(value);
  }

  if (data.crm_status && !VALID_CRM_STATUSES.has(data.crm_status)) {
    data.crm_status = null;
  }

  if (data.data_source && !VALID_DATA_SOURCES.has(data.data_source)) {
    data.data_source = null;
  }

  if (data.created_at) {
    const parsedDate = new Date(data.created_at);
    if (Number.isNaN(parsedDate.getTime())) {
      data.created_at = null;
    }
  }

  let status = record?.status === "skipped" ? "skipped" : "success";
  let skipReason = record?.skipReason || null;

  if (status === "success" && !hasContactInfo(data)) {
    status = "skipped";
    skipReason = skipReason || "Record contains neither email nor mobile number";
  }

  return { status, skipReason, data };
}

function normalizeCRMRecords(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map(normalizeCRMRecord);
}

function createSkippedRecords(records, skipReason) {
  return records.map(() => ({
    status: "skipped",
    skipReason,
    data: Object.fromEntries(CRM_FIELDS.map((field) => [field, null])),
  }));
}

module.exports = {
  normalizeCRMRecords,
  createSkippedRecords,
  CRM_FIELDS,
};
