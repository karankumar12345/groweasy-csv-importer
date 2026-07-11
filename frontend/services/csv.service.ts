import { ParsedCRMRecord } from "@/components/CRMRecordTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface UploadCSVResponse {
  success: boolean;
  message: string;
  data: ParsedCRMRecord[];
  summary?: {
    totalProcessed: number;
    totalImported: number;
    totalSkipped: number;
  };
}

export const uploadCSV = async (file: File): Promise<UploadCSVResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/v1/csv/upload`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY || "",
    },
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "CSV upload failed");
  }

  return payload;
};
