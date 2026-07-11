"use client";

import { useCallback } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";


interface CSVUploadProps {
  onFileUpload: (
    file: File,
    rows: Record<string, unknown>[],
    headers: string[]
  ) => void;
  disabled?: boolean;
}

export default function CSVUpload({
  onFileUpload,
  disabled = false,
}: CSVUploadProps) {
  const handleFile = (file: File) => {
    if (disabled) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    import("papaparse").then((Papa) => {
      Papa.default.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            alert("Failed to parse CSV. Please check the file format.");
            return;
          }

          const data = result.data as Record<string, unknown>[];
          const headers = data.length ? Object.keys(data[0]) : [];
          onFileUpload(file, data, headers);
        },
        error: () => {
          alert("Failed to parse CSV. Please check the file format.");
        },
      });
    });
  };



    const onDrop = useCallback(
        (acceptedFiles: File[]) => {

            const file = acceptedFiles[0];

            if (file) {
                handleFile(file);
            }

        },
        []
    );



    const {
        getRootProps,
        getInputProps,
        isDragActive

    } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
        },
        multiple: false,
        disabled,
    });



    return (

        <div
            {...getRootProps()}
            className={`
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            p-8
            transition

            ${isDragActive
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }
            ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}

            dark:border-gray-700
            dark:bg-gray-800
            `}
        >

            <input {...getInputProps()} />


            <Upload
                size={45}
                className="text-red-600"
            />


            {
                isDragActive
                    ?

                    <p className="mt-3 font-semibold">
                        Drop CSV file here
                    </p>

                    :

                    <>
                        <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                            Drag & Drop your CSV
                        </p>

                        <p className="text-sm text-gray-500">
                            or click to browse
                        </p>
                    </>

            }


        </div>

    );
}