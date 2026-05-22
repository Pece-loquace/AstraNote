import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PAGE_WIDTH = 800;

export default function PdfDocumentViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
  };



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
        {
          Array.from({ length: numPages ?? 0 }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={PAGE_WIDTH}
              loading={null}
              className="pdf-page"
            />
          ))
        }
      </Document>
    </div>
  );
}
