"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

import Modal from "./Modal";
import CSVUpload from "./CsvUpload";
import CSVPreviewTable from "./CSVPreviewTable";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onConfirmImport: (rows: Record<string, any>[]) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  selectedFile,
  onFileSelect,
  onConfirmImport,
}: UploadModalProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Reset modal state whenever it closes
  useEffect(() => {
    if (!isOpen) {
      setHeaders([]);
      setRows([]);
      setPage(1);
    }
  }, [isOpen]);

  // Called by CSVUpload after parsing
  const handleFileUpload = (
    file: File,
    parsedRows: Record<string, any>[],
    parsedHeaders: string[]
  ) => {
    onFileSelect(file);
    setRows(parsedRows);
    setHeaders(parsedHeaders);
    setPage(1);
  };

  const handleConfirm = () => {
    onConfirmImport(rows);
  };

  const hasData = rows.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload CSV File"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <CSVUpload onFileUpload={handleFileUpload} />

        {/* File Details */}
        {selectedFile && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <div className="flex items-center gap-3">
              <FileText
                size={24}
                className="text-green-600 dark:text-green-400"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-green-900 dark:text-green-200">
                  {selectedFile.name}
                </p>

                <p className="text-sm text-green-700 dark:text-green-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CSV Preview */}
        {hasData && (
          <div className="border-t pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  CSV Preview
                </h3>

                <p className="text-sm text-gray-500">
                  Showing {rows.length} records
                </p>
              </div>
            </div>

            <CSVPreviewTable
              headers={headers}
              rows={rows}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}

        {/* Footer Buttons */}
        {hasData && (
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Confirm Import
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}