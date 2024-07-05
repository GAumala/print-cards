import puppeteer from "puppeteer";
import { serveCardsPage } from "./server.js";

const browserPromise = puppeteer.launch();

export const close = async () => {
  const browser = await browserPromise;
  browser.close();
};

const parsePageSize = (pageSize) => {
  const [x, y] = pageSize.split("x").map((s) => parseInt(s.trim()) * 10);
  if (x < y) {
    return { pageWidth: x, pageHeight: y };
  }
  return { pageWidth: y, pageHeight: x };
};

export const print = async ({ images, pageSize, outputPath }) => {
  const { pageWidth, pageHeight } = parsePageSize(pageSize);
  const { serverUrl, closeServer } = serveCardsPage({
    images,
    pageWidth,
    pageHeight,
  });

  const browser = await browserPromise;

  const page = await browser.newPage();
  await page.goto(serverUrl, { waitUntil: "networkidle0" });
  await page.emulateMediaType("screen");

  const pdfWidth = Math.floor(pageWidth / 10) + 'mm'
  const pdfHeight = Math.floor(pageHeight / 10) + 'mm'
  const res = await page
    .pdf({
      path: outputPath,
      width: pdfWidth,
      height: pdfHeight,
      printBackground: true,
    })
    .finally(closeServer);
  return { outputPath, pdf: res };
};
