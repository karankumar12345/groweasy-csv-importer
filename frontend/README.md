# AI CSV Importer — Frontend

Modern, responsive web application for uploading CSV files, previewing raw data, and displaying AI-extracted GrowEasy CRM records.

Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Components](#components)
- [User Flow](#user-flow)
- [Backend Integration](#backend-integration)
- [State Management](#state-management)
- [Styling & Theming](#styling--theming)
- [Error Handling](#error-handling)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Overview

The frontend implements a four-step CSV import workflow:

1. **Upload** — drag-and-drop or file picker for `.csv` files
2. **Preview** — client-side parsing and table display (no backend call)
3. **Confirm** — sends file to backend for AI extraction
4. **Results** — displays parsed CRM records with success/skipped metrics

Key design principles:
- **No AI until confirm** — preview is entirely client-side
- **Responsive tables** — sticky headers, horizontal/vertical scroll, pagination
- **Loading feedback** — overlay and disabled controls during processing
- **Accessible UX** — toast notifications, dark mode, keyboard support (Escape to close modal)

---

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.10 | React framework with App Router |
| react | 19.2.4 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Utility-first CSS (via PostCSS) |
| papaparse | ^5.5.4 | Client-side CSV parsing |
| react-dropzone | ^15.0.0 | Drag-and-drop file upload |
| react-hot-toast | ^2.6.0 | Toast notifications |
| next-themes | ^0.4.6 | Dark/light theme switching |
| lucide-react | ^1.23.0 | Icon library |

---

## Prerequisites

- Node.js 18+
- npm 9+
- Backend server running at `http://localhost:5000` (see [backendserver/README.md](../backendserver/README.md))

---

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_KEY=groweasy-dev-api-key
```

> `NEXT_PUBLIC_API_KEY` must match the `API_KEY` in the backend's `src/.env`.

### 3. Start development server

```bash
npm run dev
```

Open **http://localhost:3000**

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend server URL (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_API_KEY` | Yes | API key sent as `x-api-key` header on upload requests |

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put secrets here beyond the API key intended for client use.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
frontend/
│
├── app/
│   ├── globals.css           # Tailwind v4 import + dark mode base styles
│   ├── layout.tsx            # Root layout — ThemeProvider, Toaster
│   └── page.tsx              # Main page — upload button, results, modal state
│
├── components/
│   ├── CsvUpload.tsx         # Drag-and-drop zone + PapaParse parsing
│   ├── CSVPreviewTable.tsx   # Raw CSV preview table (in upload modal)
│   ├── CRMRecordTable.tsx    # AI-parsed CRM results with tabs and metrics
│   ├── UploadModal.tsx       # Modal orchestrating upload → preview → confirm
│   ├── Modal.tsx             # Reusable modal shell (backdrop, Escape key)
│   ├── Pagination.tsx        # Page navigation + items-per-page selector
│   ├── TableScrollArea.tsx   # Scrollable table with synced horizontal scroll
│   ├── Header.tsx            # Sticky header with app title + theme toggle
│   ├── theme-provider.tsx    # next-themes context wrapper
│   └── theme-toggle.tsx      # Sun/moon theme toggle button
│
├── services/
│   └── csv.service.ts        # Backend API client (uploadCSV)
│
├── public/                   # Static assets
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript config (@/* path alias)
├── postcss.config.mjs        # Tailwind PostCSS plugin
└── README.md
```

---

## Components

### `app/page.tsx` — Main Page

Orchestrates the entire application state:
- Modal open/close
- Selected file reference
- Parsed CRM records array
- Loading state
- Pagination (page, limit)

Conditionally renders empty state or `CRMRecordTable` based on whether results exist.

### `UploadModal.tsx` — Upload Flow

Multi-step modal containing:
1. `CsvUpload` — file selection
2. File info card (name, size, row count)
3. `CSVPreviewTable` — raw data preview
4. Confirm/Cancel buttons
5. In-modal loading indicator during import

Props:
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Modal visibility |
| `onClose` | function | Close handler |
| `selectedFile` | File \| null | Currently selected file |
| `onFileSelect` | function | File selection callback |
| `onImportSuccess` | function | Called with parsed CRM records |
| `setLoading` | function | Sets global loading state |
| `isImporting` | boolean | Disables controls during import |

### `CsvUpload.tsx` — File Upload

- Uses `react-dropzone` for drag-and-drop and click-to-browse
- Accepts only `.csv` files
- Dynamically imports `papaparse` for client-side parsing
- Parses with `header: true`, `skipEmptyLines: true`
- Reports parse errors to user

### `CSVPreviewTable.tsx` — Raw Preview

- Dynamically renders all CSV columns as table headers
- Shows row count and column count
- Paginated with configurable page size (10/25/50/100)
- Uses `TableScrollArea` for sticky headers and scroll

### `CRMRecordTable.tsx` — Results Display

The main results view after AI processing:

**Summary cards:**
- Total Processed
- Total Imported (success count)
- Total Skipped

**Filter tabs:**
- All Records
- Successfully Parsed
- Skipped Records

**Table columns:** All 15 CRM fields plus row index and record status badge.

**Features:**
- Color-coded CRM status badges (`SALE_DONE`, `GOOD_LEAD_FOLLOW_UP`, etc.)
- Skip reason display for skipped records
- Highlighted rows for skipped records
- Pagination with limit selector

**Types exported:**
```typescript
type CRMField = "created_at" | "name" | "email" | ... ;

interface ParsedCRMRecord {
  status: "success" | "skipped";
  skipReason?: string;
  data: Partial<Record<CRMField, string | null>>;
}
```

### `TableScrollArea.tsx` — Scrollable Table Wrapper

- Vertical scroll with configurable `maxHeight`
- Synchronized horizontal scrollbar at top
- Sticky table headers

### `Pagination.tsx` — Pagination Controls

- Previous/Next navigation
- Page number display with jump-to-page input
- Items-per-page selector (10, 25, 50, 100)
- Shows "Showing X–Y of Z" range

### `Modal.tsx` — Reusable Modal

- Backdrop click to close
- Escape key to close
- Body scroll lock when open
- Customizable title

### `Header.tsx` + Theme Components

- Sticky top header with app branding
- Dark/light mode toggle via `next-themes`

---

## User Flow

```
┌─────────────────────────────────────────────────────────┐
│  Home Page (empty state)                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  "No CSV uploaded yet"                          │    │
│  │  [Upload CSV] button                            │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────┘
                            │ click Upload CSV
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Upload Modal — Step 1: Upload                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Drag & Drop zone                               │    │
│  │  (react-dropzone)                               │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────┘
                            │ file selected → PapaParse
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Upload Modal — Step 2: Preview                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  File info: name, size, row count               │    │
│  │  CSVPreviewTable (paginated, scrollable)        │    │
│  │  [Cancel]  [Confirm Import]                     │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────┘
                            │ click Confirm Import
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Loading Overlay (full screen)                          │
│  "AI Processing in Progress..."                         │
│  POST /api/v1/csv/upload                                │
└───────────────────────────┬─────────────────────────────┘
                            │ response received
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Home Page — Results                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Summary: 5 Processed | 4 Imported | 1 Skipped│    │
│  │  Tabs: All | Success | Skipped                  │    │
│  │  CRMRecordTable (paginated, scrollable)         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Integration

### API Service (`services/csv.service.ts`)

```typescript
export const uploadCSV = async (file: File): Promise<UploadCSVResponse>
```

- Sends `POST` to `${NEXT_PUBLIC_API_URL}/api/v1/csv/upload`
- Includes `x-api-key` header from `NEXT_PUBLIC_API_KEY`
- Sends file as `multipart/form-data` with field name `file`
- Parses JSON response; throws on non-OK status with server error message

**Expected response shape:**
```typescript
interface UploadCSVResponse {
  success: boolean;
  message: string;
  data: ParsedCRMRecord[];
  summary?: {
    totalProcessed: number;
    totalImported: number;
    totalSkipped: number;
    extractionMethod?: "ai" | "rule-based-fallback";
  };
}
```

### Integration Checklist

| Check | Frontend | Backend |
|-------|----------|---------|
| API URL | `NEXT_PUBLIC_API_URL` → `http://localhost:5000` | Runs on port 5000 |
| API path | `/api/v1/csv/upload` | Route mounted at `/api/v1/csv/upload` |
| Auth header | `x-api-key: NEXT_PUBLIC_API_KEY` | Validated against `API_KEY` |
| Form field | `file` | Multer expects `file` |
| Response | Expects `data: ParsedCRMRecord[]` | Returns `{ data, summary }` |

---

## State Management

All state is managed locally with React `useState` — no external state library.

| State | Location | Purpose |
|-------|----------|---------|
| `isModalOpen` | `page.tsx` | Controls upload modal visibility |
| `selectedFile` | `page.tsx` | Reference to uploaded File object |
| `parsedRecords` | `page.tsx` | AI-extracted CRM records array |
| `loading` | `page.tsx` | Global import loading flag |
| `page`, `limit` | `page.tsx` | Results table pagination |
| `headers`, `rows` | `UploadModal.tsx` | Preview table data |
| `page`, `limit` | `UploadModal.tsx` | Preview table pagination |
| `activeTab` | `CRMRecordTable.tsx` | All / Success / Skipped filter |

---

## Styling & Theming

- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin
- **Dark mode** using `@custom-variant dark` in `globals.css`
- **Theme provider** wraps app in `layout.tsx` with `next-themes`
- **Color scheme:** Red accent (`bg-red-600`) for primary actions, indigo for tabs, emerald/rose for success/skip metrics
- **Responsive:** Flex layouts adapt from mobile to desktop; tables scroll horizontally on small screens

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Non-CSV file selected | Alert: "Only CSV files are allowed" |
| PapaParse failure | Alert: "Failed to parse CSV" |
| API upload failure | Toast error with server message |
| Missing API key | Backend returns 401; toast shows error |
| Empty AI response | Toast: "No records were extracted" |
| Network error | Toast: "CSV upload failed" |

During import:
- Confirm button shows spinner and "Importing..." text
- Cancel button and dropzone are disabled
- Modal cannot be closed (backdrop click disabled)
- Full-screen loading overlay on main page

---

## Building for Production

```bash
npm run build
npm run start
```

Build output goes to `.next/` directory. The app is statically prerendered for the home route.

For deployment, set environment variables in your hosting platform:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_API_KEY=your-production-api-key
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "CSV upload failed" toast | Check backend is running; verify `NEXT_PUBLIC_API_URL` |
| `401 Unauthorized` | Set `NEXT_PUBLIC_API_KEY` matching backend `API_KEY` |
| CORS error in browser console | Backend needs `CORS_ORIGIN` set to frontend URL |
| Preview shows no data | Ensure CSV has header row and at least one data row |
| Loading overlay stuck | Check browser Network tab for failed/stalled API request |
| Dark mode not working | Ensure `ThemeProvider` wraps app in `layout.tsx` |
| TypeScript path alias `@/*` not resolving | Check `tsconfig.json` paths configuration |

---

## Future Improvements

- [ ] Virtualized table for very large CSVs (10k+ rows)
- [ ] Real-time batch progress via Server-Sent Events
- [ ] Export parsed results as CSV/JSON download
- [ ] Search, filter, and sort on results table
- [ ] Column mapping override UI before confirm
- [ ] Unit tests for components and service layer
- [ ] File size limit indicator and validation

---

## Author

**Karan Kumar**

Part of the GrowEasy Software Developer Assignment.
