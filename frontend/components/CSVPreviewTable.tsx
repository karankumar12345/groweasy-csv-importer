"use client";

import { useMemo } from "react";
import { TableScrollArea } from "./TableScrollArea";
import { Pagination } from "./Pagination";

interface CSVPreviewTableProps {
    headers: string[];
    rows: Record<string, any>[];

    page: number;
    limit: number;

    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export default function CSVPreviewTable({
    headers,
    rows,
    page,
    limit,
    onPageChange,
    onLimitChange,
}: CSVPreviewTableProps) {
    const paginatedRows = useMemo(() => {
        const start = (page - 1) * limit;
        return rows.slice(start, start + limit);
    }, [rows, page, limit]);

    if (!rows.length) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-16 text-center">
                <h3 className="text-lg font-semibold">
                    No CSV Uploaded
                </h3>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Upload a CSV file to preview its data.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 px-6 py-4">

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        CSV Preview
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Review your uploaded CSV before importing.
                    </p>
                </div>

                <div className="flex gap-6 text-sm">

                    <div>
                        <p className="text-gray-500">
                            Total Rows
                        </p>

                        <p className="font-semibold">
                            {rows.length}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Columns
                        </p>

                        <p className="font-semibold">
                            {headers.length}
                        </p>
                    </div>

                </div>

            </div>

            {/* Table */}

            <TableScrollArea maxHeight="600px">

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                    <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">

                        <tr>

                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                #
                            </th>

                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-left whitespace-nowrap font-semibold"
                                >
                                    {header}
                                </th>
                            ))}

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                        {paginatedRows.map((row, index) => (

                            <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                            >

                                <td className="px-4 py-3 whitespace-nowrap font-medium">
                                    {(page - 1) * limit + index + 1}
                                </td>

                                {headers.map((header) => (

                                    <td
                                        key={header}
                                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        {row[header] || "-"}
                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </TableScrollArea>

            {/* Footer */}

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">

                <Pagination
                    currentPage={page}
                    totalItems={rows.length}
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
