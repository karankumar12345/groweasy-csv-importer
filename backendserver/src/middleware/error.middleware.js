module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Multer File Size Error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Maximum file size is 10MB.",
    });
  }

  // CSV Validation Error
  if (err.message === "Only CSV files are allowed.") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};