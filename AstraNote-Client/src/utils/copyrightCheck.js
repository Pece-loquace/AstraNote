const EDITORI = [
    "pearson", "mcgraw-hill", "mcgraw hill", "zanichelli", "hoepli", "mondadori",
    "laterza", "il mulino", "springer", "wiley", "elsevier", "oxford university press",
    "cambridge university press", "addison-wesley", "cengage", "utet", "einaudi",
    "feltrinelli", "de agostini", "giuffrè", "giuffre", "cedam", "giappichelli",
    "wolters kluwer", "thomson reuters", "routledge", "sage publications",
    "harvard university press", "mit press", "macmillan", "penguin random",
    "harpercollins", "scholastic", "carocci", "rizzoli", "bompiani"
];

const ISBN_RE = /isbn(?:-1[03])?[:\s-]*((?:\d{3}[-\s]?)?\d{1,5}[-\s]?\d+[-\s]?\d+[-\s]?[\dX])/i;
const COPYRIGHT_RE = /(?:©|\(c\)|copyright|all rights reserved|tutti i diritti riservati|diritti d['’]autore|proprietà letteraria|vietata la riproduzione)/i;
const CASA_EDITRICE_RE = /casa editrice|published by|edizione\s+\d+|first published|stampato in/i;

function normalizza(testo)
{
    return String(testo || "").toLowerCase().replace(/\s+/g, " ");
}

export function valutaCopyright({ titolo, descrizione, nomeFile, testoPdf, numPagine })
{
    const insieme = [titolo, descrizione, nomeFile, testoPdf].map(normalizza).join(" \n ");
    const segnali = [];

    if (ISBN_RE.test(insieme)) segnali.push("ISBN");
    if (COPYRIGHT_RE.test(insieme)) segnali.push("avviso di copyright");
    const editore = EDITORI.find(e => insieme.includes(e));
    if (editore) segnali.push(`editore (${editore})`);
    if (CASA_EDITRICE_RE.test(insieme)) segnali.push("indicazioni editoriali");
    if (Number(numPagine) >= 180 && segnali.length > 0) segnali.push("lunghezza da volume");

    const bloccoForte = segnali.includes("ISBN") || segnali.length >= 2;
    if (!bloccoForte) return { bloccato: false, segnali };

    return {
        bloccato: true,
        segnali,
        messaggio: "Il file sembra un libro o un testo editoriale protetto da copyright (rilevato: "
            + segnali.join(", ")
            + "). Puoi caricare solo appunti originali, non libri o manuali coperti da diritti d'autore."
    };
}
