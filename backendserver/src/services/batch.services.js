const batchArray = require("../utils/batchArray");

const createBatches = (records, batchSize = 20) => {
  return batchArray(records, batchSize);
};

module.exports = {
  createBatches,
};