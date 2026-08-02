// Email.gs — Email related functions

function handleFirstEmail(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('FirstEmail');

    if (!sheet) {
      sheet = ss.insertSheet('FirstEmail');
      sheet.appendRow(['Record ID', 'Created Date Time', 'Email ID', 'Mobile/WhatsApp', 'Instagram', 'Client Full Name', 'Stage Name', 'Services', 'Additional Message']);
    }

    const recordId = sheet.getLastRow();
    const createdDateTime = new Date();

    sheet.appendRow([
      recordId,
      createdDateTime,
      data.email,
      data.phone,
      data.instagram,
      data.clientName,
      data.stageName,
      data.services,
      data.additionalMessage
    ]);

    const subject = "Let's do Something Amazing with Bluemoon Production!";
    let message = `
      <p>Dear ${data.clientName},</p>
      <p>Thank you for your interest in Bluemoon Production! We're excited about working with you to bring your musical vision to life.</p>
      <p>We've received your request for the following services: <strong>${data.services}</strong>.</p>
    `;

    if (data.additionalMessage) {
        message += `<p><strong>Some additional details you provided:</strong></p><p><em>${data.additionalMessage}</em></p>`;
    }

    message += `
      <p>Our team will review your request and get back to you shortly with more details on how we can help you achieve your goals. In the meantime, feel free to check out our portfolio and see what we've done for other artists like you.</p>
      <p style="text-align: center; margin: 20px 0;"><a href="https://www.instagram.com/bluemoon_production/" target="_blank" style="color: #352487; text-decoration: none; font-weight: bold;">Bluemoon Production</a></p>
    `;

    const htmlBody = createEmailTemplate(subject, message);

    try {
        GmailApp.sendEmail(data.email, subject, "", {
            htmlBody: htmlBody,
            // To prevent permission errors, replace this with your actual 'from' email address.
            // This ensures the script has a consistent, authorized address to send emails from.
            from: "bluemoonproduction2023@gmail.com",
            name: 'Bluemoon Production'
        });
    } catch (e) {
        return { success: false, error: 'Email could not be sent: ' + e.toString() };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function createEmailTemplate(subject, message) {
  // In the updated template, the message content is expected to be HTML.
  // The split-join logic is removed to allow for richer content.
  const messageHTML = message;
  
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a2e 0%, #352487 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #352487; }
          .details h3 { color: #1a1a2e; margin-top: 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>&#127925; Bluemoon Production</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Professional Music Production Services</p>
          </div>
          <div class="content">
            <div class="details">
              <h3>${subject}</h3>
              <div style="padding-top: 15px; color: #666; line-height: 1.8;">${messageHTML}</div>
            </div>
          </div>
          <div class="footer">
            <p><strong>Best Regards,</strong><br>Bluemoon Production Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">We're looking forward to connecting with you!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
