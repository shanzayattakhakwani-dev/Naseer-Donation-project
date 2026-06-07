const PDFDocument = require('pdfkit');
const QRCode      = require('qrcode');
const path        = require('path');

/**
 * Generate a donation PDF receipt buffer
 */
exports.generateDonationPDF = async ({ donorName, amount, campaign, receiptId, transactionId, donationType, date }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc    = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data',  c => chunks.push(c));
      doc.on('end',   () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify/${transactionId}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
      const qrBuffer  = Buffer.from(qrDataUrl.split(',')[1], 'base64');

      const W = 595 - 100; // usable width

      // ── Palestine flag top bar ──
      const barH = 12;
      const bW   = (595) / 4;
      doc.rect(0, 0, bW, barH).fill('#0D0D0D');
      doc.rect(bW, 0, bW, barH).fill('#FAFAF8');
      doc.rect(bW * 2, 0, bW, barH).fill('#1A7A4A');
      doc.rect(bW * 3, 0, bW, barH).fill('#C8102E');

      // ── Header ──
      doc.rect(0, barH, 595, 80).fill('#0D0D0D');
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#FFFFFF').text('NASEER', 50, barH + 18, { align: 'center' });
      doc.fontSize(9).font('Helvetica').fillColor('rgba(255,255,255,0.5)').text('THE HELPER · HUMANITARIAN DONATION PLATFORM', 50, barH + 52, { align: 'center', characterSpacing: 2 });

      // ── Certificate title ──
      doc.moveDown(4);
      doc.fontSize(13).font('Helvetica').fillColor('#888').text('DONATION CERTIFICATE', { align: 'center', characterSpacing: 3 });
      doc.moveDown(0.4);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E0E8E4').lineWidth(1).stroke();
      doc.moveDown(1);

      // ── Thank you ──
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#1A7A4A').text(`JazakAllah Khair, ${donorName}`, { align: 'center' });
      doc.moveDown(0.4);
      doc.fontSize(11).font('Helvetica').fillColor('#555').text('Your generous donation has been confirmed. May Allah accept your sadaqah.', { align: 'center' });
      doc.moveDown(1.5);

      // ── Details box ──
      const boxY = doc.y;
      doc.rect(50, boxY, W, 160).fill('#F5F0E8');
      doc.rect(50, boxY, 4, 160).fill('#1A7A4A');

      const rows = [
        ['Donor Name',      donorName],
        ['Campaign',        campaign],
        ['Donation Type',   donationType],
        ['Amount (PKR)',    `PKR ${Number(amount).toLocaleString()}`],
        ['Receipt ID',      receiptId],
        ['Transaction ID',  transactionId],
        ['Date',            date || new Date().toLocaleDateString('en-PK', { day:'numeric', month:'long', year:'numeric' })],
      ];

      let rowY = boxY + 14;
      rows.forEach(([label, value]) => {
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#888').text(label.toUpperCase(), 70, rowY, { width: 130, characterSpacing: .5 });
        doc.fontSize(10).font('Helvetica').fillColor('#1A2E25').text(value, 210, rowY, { width: 340 });
        rowY += 20;
      });

      doc.moveDown(10);

      // ── QR Code ──
      const qrY = doc.y + 10;
      doc.image(qrBuffer, 50, qrY, { width: 90, height: 90 });
      doc.fontSize(9).font('Helvetica').fillColor('#888').text('Scan to verify this donation', 150, qrY + 20);
      doc.fontSize(8).fillColor('#1A7A4A').text(verifyUrl, 150, qrY + 36, { width: 345 });

      doc.moveDown(8);

      // ── Arabic thank you ──
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E0E8E4').lineWidth(1).stroke();
      doc.moveDown(0.8);
      doc.fontSize(12).font('Helvetica').fillColor('#888').text('شكراً جزيلاً على تبرعكم الكريم. دعمكم يغير حياة الناس في فلسطين.', { align: 'center' });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor('#aaa').text('Thank you sincerely for your generous donation. Your support changes lives in Palestine.', { align: 'center' });

      // ── Footer flag ──
      const footerY = 770;
      doc.rect(0, footerY, bW, 8).fill('#0D0D0D');
      doc.rect(bW, footerY, bW, 8).fill('#FAFAF8');
      doc.rect(bW*2, footerY, bW, 8).fill('#1A7A4A');
      doc.rect(bW*3, footerY, bW, 8).fill('#C8102E');

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Generate a volunteer certificate PDF buffer
 */
exports.generateVolunteerCertPDF = async ({ name, skills, city, hoursLogged, date }) => {
  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ size: 'A4', margin: 60 });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const bW = 595 / 4;
    [['#0D0D0D',bW*0],['#FAFAF8',bW*1],['#1A7A4A',bW*2],['#C8102E',bW*3]].forEach(([c,x]) => {
      doc.rect(x,0,bW,8).fill(c);
    });

    doc.rect(0,8,595,80).fill('#1A7A4A');
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#fff').text('NASEER VOLUNTEER CERTIFICATE', 60, 22, { align:'center' });

    doc.moveDown(5);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#1A7A4A').text('Certificate of Volunteer Service', { align:'center' });
    doc.moveDown(1);
    doc.fontSize(13).font('Helvetica').fillColor('#555').text(`This certifies that`, { align:'center' });
    doc.moveDown(0.5);
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#0D0D0D').text(name, { align:'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').fillColor('#555').text(`has volunteered with NASEER – The Helper Platform\nin ${city}, contributing ${hoursLogged} hours of service.`, { align:'center' });
    doc.moveDown(1);
    doc.fontSize(11).fillColor('#888').text(`Skills: ${skills.join(', ')}`, { align:'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#aaa').text(`Issued: ${date || new Date().toLocaleDateString()}`, { align:'center' });

    [['#0D0D0D',bW*0],['#FAFAF8',bW*1],['#1A7A4A',bW*2],['#C8102E',bW*3]].forEach(([c,x]) => {
      doc.rect(x,770,bW,8).fill(c);
    });

    doc.end();
  });
};
