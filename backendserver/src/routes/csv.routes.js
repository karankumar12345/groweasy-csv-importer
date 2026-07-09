const express = require("express");
const multer = require("multer");

const router = express.Router();
const { CSVController } = require("../controllers");

const upload = multer({
    dest: "uploads/",
});

router.post(
    "/upload",
    upload.single("file"),
    CSVController.UploadCSV
);

module.exports = router;