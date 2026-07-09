const fs = require("fs");
const csv = require("csv-parser");

/**
 * Parse CSV file into JSON
 * @param {string} filePath
 * @returns {Promise<Array>}
 */

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push(row);
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = parseCSV;