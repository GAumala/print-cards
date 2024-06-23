import { chunkArray } from "./array.js";

const CARDS_PER_PAGE = 9;

const getMatrixPositionFromIndex = (i) => {
  switch (i % CARDS_PER_PAGE) {
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
const generateCardDataFromImages = (images) =>
  images
    .map((img, index) => Array(img.copies).fill({ path: img.path, index }))
    .flat()
    .map((card, i) => {
      const { row, col } = getMatrixPositionFromIndex(i);
      return { ...card, src: "/img/" + card.index, row, col };
    });

export const generateCardDocument = (images) => {
  const chunks = chunkArray(generateCardDataFromImages(images), CARDS_PER_PAGE);
  return {
    pages: chunks.map((cards) => ({ cards })),
    images: images.map(({ path }) => path),
  };
};
