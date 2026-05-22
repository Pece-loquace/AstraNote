import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PAGE_WIDTH = 520;

export default function PdfDocumentViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setPageNumber(1);
  };

  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () =>
    setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));

  return (
    <div className="pdf-document-viewer">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="text-center py-4 text-muted">Caricamento documento…</div>
        }
        error={
          <div className="alert alert-danger mb-0">
            Impossibile caricare il PDF. Verifica la connessione o riprova più
            tardi.
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          width={PAGE_WIDTH}
          loading={
            <div className="text-center py-3 text-muted">Caricamento pagina…</div>
          }
        />
      </Document>

      {numPages != null && numPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={goPrev}
            disabled={pageNumber <= 1}
          >
            ← Precedente
          </button>
          <span className="text-muted small">
            Pagina {pageNumber} di {numPages}
          </span>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={goNext}
            disabled={pageNumber >= numPages}
          >
            Successiva →
          </button>
        </div>
      )}
    </div>
  );
}
