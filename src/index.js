import puppeteer from "puppeteer";
import { serveCardsPage } from "./server.js";

export const print = async ({ images, outputPath }) => {
  const { serverUrl, closeServer } = serveCardsPage(images);

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();

    await page.goto(serverUrl, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");
    const res = await page
      .pdf({
        path: outputPath,
        format: "A4",
      })
      .finally(closeServer);
    return { outputPath, pdf: res };
  } finally {
    await browser.close();
  }
};
