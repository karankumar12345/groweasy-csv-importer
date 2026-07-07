# AI CSV Importer Frontend

Frontend application for the AI CSV Importer assignment built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

---

# Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- PapaParse
- React Dropzone
- React Hot Toast
- Next Themes
- Lucide React

---

# Project Setup

## 1. Create Next.js Project

```bash
npx create-next-app@latest frontend
```

Select the following options:

```
✔ TypeScript → Yes
✔ ESLint → Yes
✔ Tailwind CSS → Yes
✔ App Router → Yes
✔ Turbopack → Yes
```

---

## 2. Install Dependencies

### Runtime Dependencies

```bash
npm install lucide-react next-themes papaparse react-dropzone react-hot-toast
```

### Type Definitions

```bash
npm install -D @types/papaparse
```

> The remaining development dependencies (`typescript`, `eslint`, `tailwindcss`, etc.) are installed automatically by Create Next App.

---

# Available Scripts

Start development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

Start production server

```bash
npm run start
```

Run ESLint

```bash
npm run lint
```

---

# Project Structure

```
frontend/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── CSVPreviewTable.tsx
│   ├── CRMRecordTable.tsx
│   ├── CsvUpload.tsx
│   ├── Header.tsx
│   ├── Modal.tsx
│   ├── Pagination.tsx
│   ├── TableScrollArea.tsx
│   ├── UploadModal.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
│
├── public/
├── package.json
└── README.md
```

---

# Features

- Drag & Drop CSV Upload
- CSV Parsing using PapaParse
- CSV Preview
- Paginated Tables
- AI Parsed CRM Records Preview
- Success & Skipped Record Status
- Reusable Modal Component
- Responsive Design
- Sticky Table Headers
- Horizontal & Vertical Table Scroll
- Dark / Light Theme
- Toast Notifications

---

# Current Workflow

```
Upload CSV
      │
      ▼
Parse CSV
      │
      ▼
Preview Uploaded Data
      │
      ▼
Confirm Import
      │
      ▼
Display Parsed CRM Records (Mock Data)
```

---

# Installed Packages

## Dependencies

| Package | Purpose |
|---------|---------|
| next | React Framework |
| react | UI Library |
| react-dom | React DOM |
| tailwindcss | Styling |
| lucide-react | Icons |
| papaparse | CSV Parsing |
| react-dropzone | Drag & Drop Upload |
| react-hot-toast | Toast Notifications |
| next-themes | Dark / Light Theme |

## Dev Dependencies

| Package | Purpose |
|---------|---------|
| typescript | TypeScript Support |
| eslint | Linting |
| eslint-config-next | Next.js ESLint Rules |
| @types/node | Node.js Types |
| @types/react | React Types |
| @types/react-dom | React DOM Types |
| @types/papaparse | PapaParse Types |
| @tailwindcss/postcss | Tailwind PostCSS Plugin |

---

# Running the Project

```bash
git clone <repository-url>

cd groweasy-csv-importer/frontend

npm install

npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

# Future Improvements

- Backend Integration
- AI Column Mapping
- OpenAI API Integration
- CSV Validation
- Import Progress
- Search & Filtering
- Sorting
- Export Results
- Authentication

---

# Author

**Karan Kumar**