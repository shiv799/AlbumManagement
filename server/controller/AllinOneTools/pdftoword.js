const { PDFDocument, rgb } = require("pdf-lib");

const pdftoword = async (req, res) => {
  const pdfContent = req.body.pdfContent;

  if (!(pdfContent instanceof Uint8Array) && !(pdfContent instanceof ArrayBuffer)) {
    return res.status(400).json({ error: 'Invalid PDF content format' });
  }

  try {
    const pdfDoc = await PDFDocument.load(pdfContent);
    console.log("pdfDoc===>", pdfDoc);
    const convertedPdfBase64 = await pdfDoc.saveAsBase64();
      console.log("convertedPdfBase64===>", convertedPdfBase64);
    
    return res.status(200).json({ convertedContent });
  } catch (error) {
    console.error('Error converting PDF to Office:', error);
    return res.status(500).json({ error: 'Error converting PDF to Office' });
  }
};

module.exports = {
  pdftoword,
};
