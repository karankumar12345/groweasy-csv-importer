/**
 * Split an array into smaller batches
 * @param {Array} array
 * @param {number} batchSize
 * @returns {Array}
 */

function batchArray(array, batchSize = 20) {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array.");
  }

  if (batchSize <= 0) {
    throw new Error("Batch size must be greater than 0.");
  }

  const batches = [];

  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }

  return batches;
}

module.exports = batchArray;