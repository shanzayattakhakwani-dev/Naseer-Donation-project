const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendDonationEmail = async ({ to, donorName, amount, campaign, receiptId, transactionId, pdfUrl }) => {
  if (!process.env.EMAIL_USER) return; // Skip if not configured
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'NASEER Platform <no-reply@naseer.pk>',
      to,
      subject: `🕊️ Donation Receipt — ${receiptId} | NASEER`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0D0D0D;padding:24px;text-align:center">
            <h1 style="color:#fff;font-size:1.8rem;margin:0;letter-spacing:3px">NASEER</h1>
            <p style="color:rgba(255,255,255,.5);font-size:11px;margin:4px 0 0;letter-spacing:2px">THE HELPER · PALESTINE</p>
          </div>
          <div style="padding:32px">
            <h2 style="color:#1A7A4A">JazakAllah Khair, ${donorName}!</h2>
            <p style="color:#555;line-height:1.7">Your donation of <strong>PKR ${Number(amount).toLocaleString()}</strong> to <strong>${campaign}</strong> is confirmed.</p>
            <div style="background:#F5F0E8;padding:20px;margin:24px 0;border-left:4px solid #1A7A4A">
              <table style="width:100%;font-size:14px">
                <tr><td style="color:#888;padding:4px 0">Receipt ID</td><td style="font-weight:700">${receiptId}</td></tr>
                <tr><td style="color:#888;padding:4px 0">Transaction ID</td><td style="font-family:monospace;font-size:12px">${transactionId}</td></tr>
                <tr><td style="color:#888;padding:4px 0">Amount</td><td style="font-weight:700;color:#1A7A4A">PKR ${Number(amount).toLocaleString()}</td></tr>
                <tr><td style="color:#888;padding:4px 0">Date</td><td>${new Date().toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})}</td></tr>
              </table>
            </div>
            ${pdfUrl ? `<a href="${pdfUrl}" style="display:inline-block;background:#1A7A4A;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;letter-spacing:1px">DOWNLOAD PDF CERTIFICATE</a>` : ''}
            <p style="color:#888;font-size:13px;margin-top:24px;font-style:italic">شكراً جزيلاً على تبرعكم الكريم. دعمكم يغير حياة الناس في فلسطين.</p>
            <p style="color:#aaa;font-size:12px">Verify: <a href="${process.env.APP_URL || 'http://localhost:3000'}/verify/${transactionId}">${process.env.APP_URL || 'http://localhost:3000'}/verify/${transactionId}</a></p>
          </div>
          <div style="background:#F5F0E8;padding:16px;text-align:center">
            <p style="color:#aaa;font-size:11px;margin:0">© ${new Date().getFullYear()} NASEER Platform · Built for Palestine</p>
          </div>
        </div>`
    });
  } catch (e) {
    console.warn('Email send skipped (not configured):', e.message);
  }
};

exports.sendVolunteerApproval = async ({ to, name }) => {
  if (!process.env.EMAIL_USER) return;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: ' Volunteer Application Approved | NASEER',
      html: `<div style="font-family:Arial,sans-serif;padding:32px;max-width:600px;margin:0 auto"><h2 style="color:#1A7A4A">Welcome, ${name}!</h2><p>Your NASEER volunteer application has been approved. Log in to access your dashboard.</p></div>`
    });
  } catch (e) { console.warn('Email skip:', e.message); }
};
