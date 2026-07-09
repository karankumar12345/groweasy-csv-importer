const { CSVService } = require("../services");
const asyncHandler = require("../utils/asyncHandler");
const STATUS_CODES = require("../utils/statusCode");



class CSVController {
  UploadCSV =asyncHandler(async (req, res, next)=> {
    try {
      if (!req.file) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Please upload a CSV file.",
        });
      }
      console.log(req.file);

      const result = await CSVService.ProcessCSV(req.file.path);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "CSV processed successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
});

  
}

module.exports = new CSVController();