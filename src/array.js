export const chunkArray = (array, chunkSize) => {
  const chunks = [];
  const copyArray = Array.from(array); // Create a copy of the original array

  while (copyArray.length > 0) {
    chunks.push(copyArray.splice(0, chunkSize));
  }

  return chunks;
};
