import { createPortal } from "react-dom";
import "../style/ConfermaDialog.css";

export default function ConfermaDialog({
    aperto,
    titolo = "Conferma",
    messaggio,
    confermaLabel = "Elimina",
    annullaLabel = "Annulla",
    onConferma,
    onAnnulla
})
{
    if (!aperto) return null;

    const ferma = (e) => e.stopPropagation();

    return createPortal(
        <div className="cd-overlay" onClick={onAnnulla} onKeyDown={(e) => { if (e.key === "Escape") onAnnulla(); }} role="presentation">
            <div
                className="cd-box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cd-title"
                onClick={ferma}
            >
                <h2 id="cd-title" className="cd-title">{titolo}</h2>
                <p className="cd-msg">{messaggio}</p>
                <div className="cd-actions">
                    <button type="button" className="cd-btn" onClick={onAnnulla}>{annullaLabel}</button>
                    <button type="button" className="cd-btn cd-btn-danger" onClick={onConferma}>{confermaLabel}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
