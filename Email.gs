const EMAIL_SHEETS = {
  CONTACT: 'ContactForm',
  DRAFTS: 'DraftEmails'
};

// Main handler for email operations
function handleEmailOperation(data) {
  const action = data.action;
  
  switch(action) {
    case 'getClients':
      return getClientsList();
    case 'checkEmailExists':
      return checkEmailExists(data.email);
    case 'sendEmail':
      return sendClientEmail(data);
    case 'saveDraft':
      return saveDraftEmail(data);
    case 'getDrafts':
      return getDraftsList();
    case 'deleteDraft':
      return deleteDraft(data.draftId);
    case 'updateDraftStatus':
      return updateDraftStatus(data.draftId, data.status);
    default:
      return { success: false, error: 'Invalid email action' };
  }
}

// Get all clients from ContactForm sheet
function getClientsList() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(EMAIL_SHEETS.CONTACT);
    
    if (!sheet) {
      return { success: true, clients: [] };
    }
    
    const data = sheet.getDataRange().getValues();
    const clients = [];
    const emailMap = new Map();
    
    // Skip header row and get unique clients by email (latest entry)
    for (let i = data.length - 1; i > 0; i--) {
      const row = data[i];
      const name = row[1] || '';
      const stageName = row[2] || '';
      const email = row[4] || '';
      const phone = row[5] || '';
      const instagram = row[3] || '';
      
      if (email && !emailMap.has(email)) {
        clients.push({
          id: i,
          name: name,
          stageName: stageName,
          email: email,
          phone: phone,
          instagram: instagram,
          timestamp: row[0]
        });
        emailMap.set(email, true);
      }
    }
    
    return { success: true, clients: clients };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Check if email exists in ContactForm
function checkEmailExists(email) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(EMAIL_SHEETS.CONTACT);
    
    if (!sheet) {
      return { success: true, exists: false, isReply: false };
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][4] === email) {
        return { success: true, exists: true, isReply: true };
      }
    }
    
    return { success: true, exists: false, isReply: false };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Send email to client
function sendClientEmail(data) {
  try {
    const { to, subject, message, isReply, links, attachmentIds } = data;
    
    // Build email body with links
    let emailBody = message;
    if (links && links.length > 0) {
      emailBody += '\n\n--- Links ---\n';
      links.forEach((link, index) => {
        if (link.trim()) {
          emailBody += `${index + 1}. ${link}\n`;
        }
      });
    }
    
    // Create HTML email
    const htmlBody = createEmailTemplate(subject, emailBody);
    
    const options = {
      htmlBody: htmlBody,
      name: 'Bluemoon Production'
    };
    
    // Handle file attachments from Google Drive
    if (attachmentIds && attachmentIds.length > 0) {
      const attachments = [];
      attachmentIds.forEach(fileId => {
        try {
          const file = DriveApp.getFileById(fileId);
          attachments.push(file.getBlob());
        } catch (e) {
          Logger.log('Error attaching file: ' + e.toString());
        }
      });
      if (attachments.length > 0) {
        options.attachments = attachments;
      }
    }
    
    // Send email
    if (isReply) {
      // Try to reply to existing thread
      const threads = GmailApp.search(`to:${to}`);
      if (threads.length > 0) {
        threads[0].reply('', options);
      } else {
        GmailApp.sendEmail(to, subject, '', options);
      }
    } else {
      GmailApp.sendEmail(to, subject, '', options);
    }
    
    // Save to DraftEmails sheet with "sent" status
    saveDraftEmail({
      to: to,
      subject: subject,
      message: message,
      links: links || [],
      status: 'sent',
      isReply: isReply
    });
    
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    Logger.log('Send email error: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Save draft email
function saveDraftEmail(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(EMAIL_SHEETS.DRAFTS);
    
    if (!sheet) {
      sheet = ss.insertSheet(EMAIL_SHEETS.DRAFTS);
      sheet.appendRow([
        'Timestamp',
        'To',
        'Subject',
        'Message',
        'Links',
        'Status',
        'Is Reply',
        'Row ID'
      ]);
    }
    
    const rowId = sheet.getLastRow() + 1;
    sheet.appendRow([
      new Date(),
      data.to,
      data.subject,
      data.message,
      JSON.stringify(data.links || []),
      data.status || 'draft',
      data.isReply ? 'Yes' : 'No',
      rowId
    ]);
    
    return { success: true, message: 'Draft saved successfully!', draftId: rowId };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Get all drafts
function getDraftsList() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(EMAIL_SHEETS.DRAFTS);
    
    if (!sheet) {
      return { success: true, drafts: [] };
    }
    
    const data = sheet.getDataRange().getValues();
    const drafts = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      drafts.push({
        id: i + 1,
        timestamp: row[0],
        to: row[1],
        subject: row[2],
        message: row[3],
        links: row[4] ? JSON.parse(row[4]) : [],
        status: row[5],
        isReply: row[6] === 'Yes'
      });
    }
    
    // Return newest first
    return { success: true, drafts: drafts.reverse() };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Delete draft
function deleteDraft(draftId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(EMAIL_SHEETS.DRAFTS);
    
    if (!sheet) {
      return { success: false, error: 'Drafts sheet not found' };
    }
    
    // Delete row (draftId is row number)
    sheet.deleteRow(draftId);
    
    return { success: true, message: 'Draft deleted successfully!' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Update draft status
function updateDraftStatus(draftId, status) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(EMAIL_SHEETS.DRAFTS);
    
    if (!sheet) {
      return { success: false, error: 'Drafts sheet not found' };
    }
    
    // Update status column (column F = index 6)
    sheet.getRange(draftId, 6).setValue(status);
    
    return { success: true, message: 'Draft status updated!' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Create email template
function createEmailTemplate(subject, message) {
  const messageHTML = message.replace(/\n/g, '<br>');
  
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #1a1a2e 0%, #e94560 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .subject { color: #1a1a2e; font-size: 18px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #e94560; padding-bottom: 10px; }
          .message { color: #333; line-height: 1.8; margin: 20px 0; }
          .links { background: white; padding: 15px; border-left: 4px solid #e94560; margin: 20px 0; border-radius: 5px; }
          .links h4 { margin-top: 0; color: #1a1a2e; }
          .links a { color: #e94560; text-decoration: none; display: block; margin: 5px 0; }
          .links a:hover { text-decoration: underline; }
          .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
          .signature strong { color: #e94560; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎵 Bluemoon Production</h1>
            <p style="margin: 10px 0 0 0;">Professional Music Production Services</p>
          </div>
          <div class="content">
            <div class="subject">${subject}</div>
            <div class="message">${messageHTML}</div>
            <div class="signature">
              <p><strong>Best Regards,</strong><br>Bluemoon Production Team</p>
              <p style="font-size: 12px; color: #999; margin-top: 15px;">This is a professional communication from Bluemoon Production.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Upload file to Google Drive
function uploadFileToGoogleDrive(fileData, fileName) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const base64Data = fileData.split(',')[1];
    const mimeType = fileData.split(';')[0].split(':')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = folder.createFile(blob);
    
    return { success: true, fileId: file.getId(), fileName: file.getName() };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
