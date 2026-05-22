import * as pdfjs from "pdfjs-dist";
import "./pdfConfig.js"; // 👈 usa la config centralizzata

const THUMB_MAX_WIDTH = 400;
const JPEG_QUALITY = 0.85;

export async function thumbnailFromPdf(file, { maxWidth = THUMB_MAX_WIDTH } = {}) {
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const page = await pdf.getPage(1);

  const baseViewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext("2d"),
    viewport,
  }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Impossibile generare l'anteprima del PDF")),
      "image/jpeg",
      JPEG_QUALITY
    );
  });
}