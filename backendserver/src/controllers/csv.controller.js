const { CSVService } = require("../services");
const asyncHandler = require("../utils/asyncHandler");
const STATUS_CODES = require("../utils/statusCode");

class CSVController {
  UploadCSV = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Please upload a CSV file.",
      });
    }

    const result = await CSVService.ProcessCSV(req.file.path);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: `CSV processed successfully. ${result.summary.totalImported} imported, ${result.summary.totalSkipped} skipped.`,
      data: result.records,
      summary: result.summary,
    });
  });
}

module.exports = new CSVController();
