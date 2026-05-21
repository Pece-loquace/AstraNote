const { fromBuffer } = require("pdf2pic");

const generaThumbnail = async (buffer) => {
  try {
    const converter = fromBuffer(buffer, {
      density: 100,
      format: "jpg",
      width: 400,
      height: 600,
    });
    const risultato = await converter(1, { responseType: "buffer" });
    return risultato?.buffer ?? null;
  } catch (err) {
    console.error("Errore generazione thumbnail:", err);
    return null;
  }
};

module.exports = generaThumbnail;
