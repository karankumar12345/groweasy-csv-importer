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

const FIELD_PATTERNS = {
  created_at: [/created/i, /date/i, /timestamp/i, /submitted/i, /time/i],
  name: [/^name$/i, /full.?name/i, /customer/i, /lead.?name/i, /contact.?name/i, /first.?name/i],
  email: [/email/i, /mail/i, /e-mail/i],
  mobile_without_country_code: [/phone/i, /mobile/i, /contact.?number/i, /cell/i, /tel/i],
  company: [/company/i, /organization/i, /business/i, /firm/i, /account/i],
  city: [/city/i, /town/i],
  state: [/state/i, /province/i, /region/i],
  country: [/country/i, /nation/i],
  lead_owner: [/owner/i, /assigned/i, /agent/i, /sales.?rep/i],
  crm_status: [/status/i, /stage/i, /pipeline/i, /lead.?status/i],
  crm_note: [/note/i, /remark/i, /comment/i, /follow.?up/i, /description/i],
  data_source: [/source/i, /campaign/i, /utm/i, /channel/i, /form/i],
  possession_time: [/possession/i, /handover/i, /delivery/i],
  description: [/description/i, /details/i, /summary/i, /about/i],
};

const STATUS_MAP = {
  follow: "GOOD_LEAD_FOLLOW_UP",
  good: "GOOD_LEAD_FOLLOW_UP",
  connect: "DID_NOT_CONNECT",
  busy: "DID_NOT_CONNECT",
  bad: "BAD_LEAD",
  "not interested": "BAD_LEAD",
  sale: "SALE_DONE",
  closed: "SALE_DONE",
  won: "SALE_DONE",
};

const SOURCE_MAP = {
  "leads on demand": "leads_on_demand",
  "meridian tower": "meridian_tower",
  "eden park": "eden_park",
  "varah swamy": "varah_swamy",
  "sarjapur plots": "sarjapur_plots",
};

function findColumn(headers, patterns) {
  for (const header of headers) {
    if (patterns.some((pattern) => pattern.test(header))) {
      return header;
    }
  }
  return null;
}

function buildColumnMap(headers) {
  const map = {};
  for (const [field, patterns] of Object.entries(FIELD_PATTERNS)) {
    map[field] = findColumn(headers, patterns);
  }
  return map;
}

function extractPhoneParts(rawPhone) {
  if (!rawPhone) return { country_code: null, mobile: null };

  const digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return { country_code: null, mobile: null };

  if (digits.length > 10) {
    const mobile = digits.slice(-10);
    const countryDigits = digits.slice(0, -10);
    return {
      country_code: countryDigits ? `+${countryDigits}` : null,
      mobile,
    };
  }

  return { country_code: null, mobile: digits };
}

function mapStatus(value) {
  if (!value) return null;
  const normalized = String(value).toLowerCase();

  for (const [keyword, status] of Object.entries(STATUS_MAP)) {
    if (normalized.includes(keyword)) {
      return status;
    }
  }

  const upper = String(value).toUpperCase().replace(/\s+/g, "_");
  if (
    ["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE"].includes(
      upper
    )
  ) {
    return upper;
  }

  return null;
}

function mapSource(value) {
  if (!value) return null;
  const normalized = String(value).toLowerCase().trim();

  if (SOURCE_MAP[normalized]) {
    return SOURCE_MAP[normalized];
  }

  for (const [keyword, source] of Object.entries(SOURCE_MAP)) {
    if (normalized.includes(keyword)) {
      return source;
    }
  }

  return null;
}

function hasContactInfo(data) {
  return Boolean(data.email?.trim() || data.mobile_without_country_code?.trim());
}

function extractRecord(row, columnMap) {
  const data = Object.fromEntries(CRM_FIELDS.map((field) => [field, null]));
  const extras = [];

  for (const [field, column] of Object.entries(columnMap)) {
    if (!column) continue;

    const value = row[column];
    if (value === undefined || value === null || String(value).trim() === "") {
      continue;
    }

    if (field === "crm_status") {
      data.crm_status = mapStatus(value);
    } else if (field === "data_source") {
      data.data_source = mapSource(value);
    } else if (field === "mobile_without_country_code") {
      const phoneParts = extractPhoneParts(value);
      data.mobile_without_country_code = phoneParts.mobile;
      if (!data.country_code) {
        data.country_code = phoneParts.country_code;
      }
    } else {
      data[field] = String(value).trim();
    }
  }

  const emailColumns = Object.keys(row).filter((header) => /email|mail/i.test(header));
  if (emailColumns.length > 1) {
    const extraEmails = emailColumns
      .slice(1)
      .map((column) => row[column])
      .filter(Boolean);
    if (extraEmails.length) {
      extras.push(`Additional emails: ${extraEmails.join(", ")}`);
    }
  }

  const phoneColumns = Object.keys(row).filter((header) =>
    /phone|mobile|cell|tel/i.test(header)
  );
  if (phoneColumns.length > 1) {
    const extraPhones = phoneColumns
      .slice(1)
      .map((column) => row[column])
      .filter(Boolean);
    if (extraPhones.length) {
      extras.push(`Additional phones: ${extraPhones.join(", ")}`);
    }
  }

  if (extras.length) {
    data.crm_note = [data.crm_note, ...extras].filter(Boolean).join(" | ");
  }

  if (!hasContactInfo(data)) {
    return {
      status: "skipped",
      skipReason: "Record contains neither email nor mobile number",
      data,
    };
  }

  return { status: "success", skipReason: null, data };
}

function extractCRMRecords(records) {
  if (!records.length) return [];

  const headers = Object.keys(records[0]);
  const columnMap = buildColumnMap(headers);

  return records.map((row) => extractRecord(row, columnMap));
}

module.exports = {
  extractCRMRecords,
};
