const fs = require("fs/promises");
const parseCSV = require("../utils/csvParser");
const { createBatches } = require("./batch.services");
const AIService = require("./ai.service");
const AppError = require("../utils/AppError");
const STATUS_CODES = require("../utils/statusCode");
const {
  normalizeCRMRecords,
  createSkippedRecords,
} = require("../utils/crmRecordNormalizer");
const { extractCRMRecords } = require("../utils/ruleBasedMapper");

const BATCH_SIZE = 20;

class CSVService {
  async processBatchWithAI(batch) {
    const aiResults = await AIService.extractCRM(batch);
    
    const normalized = normalizeCRMRecords(aiResults);

    if (normalized.length < batch.length) {
      const missingCount = batch.length - normalized.length;
      console.warn(
        `AI returned ${normalized.length}/${batch.length} records. Marking ${missingCount} as skipped.`
      );

      return [
        ...normalized,
        ...createSkippedRecords(
          batch.slice(normalized.length),
          "AI did not return a result for this record"
        ),
      ];
    }

    return normalized.slice(0, batch.length);
  }

  processBatchWithRules(batch) {
    return extractCRMRecords(batch);
  }

  async ProcessCSV(filePath) {
    let records;

    try {
      console.log("Parsing CSV file... ",filePath);
      records = await parseCSV(filePath);
      console.log("CSV parsed successfully.",records);
    } catch (error) {
      throw new AppError(
        error.message || "Failed to parse CSV file.",
        STATUS_CODES.BAD_REQUEST
      );
    } finally {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete uploaded file:", err.message);
      }
    }

    if (!records || records.length === 0) {
      throw new AppError("CSV file is empty.", STATUS_CODES.BAD_REQUEST);
    }

    const batches = createBatches(records, BATCH_SIZE);
    console.log(`Processing ${batches} batches...`);
    const parsedRecords = [];
    let usedFallback = false;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} records)`);

      try {
        const batchResults = await this.processBatchWithAI(batch);
        parsedRecords.push(...batchResults);
      } catch (error) {
        console.warn(
          `AI batch ${i + 1} failed (${error.message}). Falling back to rule-based mapping.`
        );
        usedFallback = true;
        parsedRecords.push(...this.processBatchWithRules(batch));
      }
    }

    const totalImported = parsedRecords.filter((r) => r.status === "success").length;
    const totalSkipped = parsedRecords.filter((r) => r.status === "skipped").length;

    return {
      records: parsedRecords,
      summary: {
        totalProcessed: parsedRecords.length,
        totalImported,
        totalSkipped,
        extractionMethod: usedFallback ? "rule-based-fallback" : "ai",
      },
    };
  }
}

module.exports = new CSVService();
