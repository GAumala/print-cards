import { chunkArray } from "./array.js";

const MIN_MARGIN = 100; // 10.0mm
const CARD_WIDTH = 635; // 63.5mm
const CARD_HEIGHT = 889; // 63.5mm
const CARD_MARGIN = 4; // 0.5mm

const generateCardDataFromImages = (images) =>
  images
    .map((img, index) => Array(img.copies).fill({ path: img.path, index }))
    .flat()
    .map((card, i) => ({
      ...card,
      src: "/img/" + card.index,
    }));

const calculateCardColumns = (pageWidth) => {
  const length = pageWidth - MIN_MARGIN;
  let columns = 1;
  while ((columns + 1) * CARD_WIDTH < length) {
    columns++;
  }
  return columns;
};
const calculateCardRows = (pageHeight) => {
  const length = pageHeight - MIN_MARGIN;
  let rows = 1;
  while ((rows + 1) * CARD_HEIGHT < length) {
    rows++;
  }
  return rows;
};

const formatMM = (value) => {
  const numbers = "" + value;
  if (numbers.length === 1) {
    return `0.${numbers}mm`;
  }
  const decimalIndex = numbers.length - 1;
  return (
    numbers.substring(0, decimalIndex) +
    "." +
    numbers.substring(decimalIndex) +
    "mm"
  );
};

const calculateDocumentSizes = ({ pageWidth, pageHeight, cardsPerPage }) => {
  const columns = calculateCardColumns(pageWidth);
  const rows = calculateCardRows(pageHeight);
  const containerWidth =
    CARD_WIDTH * columns + CARD_MARGIN * (columns + 1);
  const containerHeight =
    CARD_HEIGHT * rows + CARD_MARGIN * (rows + 1);
  const containerLeftMargin = Math.floor((pageWidth - containerWidth) / 2);
  const containerTopMargin = Math.floor((pageHeight - containerHeight) / 2);
  return {
    container: {
      width: formatMM(containerWidth),
      height: formatMM(containerHeight),
      leftMargin: formatMM(containerLeftMargin),
      topMargin: formatMM(containerTopMargin),
    },
    page: {
      width: formatMM(pageWidth),
      height: formatMM(pageHeight),
    },
  };
};

export const generateCardDocument = ({ images, pageWidth, pageHeight }) => {
  const columns = calculateCardColumns(pageWidth);
  const rows = calculateCardRows(pageHeight);
  const cardsPerPage = columns * rows;
  const chunks = chunkArray(generateCardDataFromImages(images), cardsPerPage);
  const sizes = calculateDocumentSizes({ pageWidth, pageHeight, cardsPerPage });

  return {
    pages: chunks.map((cards) => ({ cards })),
    images: images.map(({ path }) => path),
    sizes,
  };
};
