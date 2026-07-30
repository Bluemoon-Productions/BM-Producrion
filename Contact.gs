// Contact.gs — Contact form submission + acknowledgement email

function handleContactForm(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.CONTACT);

    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.CONTACT);
      sheet.appendRow(['Timestamp', 'Name', 'Stage Name', 'Instagram', 'Email', 'Phone', 'Message']);
    }

    sheet.appendRow([
      new Date(),
      data.name,
      data.stageName || '',
      data.instagram || '',
      data.email,
      data.phone,
      data.message
    ]);

    // Send acknowledgement email
    try {
      MailApp.sendEmail({
        to: data.email,
        subject: '✅ Contact Form Received - Bluemoon Production',
        htmlBody: buildContactAckEmail(data),
        name: 'Bluemoon Production'
      });
    } catch (emailError) {
      Logger.log('Ack email error: ' + emailError.toString());
    }

    return { success: true, message: 'Contact form submitted successfully' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function buildContactAckEmail(data) {
  return `
    <html><head><style>
      body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#1a1a2e 0%,#e94560 100%);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}
      .header h1{margin:0;font-size:28px}
      .content{background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px}
      .details{background:white;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #e94560}
      .details h3{color:#1a1a2e;margin-top:0}
      .detail-row{padding:10px 0;border-bottom:1px solid #eee}
      .detail-row:last-child{border-bottom:none}
      .label{font-weight:bold;color:#1a1a2e;display:inline-block;width:140px}
      .value{color:#666}
      .footer{text-align:center;padding:20px;color:#666;font-size:14px}
    </style></head><body>
    <div class="container">
      <div class="header"><h1>🎵 Bluemoon Production</h1><p style="margin:10px 0 0 0;font-size:16px">Professional Music Production Services</p></div>
      <div class="content">
        <p>Hi <strong>${data.name}</strong>,</p>
        <p>Thank you for reaching out! We have received your message and will get back to you within 24-48 hours.</p>
        <div class="details">
          <h3>📋 Submission Details</h3>
          <div class="detail-row"><span class="label">Full Name:</span><span class="value">${data.name}</span></div>
          <div class="detail-row"><span class="label">Stage Name:</span><span class="value">${data.stageName || 'N/A'}</span></div>
          <div class="detail-row"><span class="label">Instagram:</span><span class="value">${data.instagram || 'N/A'}</span></div>
          <div class="detail-row"><span class="label">Email:</span><span class="value">${data.email}</span></div>
          <div class="detail-row"><span class="label">Mobile:</span><span class="value">${data.phone}</span></div>
          <div class="detail-row"><span class="label">Message:</span><span class="value">${data.message}</span></div>
        </div>
      </div>
      <div class="footer"><p><strong>Best Regards,</strong><br>Bluemoon Production Team</p><p style="font-size:12px;color:#999">This is an automated message. Please do not reply.</p></div>
    </div>
    </body></html>`;
}
