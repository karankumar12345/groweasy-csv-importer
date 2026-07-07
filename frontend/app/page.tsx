"use client";

import { useState } from "react";
import Header from "@/components/Header";
import UploadModal from "@/components/UploadModal";
import ParsedResultsTable, { ParsedCRMRecord } from "@/components/CRMRecordTable";

// Production mock data reflecting the AI extraction schema requirements
const MOCK_PARSED_RECORDS: ParsedCRMRecord[] = [
  {
    status: "success",
    data: {
      created_at: "2026-05-13 14:20:48",
      name: "John Doe",
      email: "john.doe@example.com",
      country_code: "+91",
      mobile_without_country_code: "9876543210",
      company: "GrowEasy",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      lead_owner: "test@gmail.com",
      crm_status: "GOOD_LEAD_FOLLOW_UP",
      crm_note: "Client is asking to reschedule demo",
      data_source: null,
      possession_time: null,
      description: null,
    },
  },
  {
    status: "success",
    data: {
      created_at: "2026-05-13 14:25:30",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      country_code: "+91",
      mobile_without_country_code: "9876543211",
      company: "Tech Solutions",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      lead_owner: "test@gmail.com",
      crm_status: "DID_NOT_CONNECT",
      crm_note: "Person was busy, will try again next week",
      data_source: null,
      possession_time: null,
      description: null,
    },
  },
  {
    status: "skipped",
    skipReason: "Missing primary phone number identity field mapping",
    data: {
      created_at: "2026-05-13 14:30:15",
      name: "Rajesh Patel",
      email: "rajesh.patel@example.com",
      country_code: "+91",
      mobile_without_country_code: "",
      company: "Startup Inc",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      lead_owner: "test@gmail.com",
      crm_status: "BAD_LEAD",
      crm_note: "Not interested in our services",
      data_source: null,
      possession_time: null,
      description: null,
    },
  },
  {
    status: "success",
    data: {
      created_at: "2026-05-13 14:35:22",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      country_code: "+91",
      mobile_without_country_code: "9876543213",
      company: "Enterprise Corp",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      lead_owner: "test@gmail.com",
      crm_status: "SALE_DONE",
      crm_note: "Deal closed, onboarding in progress",
      data_source: null,
      possession_time: null,
      description: null,
    },
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dynamic pagination state configuration
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Toggle true once file processing pipeline finishes to display layout change
  const hasData = MOCK_PARSED_RECORDS.length > 0;

  return (
    <>
      <Header />

      <main className="mx-auto  p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI CSV Importer
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Upload any CSV and preview the data before importing.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 transition-colors"
          >
            Upload CSV
          </button>
        </div>

        {/* Conditional rendering view layer swap */}
        {!hasData ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No CSV uploaded yet.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Click the upload button to parse records with AI.
            </p>
          </div>
        ) : (
          <ParsedResultsTable
            records={MOCK_PARSED_RECORDS}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}

        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />
      </main>
    </>
  );
}