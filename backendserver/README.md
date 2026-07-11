# AI CSV Importer — Backend

Express.js REST API that accepts CSV uploads, parses records, and extracts structured GrowEasy CRM data using **Google Gemini AI** with a **rule-based fallback** mapper.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Processing Pipeline](#processing-pipeline)
- [AI Extraction](#ai-extraction)
- [Rule-Based Fallback](#rule-based-fallback)
- [CRM Record Format](#crm-record-format)
- [Error Handling](#error-handling)
- [Architecture Decisions](#architecture-decisions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The backend handles three responsibilities:

1. **Accept CSV uploads** — via multipart form data, no fixed column assumptions
2. **Parse and batch records** — stream-based CSV parsing, 20 records per AI batch
3. **Extract CRM fields** — Gemini AI maps arbitrary columns to GrowEasy schema; falls back to heuristic mapping on failure

All CSV routes are protected by API key authentication.

---

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | HTTP framework |
| multer | ^2.2.0 | Multipart file upload |
| csv-parser | ^3.2.1 | Stream-based CSV parsing |
| @google/generative-ai | ^0.24.1 | Google Gemini AI SDK |
| cors | ^2.8.6 | Cross-origin resource sharing |
| dotenv | ^17.4.2 | Environment variable loading |
| cookie-parser | ^1.4.7 | Cookie parsing middleware |
| nodemon | ^3.1.14 | Dev server auto-restart |

---

## Project Structure

```
backendserver/
│
├── src/
│   ├── server.js                 # Entry point — loads env, starts HTTP server
│   ├── app.js                    # Express app — middleware, routes, CORS
│   │
│   ├── controllers/
│   │   ├── csv.controller.js     # Upload handler — validates file, calls service
│   │   └── index.js              # Controller exports
│   │
│   ├── routes/
│   │   ├── index.js              # Mounts /csv routes + API key middleware
│   │   └── csv.routes.js         # POST /upload with multer
│   │
│   ├── services/
│   │   ├── csv.service.js        # Main pipeline: parse → batch → AI/fallback
│   │   ├── ai.service.js         # Gemini API calls with retry logic
│   │   ├── batch.services.js     # Array chunking helper
│   │   └── index.js              # Service exports
│   │
│   ├── middleware/
│   │   ├── upload.middleware.js  # Multer config (CSV filter, 10MB limit)
│   │   └── error.middleware.js   # Multer-specific error handler
│   │
│   ├── utils/
│   │   ├── promptBuilder.js      # Gemini prompt for CRM field extraction
│   │   ├── crmRecordNormalizer.js # Validates and normalizes AI output
│   │   ├── ruleBasedMapper.js    # Heuristic column mapping fallback
│   │   ├── csvParser.js          # csv-parser stream wrapper
│   │   ├── batchArray.js         # Generic array chunking
│   │   ├── apiKeyMiddleware.js   # x-api-key validation
│   │   ├── asyncHandler.js       # Async route error wrapper
│   │   ├── AppError.js           # Custom error class
│   │   ├── globalerror.js        # Global error handler middleware
│   │   ├── response.js           # Response helper utilities
│   │   └── statusCode.js         # HTTP status constants
│   │
│   └── .env                      # Environment variables (not committed)
│
├── uploads/                      # Temporary upload directory (auto-created)
├── package.json
├── .env.example
└── README.md
```

---

## Setup

### 1. Install dependencies

```bash
cd backendserver
npm install
```

### 2. Configure environment

```bash
cp .env.example src/.env
```

Edit `src/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
API_KEY=groweasy-dev-api-key
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash
```

> **Important:** The `.env` file must be placed at `src/.env`. The server loads it via `path.join(__dirname, '.env')` in `server.js`.

### 3. Get a Gemini API key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Add it to `GEMINI_API_KEY` in `src/.env`

### 4. Start the server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs at **http://localhost:5000**

Verify with:
```bash
curl http://localhost:5000/health
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | HTTP server port |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Frontend origin for CORS |
| `API_KEY` | **Yes** | — | Secret key validated against `x-api-key` header |
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini API key |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Model used for extraction |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart on file changes) |
| `npm start` | Start production server |
| `npm test` | Placeholder (no tests configured yet) |

---

## API Endpoints

### `GET /health`

Health check — no authentication required.

**Response (200):**
```json
{
  "success": true,
  "message": "GrowEasy CSV Importer API is running"
}
```

---

### `POST /api/v1/csv/upload`

Upload and process a CSV file with AI field extraction.

**Authentication:** Required — `x-api-key` header

**Request:**
```
POST /api/v1/csv/upload
Content-Type: multipart/form-data
x-api-key: <your-api-key>

file: <csv-file>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "CSV processed successfully. 4 imported, 1 skipped.",
  "data": [
    {
      "status": "success",
      "skipReason": null,
      "data": {
        "created_at": "2026-05-13 14:20:48",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "country_code": "+91",
        "mobile_without_country_code": "9876543210",
        "company": "GrowEasy",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "lead_owner": null,
        "crm_status": "GOOD_LEAD_FOLLOW_UP",
        "crm_note": "Client is asking to reschedule demo",
        "data_source": null,
        "possession_time": null,
        "description": null
      }
    },
    {
      "status": "skipped",
      "skipReason": "Record contains neither email nor mobile number",
      "data": { "...": "..." }
    }
  ],
  "summary": {
    "totalProcessed": 5,
    "totalImported": 4,
    "totalSkipped": 1,
    "extractionMethod": "ai"
  }
}
```

**Error Responses:**

| Status | Body | Cause |
|--------|------|-------|
| `401` | `{ "success": false, "message": "Unauthorized" }` | Missing `x-api-key` |
| `403` | `{ "success": false, "message": "Invalid API Key" }` | Wrong API key |
| `400` | `{ "success": false, "message": "Please upload a CSV file." }` | No file in request |
| `400` | `{ "success": false, "message": "CSV file is empty." }` | CSV has no data rows |
| `500` | `{ "success": false, "message": "..." }` | Server or processing error |

---

## Processing Pipeline

```
Upload (Multer)
    │
    ▼
Parse CSV (csv-parser stream)
    │
    ▼
Delete temp file
    │
    ▼
Split into batches of 20
    │
    ▼
For each batch:
    ├── Try Gemini AI (3 retries)
    │       │
    │       ▼
    │   Normalize & validate output
    │
    └── On failure → Rule-based mapper
    │
    ▼
Merge all batch results
    │
    ▼
Return JSON response
```

### Batch Processing Details

- **Batch size:** 20 records (configurable in `csv.service.js` via `BATCH_SIZE`)
- **Processing order:** Sequential (one batch at a time to avoid rate limits)
- **Retry logic:** 3 attempts per batch for AI calls
- **Fallback:** If all AI retries fail, rule-based mapper processes the batch
- **File cleanup:** Uploaded temp file deleted immediately after parsing

---

## AI Extraction

### Model

Default: `gemini-2.0-flash` (configurable via `GEMINI_MODEL` env var)

### Prompt Engineering (`utils/promptBuilder.js`)

The prompt instructs Gemini to:

- Map arbitrary CSV column names to GrowEasy CRM schema
- Return exactly one JSON object per input record (same order)
- Mark records without email/mobile as `skipped`
- Handle multiple emails/phones (first used, rest in `crm_note`)
- Use only allowed `crm_status` and `data_source` enum values
- Return `null` for missing fields (not empty strings)

### Retry Logic (`services/ai.service.js`)

```
Attempt 1 → fail → Attempt 2 → fail → Attempt 3 → fail → throw error → fallback
```

Each attempt:
1. Sends batch + prompt to Gemini
2. Strips markdown code fences from response
3. Parses JSON array
4. Validates response is an array

### Output Normalization (`utils/crmRecordNormalizer.js`)

Post-AI validation:
- Ensures all 15 CRM fields exist (null if missing)
- Validates `crm_status` against allowed enum
- Validates `data_source` against allowed enum
- Validates `created_at` is JS-parseable
- Re-checks email/mobile presence; marks as skipped if missing

---

## Rule-Based Fallback

When Gemini AI fails (quota exceeded, network error, invalid response), the system falls back to `utils/ruleBasedMapper.js`.

### How It Works

1. **Column detection** — regex patterns match common column name variants:
   - `name` → `Name`, `Full Name`, `Customer Name`, `Lead Name`
   - `email` → `Email`, `Email Address`, `Mail`
   - `mobile` → `Phone`, `Mobile`, `Contact Number`, `Cell`
   - And 12 more field patterns...

2. **Phone parsing** — extracts country code and mobile from combined formats like `+919876543210`

3. **Status mapping** — keyword matching:
   - "follow up" → `GOOD_LEAD_FOLLOW_UP`
   - "did not connect" / "busy" → `DID_NOT_CONNECT`
   - "bad lead" / "not interested" → `BAD_LEAD`
   - "sale done" / "closed" → `SALE_DONE`

4. **Skip logic** — records without email or mobile marked as skipped

---

## CRM Record Format

Each record in the response `data` array:

```typescript
{
  status: "success" | "skipped",
  skipReason: string | null,
  data: {
    created_at: string | null,
    name: string | null,
    email: string | null,
    country_code: string | null,
    mobile_without_country_code: string | null,
    company: string | null,
    city: string | null,
    state: string | null,
    country: string | null,
    lead_owner: string | null,
    crm_status: "GOOD_LEAD_FOLLOW_UP" | "DID_NOT_CONNECT" | "BAD_LEAD" | "SALE_DONE" | null,
    crm_note: string | null,
    data_source: "leads_on_demand" | "meridian_tower" | "eden_park" | "varah_swamy" | "sarjapur_plots" | null,
    possession_time: string | null,
    description: string | null
  }
}
```

---

## Error Handling

| Layer | Mechanism |
|-------|-----------|
| Routes | `asyncHandler` wraps controllers to catch async errors |
| Controllers | Validates file presence, delegates to service |
| Services | Throws `AppError` with status codes for known errors |
| AI Service | Retries 3 times, then throws; CSV service catches and falls back |
| Global | `globalErrorHandler` middleware returns consistent JSON error responses |

Error response format:
```json
{
  "success": false,
  "status": "error",
  "message": "Human-readable error description"
}
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Batch size of 20 | Balances AI context window usage vs. API call count |
| Sequential batch processing | Avoids Gemini rate limits on free tier |
| AI + fallback dual strategy | Ensures app works even when AI quota is exhausted |
| API key auth (not JWT) | Simple, sufficient for assignment scope |
| Temp file deletion after parse | Prevents disk accumulation from uploads |
| Client-side preview | Assignment requirement — no AI until user confirms |
| Normalizer post-AI | Defense in depth — catches invalid AI output |

---

## Testing

### Health check

```bash
curl http://localhost:5000/health
```

### Upload sample CSV

From project root:

```bash
curl -X POST http://localhost:5000/api/v1/csv/upload \
  -H "x-api-key: groweasy-dev-api-key" \
  -F "file=@sample-leads.csv"
```

### Test without API key (should fail)

```bash
curl -X POST http://localhost:5000/api/v1/csv/upload \
  -F "file=@sample-leads.csv"
# Expected: 401 Unauthorized
```

### Test with wrong API key (should fail)

```bash
curl -X POST http://localhost:5000/api/v1/csv/upload \
  -H "x-api-key: wrong-key" \
  -F "file=@sample-leads.csv"
# Expected: 403 Invalid API Key
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY is not configured` | Add key to `src/.env` |
| All records show `extractionMethod: "rule-based-fallback"` | Gemini quota exceeded or key invalid — check [AI Studio](https://aistudio.google.com/) |
| `EADDRINUSE :::5000` | Port in use — kill process or change `PORT` |
| Env vars not loading | Ensure `.env` is at `src/.env`, not project root |
| CORS errors from frontend | Set `CORS_ORIGIN=http://localhost:3000` |
| `401` from frontend | Ensure `NEXT_PUBLIC_API_KEY` matches backend `API_KEY` |
| Empty CSV error | File must have at least one data row with headers |
| AI returns fewer records than input | Normalizer marks missing records as skipped |

---

## Author

**Karan Kumar**

Part of the GrowEasy Software Developer Assignment.
