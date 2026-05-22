import { useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PREVIEW_WIDTH = 280;
const JPEG_QUALITY = 0.85;

export default function PdfUploadPreview({ file, onThumbnailReady }) {
  const canvasRef = useRef(null);

  const handleRenderSuccess = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (blob) onThumbnailReady?.(blob);
      },
      "image/jpeg",
      JPEG_QUALITY
    );
  }, [onThumbnailReady]);

  if (!file) return null;

  return (
    <div className="pdf-upload-preview border rounded p-2 bg-light">
      <p className="form-text mb-2">Anteprima prima pagina</p>
      <Document
        file={file}
        loading={
          <span className="text-muted small">Caricamento anteprima…</span>
        }
        error={
          <span className="text-danger small">
            Impossibile mostrare l&apos;anteprima
          </span>
        }
      >
        <Page
          pageNumber={1}
          width={PREVIEW_WIDTH}
          canvasRef={canvasRef}
          onRenderSuccess={handleRenderSuccess}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
