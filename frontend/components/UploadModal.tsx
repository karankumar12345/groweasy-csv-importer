"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "./Modal";
import CSVUpload from "./CsvUpload";
import CSVPreviewTable from "./CSVPreviewTable";
import { ParsedCRMRecord } from "./CRMRecordTable";
import { uploadCSV } from "@/services/csv.service";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onImportSuccess: (records: ParsedCRMRecord[]) => void;
  setLoading: (value: boolean) => void;
  isImporting: boolean;
}

export default function UploadModal({
  isOpen,
  onClose,
  selectedFile,
  onFileSelect,
  onImportSuccess,
  setLoading,
  isImporting,
}: UploadModalProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      setHeaders([]);
      setRows([]);
      setPage(1);
    }
  }, [isOpen]);

  const handleFileUpload = (
    file: File,
    parsedRows: Record<string, unknown>[],
    parsedHeaders: string[]
  ) => {
    onFileSelect(file);
    setRows(parsedRows);
    setHeaders(parsedHeaders);
    setPage(1);
  };

  const handleConfirm = async () => {
    if (!selectedFile || isImporting) return;

    try {
      setLoading(true);

      const response = await uploadCSV(selectedFile);

      if (!response.data?.length) {
        toast.error("No records were extracted from the CSV");
        return;
      }

      toast.success(response.message || "Import completed successfully");
      onImportSuccess(response.data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "CSV upload failed");
    } finally {
      setLoading(false);
    }
  };

  const hasData = rows.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={isImporting ? () => {} : onClose} title="Upload CSV File">
      <div className="space-y-6">
        <CSVUpload onFileUpload={handleFileUpload} disabled={isImporting} />

        {selectedFile && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-green-600 dark:text-green-400" />

              <div className="flex-1">
                <p className="font-semibold truncate text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB · {rows.length} rows
                </p>
              </div>
            </div>
          </div>
        )}

        {hasData && (
          <>
            <CSVPreviewTable
              headers={headers}
              rows={rows}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />

            {isImporting && (
              <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-medium text-indigo-900 dark:text-indigo-200">
                    AI is extracting CRM fields...
                  </p>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400">
                    Processing {rows.length} records in batches. This may take a moment.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
              <button
                onClick={onClose}
                disabled={isImporting}
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isImporting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isImporting ? "Importing..." : "Confirm Import"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
