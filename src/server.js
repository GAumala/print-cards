import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import Mustache from "mustache";

import { generateCardDocument } from "./document.js";

const DEFAULT_PORT = 56748;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(__dirname, "../static");

const styleTemplate = fs.readFileSync(STATIC_DIR + "/style.css", {
  encoding: "utf8",
});
const indexTemplate = fs.readFileSync(STATIC_DIR + "/index.html", {
  encoding: "utf8",
});

const getImageIndexFromPath = (reqPath) => {
  try {
    return parseInt(reqPath.substring("/img/".length));
  } catch (e) {
    return null;
  }
};

const getImageContentTypeFromPath = (imgPath) => {
  if (imgPath.endsWith("png")) {
    return "image/png";
  }
  if (imgPath.endsWith("webp")) {
    return "image/webp";
  }
  return "image/jpeg";
};

const serveTextFile = (res, { content, contentType }) => {
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(content),
  });
  res.write(content);
  res.end();
};

const serveBinaryFile = (res, { contentPath, contentType }) => {
  const contentSize = fs.statSync(contentPath).size;
  const readStream = fs.createReadStream(contentPath, { highWaterMark: 4096 });
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": contentSize,
  });
  readStream.on("data", (chunk) => {
    res.write(chunk);
  });
  readStream.on("end", () => {
    res.end();
  });
};

const requestHandler = (doc) => (req, res) => {
  const reqPath = req.url;
  if (reqPath === "/style.css") {
    const css = Mustache.render(styleTemplate, doc.sizes);
    serveTextFile(res, { contentType: "text/css", content: css });
  } else if (reqPath === "/checked_tiles.png") {
    const imgPath = STATIC_DIR + reqPath;
    serveBinaryFile(res, {
      contentType: "image/png",
      contentPath: imgPath,
    });
  } else if (reqPath === "/") {
    const html = Mustache.render(indexTemplate, doc);
    serveTextFile(res, { contentType: "text/html", content: html });
  } else if (reqPath.startsWith("/img/")) {
    const imgIndex = getImageIndexFromPath(reqPath);
    if (imgIndex === null) {
      res.writeHead(404);
      res.end();
      return;
    }

    const imgPath = doc.images[imgIndex];
    serveBinaryFile(res, {
      contentPath: imgPath,
      contentType: getImageContentTypeFromPath(imgPath),
    });
  } else {
    res.writeHead(404);
    res.end();
  }
};

export const serveCardsPage = (params) => {
  const port = params.port || DEFAULT_PORT;
  const doc = generateCardDocument(params);
  const server = http.createServer(requestHandler(doc));
  new Promise((resolve, reject) => {
    server.listen(port);
    resolve();
  });

  const serverUrl = "http://localhost:" + port;
  return { serverUrl, closeServer: () => server.close() };
};
