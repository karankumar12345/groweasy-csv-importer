"use client";

import { useMemo, useState } from "react";
import { TableScrollArea } from "./TableScrollArea";
import { Pagination } from "./Pagination";

// Defined CRM field keys based on the backend schema
export type CRMField =
  | "created_at"
  | "name"
  | "email"
  | "country_code"
  | "mobile_without_country_code"
  | "company"
  | "city"
  | "state"
  | "country"
  | "lead_owner"
  | "crm_status"
  | "crm_note"
  | "data_source"
  | "possession_time"
  | "description";

export interface ParsedCRMRecord {
  status: "success" | "skipped";
  skipReason?: string;
  data: Partial<Record<CRMField, string | null | any>>;
}

interface ParsedResultsTableProps {
  records: ParsedCRMRecord[];
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const CRM_HEADERS: { key: CRMField; label: string }[] = [
  { key: "created_at", label: "Created At" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "country_code", label: "Code" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "lead_owner", label: "Lead Owner" },
  { key: "crm_status", label: "CRM Status" },
  { key: "crm_note", label: "CRM Note" },
  { key: "data_source", label: "Source" },
  { key: "possession_time", label: "Possession Time" },
  { key: "description", label: "Description" },
];

export default function ParsedResultsTable({
  records,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: ParsedResultsTableProps) {
  // Filter tabs to switch between view types seamlessly
  const [activeTab, setActiveTab] = useState<"all" | "success" | "skipped">("all");

  // Summary Metrics calculations
  const metrics = useMemo(() => {
    let imported = 0;
    let skipped = 0;
    records.forEach((rec) => {
      if (rec.status === "success") imported++;
      if (rec.status === "skipped") skipped++;
    });
    return { imported, skipped, total: records.length };
  }, [records]);

  // Filtered dataset based on the active tab
  const filteredRecords = useMemo(() => {
    if (activeTab === "success") return records.filter((r) => r.status === "success");
    if (activeTab === "skipped") return records.filter((r) => r.status === "skipped");
    return records;
  }, [records, activeTab]);

  // Paginated chunk for render efficiency
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRecords.slice(start, start + limit);
  }, [filteredRecords, page, limit]);

  if (!records.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No CRM Records Found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Run your AI extraction or provide clean pipeline results to review here.
        </p>
      </div>
    );
  }

  // Visual component for status tags
  const renderStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      SALE_DONE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
      GOOD_LEAD_FOLLOW_UP: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
      DID_NOT_CONNECT: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
      BAD_LEAD: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
    };
    const style = colors[status] || "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
      
      {/* Metrics Summary & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Parsed CRM Records</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review final structural extractions before finishing import.
          </p>
        </div>

        {/* Quantified Breakdown Cards */}
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 block">Total Processed</span>
            <span className="font-bold text-base text-gray-900 dark:text-white">{metrics.total}</span>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
            <span className="text-emerald-600 dark:text-emerald-400 block">Total Imported</span>
            <span className="font-bold text-base text-emerald-700 dark:text-emerald-400">{metrics.imported}</span>
          </div>
          <div className="bg-rose-50/50 dark:bg-rose-950/20 px-4 py-2 rounded-lg border border-rose-100 dark:border-rose-900/30">
            <span className="text-rose-600 dark:text-rose-400 block">Total Skipped</span>
            <span className="font-bold text-base text-rose-700 dark:text-rose-400">{metrics.skipped}</span>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 bg-gray-50/50 dark:bg-gray-800/20 text-sm">
        {(["all", "success", "skipped"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              onPageChange(1);
            }}
            className={`py-3 px-4 font-medium border-b-2 capitalize transition-colors -mb-px ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab === "all" && `All Records (${metrics.total})`}
            {tab === "success" && `Successfully Parsed (${metrics.imported})`}
            {tab === "skipped" && `Skipped Records (${metrics.skipped})`}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      <TableScrollArea maxHeight="600px">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">#</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">Record Status</th>
              {CRM_HEADERS.map((header) => (
                <th key={header.key} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedRows.map((record, index) => {
              const globalIndex = (page - 1) * limit + index + 1;
              const isSkipped = record.status === "skipped";

              return (
                <tr
                  key={globalIndex}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${
                    isSkipped ? "bg-rose-50/20 dark:bg-rose-950/10" : ""
                  }`}
                >
                  {/* Absolute Row Index Counter */}
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-400">{globalIndex}</td>

                  {/* Parse Lifecycle Status Badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isSkipped ? (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                          Skipped
                        </span>
                        {record.skipReason && (
                          <span className="text-[11px] text-rose-500 mt-0.5 max-w-[160px] truncate" title={record.skipReason}>
                            {record.skipReason}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        Valid
                      </span>
                    )}
                  </td>

                  {/* Data Content Iteration */}
                  {CRM_HEADERS.map((header) => {
                    const value = record.data[header.key];
                    return (
                      <td
                        key={header.key}
                        className={`px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 ${
                          isSkipped ? "opacity-50" : ""
                        }`}
                      >
                        {header.key === "crm_status" && value
                          ? renderStatusBadge(value)
                          : value?.toString() || <span className="text-gray-300 dark:text-gray-600">-</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScrollArea>

      {/* Pagination Controls */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Pagination
          currentPage={page}
          totalItems={filteredRecords.length}
          itemsPerPage={limit}
          onPageChange={onPageChange}
          onLimitChange={(value) => {
            onLimitChange(value);
            onPageChange(1);
          }}
        />
      </div>
    </div>
  );
}