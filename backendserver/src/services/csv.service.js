const fs = require("fs/promises");
const parseCSV = require("../utils/csvParser");
const { createBatches } = require("./batch.services");
const AppError = require("../utils/AppError");
const STATUS_CODES = require("../utils/statusCode");

class CSVService {
  async ProcessCSV(filePath) {
    try {
      const records = await parseCSV(filePath);

      if (!records || records.length === 0) {
        throw new AppError(
          "CSV file is empty.",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const batches = createBatches(records, 20);

      // Delete uploaded file
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete uploaded file:", err.message);
      }

      return {
        totalRecords: records.length,
        totalBatches: batches.length,
        batches,
      };
    } catch (error) {
      // Re-throw AppError
      if (error instanceof AppError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new AppError(
        error.message || "Failed to process CSV file.",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = new CSVService();