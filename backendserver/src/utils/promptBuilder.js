const buildPrompt = (records) => `
You are an expert CRM data extraction engine.

Your task is to intelligently map CSV records into the GrowEasy CRM schema.

The input CSV headers are NOT fixed.

The CSV may come from:
- Facebook Lead Ads
- Google Ads
- Excel
- Real Estate CRM
- Marketing Agencies
- Sales Reports
- Manual spreadsheets

Do NOT depend on exact column names.

Understand the meaning of each column.

Possible examples:

Name:
- Name
- Full Name
- Customer Name
- Lead Name
- Contact Name

Email:
- Email
- Email Address
- Mail
- Primary Email

Phone:
- Mobile
- Phone
- Contact Number
- Mobile Number
- Phone Number

Company:
- Company
- Organization
- Business
- Firm

Return ONLY a valid JSON array.

CRM Schema:

[
  {
    "created_at": "",
    "name": "",
    "email": "",
    "country_code": "",
    "mobile_without_country_code": "",
    "company": "",
    "city": "",
    "state": "",
    "country": "",
    "lead_owner": "",
    "crm_status": "",
    "crm_note": "",
    "data_source": "",
    "possession_time": "",
    "description": ""
  }
]

Rules:

1. Skip records having neither email nor mobile.

2. If multiple emails exist:
Use first email.
Append remaining emails into crm_note.

3. If multiple mobile numbers exist:
Use first mobile.
Append remaining numbers into crm_note.

4. crm_status must be ONLY one of:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

5. data_source must be ONLY one of:

leads_on_demand
meridian_tower
eden_park
varah_swamy
sarjapur_plots

If not confident, leave empty.

6. created_at must be convertible using JavaScript.

7. Missing values should be null.

8. Do NOT explain anything.

9. Return ONLY JSON.

CSV Records:

${JSON.stringify(records, null, 2)}
`;

module.exports = buildPrompt;