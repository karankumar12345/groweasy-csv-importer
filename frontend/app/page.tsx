"use client";

import { useState } from "react";
import { Loader2, UploadCloud, FileSpreadsheet } from "lucide-react";
import Header from "@/components/Header";
import UploadModal from "@/components/UploadModal";
import ParsedResultsTable, { ParsedCRMRecord } from "@/components/CRMRecordTable";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [parsedRecords, setParsedRecords] = useState<ParsedCRMRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const hasData = parsedRecords.length > 0;

  return (
<div className="flex h-screen w-screen flex-col bg-gray-50/50 text-gray-900 overflow-hidden dark:bg-zinc-950 dark:text-zinc-50">

      <Header />


      <main className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-md transition-all">
            <div className="mx-4 flex max-w-sm flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                AI Processing in Progress
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                Extracting and mapping CRM fields from your CSV. Please wait...
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Header Banner */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                Powered by AI
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                AI CSV Importer
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400 max-w-xl">
                Upload any legacy or raw CSV. Our AI models will instantly parse, structure, and map data fields to your CRM schema perfectly.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <UploadCloud className="h-4 w-4" />
              Upload CSV File
            </button>
          </div>
        </div>

        {/* Data View Area */}
        {!hasData ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-zinc-200">
              No CSV uploaded yet
            </h3>
            <p className="mt-1 max-w-xs text-xs text-gray-400 dark:text-zinc-500">
              Click the upload button above to select a file and begin AI-assisted mapping.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            <ParsedResultsTable
              records={parsedRecords}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}

        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onImportSuccess={(records) => {
            setParsedRecords(records);
            setPage(1);
            setIsModalOpen(false);
          }}
          setLoading={setLoading}
          isImporting={loading}
        />
      </main>
    </div>
  );
}