const buildPrompt = (records) => `
You are an expert CRM data extraction engine.

Your task is to intelligently map CSV records into the GrowEasy CRM schema.

The input CSV headers are NOT fixed.

The CSV may come from:
- Facebook Lead Ads
- Google Ads
- Excel exports
- Real Estate CRM systems
- Marketing agency reports
- Sales reports
- Manually created spreadsheets

Do NOT depend on exact column names. Understand the meaning of each column.

Column mapping examples:

Name: Name, Full Name, Customer Name, Lead Name, Contact Name, first_name + last_name
Email: Email, Email Address, Mail, Primary Email, work_email
Phone: Mobile, Phone, Contact Number, Mobile Number, Phone Number, cell
Company: Company, Organization, Business, Firm, Account Name
Location: City, State, Country, Address, Region
Status: Status, Lead Status, Stage, Pipeline Stage
Notes: Notes, Remarks, Comments, Description, Follow-up Notes
Source: Source, Lead Source, Campaign, utm_source, Form Name
Date: Created, Created At, Date, Timestamp, submitted_at

Return ONLY a valid JSON array with EXACTLY ${records.length} elements — one per input record, in the same order.

Output format for each record:

{
  "status": "success" | "skipped",
  "skipReason": "reason if skipped, otherwise null",
  "data": {
    "created_at": null,
    "name": null,
    "email": null,
    "country_code": null,
    "mobile_without_country_code": null,
    "company": null,
    "city": null,
    "state": null,
    "country": null,
    "lead_owner": null,
    "crm_status": null,
    "crm_note": null,
    "data_source": null,
    "possession_time": null,
    "description": null
  }
}

Rules:

1. Skip records that contain NEITHER email NOR mobile number:
   - Set status to "skipped"
   - Set skipReason to "Record contains neither email nor mobile number"
   - Still include the data object with whatever fields could be extracted

2. Multiple emails: use the first as email; append remaining emails to crm_note.

3. Multiple mobile numbers: use the first as mobile_without_country_code; append remaining numbers to crm_note.

4. crm_status must be ONLY one of (or null if unknown):
   GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE

5. data_source must be ONLY one of (or null if not confident):
   leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots

6. created_at must be a string parseable by JavaScript new Date(). Use ISO format when possible.

7. country_code should include + prefix when available (e.g. +91). Extract from phone if needed.

8. mobile_without_country_code should be digits only, without country code.

9. Use crm_note for: remarks, follow-up notes, extra phones, extra emails, and any useful info that does not fit other fields.

10. Missing values must be null, not empty strings.

11. Do NOT include markdown, explanations, or code fences. Return ONLY the JSON array.

CSV Records:

${JSON.stringify(records, null, 2)}
`;

module.exports = buildPrompt;
