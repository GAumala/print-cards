const getMatrixPositionFromIndex = (i) => {
  switch (i) {
    case 0:
      return { row: 0, col: 0 };
    case 1:
      return { row: 0, col: 1 };
    case 2:
      return { row: 0, col: 2 };
    case 3:
      return { row: 1, col: 0 };
    case 4:
      return { row: 1, col: 1 };
    case 5:
      return { row: 1, col: 2 };
    case 6:
      return { row: 2, col: 0 };
    case 7:
      return { row: 2, col: 1 };
    case 8:
      return { row: 2, col: 2 };
  }
};
export const generateCardDataFromImages = (images) =>
  images
    .map((img) => Array(img.copies).fill({ path: img.path }))
    .flat()
    .map((card, i) => {
      const { row, col } = getMatrixPositionFromIndex(i);
      return { ...card, src: "/img/" + i, row, col };
    });
