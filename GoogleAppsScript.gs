// Google Apps Script Code
// Deploy this as a Web App with "Anyone" access

// CONFIGURATION - Your actual IDs
const SPREADSHEET_ID = '1MaNVyZ_4qJ29I7jzxfCuZIIFCEAw8W5xQ8xolYAEOL8';
const DRIVE_FOLDER_ID = '1t9584xnhVxqvMUrzDUn9e4y2pU-vpjZa';

// Sheet names
const SHEETS = {
  CONTACT: 'ContactForm',
  SIGNUP: 'SignupData',
  INVOICE: 'InvoiceData'
};

// Main function to handle POST requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    
    switch(action) {
      case 'submitContact':
        result = handleContactForm(data);
        break;
      case 'submitSignup':
        result = handleSignup(data);
        break;
      case 'checkLogin':
        result = handleLogin(data);
        break;
      case 'generateInvoice':
        result = handleInvoice(data);
        break;
      case 'getInvoices':
        result = getInvoices(data);
        break;
      case 'getInvoiceDetails':
        result = getInvoiceDetails(data);
        break;
      default:
        result = { success: false, error: 'Invalid action' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput('Bluemoon Production API is running!');
}

// Handle Contact Form Submission
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
      const emailBody = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a2e 0%, #e94560 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 20px; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e94560; }
              .details h3 { color: #1a1a2e; margin-top: 0; }
              .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
              .detail-row:last-child { border-bottom: none; }
              .label { font-weight: bold; color: #1a1a2e; display: inline-block; width: 140px; }
              .value { color: #666; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
              .footer strong { color: #e94560; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎵 Bluemoon Production</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Professional Music Production Services</p>
              </div>
              <div class="content">
                <p class="greeting">Hi <strong>${data.name}</strong>,</p>
                <p>Thank you for reaching out to us! This is an acknowledgement that we have received your contact form submission.</p>
                
                <div class="details">
                  <h3>📋 Submission Details</h3>
                  <div class="detail-row">
                    <span class="label">Full Name:</span>
                    <span class="value">${data.name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Stage Name:</span>
                    <span class="value">${data.stageName || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Instagram:</span>
                    <span class="value">${data.instagram || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${data.email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Mobile:</span>
                    <span class="value">${data.phone}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Message:</span>
                    <span class="value">${data.message}</span>
                  </div>
                </div>
                
                <p>Our team will review your message and get back to you within 24-48 hours.</p>
                <p>If you have any urgent queries, feel free to reach out to us directly.</p>
              </div>
              <div class="footer">
                <p><strong>Best Regards,</strong><br>Bluemoon Production Team</p>
                <p style="font-size: 12px; color: #999; margin-top: 20px;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `;
      
      MailApp.sendEmail({
        to: data.email,
        subject: '✅ Contact Form Received - Bluemoon Production',
        htmlBody: emailBody,
        name: 'Bluemoon Production'
      });
    } catch (emailError) {
      Logger.log('Email error: ' + emailError.toString());
    }
    
    return { success: true, message: 'Contact form submitted successfully' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Handle Signup
function handleSignup(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.SIGNUP);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.SIGNUP);
      sheet.appendRow(['Timestamp', 'Full Name', 'Stage Name', 'Email', 'Phone', 'Password', 'Status', 'Role']);
    }
    
    const dataRange = sheet.getDataRange().getValues();
    for (let i = 1; i < dataRange.length; i++) {
      if (dataRange[i][3] === data.email) {
        return { success: false, error: 'Email already registered' };
      }
    }
    
    sheet.appendRow([
      new Date(),
      data.fullName,
      data.stageName || '',
      data.email,
      data.phone,
      data.password,
      'Inactive',
      'User'
    ]);
    
    return { success: true, message: 'Signup successful. Wait for admin approval.' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Handle Login
function handleLogin(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.SIGNUP);
    
    if (!sheet) {
      return { success: false, error: 'No users registered yet' };
    }
    
    const dataRange = sheet.getDataRange().getValues();
    
    for (let i = 1; i < dataRange.length; i++) {
      const row = dataRange[i];
      if (row[3] === data.email && row[5] === data.password) {
        // Check status (column G = index 6)
        const status = row[6] || 'Inactive';
        if (status !== 'Active') {
          return { success: false, error: 'Account not active. Contact admin for approval.' };
        }
        
        // Get role (column H = index 7)
        const role = row[7] || 'User';
        
        return {
          success: true,
          user: {
            fullName: row[1],
            stageName: row[2],
            email: row[3],
            phone: row[4],
            status: status,
            role: role
          }
        };
      }
    }
    
    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Handle Invoice Generation
function handleInvoice(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.INVOICE);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.INVOICE);
      sheet.appendRow(['Invoice Number', 'Timestamp', 'Customer Name', 'Customer Email', 'Customer Phone', 'Invoice Date', 'Due Date', 'Subtotal', 'Advance Payment', 'Balance Due', 'Total Amount', 'Payment Method', 'Status', 'PDF URL', 'Terms', 'UPI ID']);
    }
    
    // Generate PDF first
    const pdfBlob = generateInvoicePDF(data);
    let pdfUrl = '';
    
    try {
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      const file = folder.createFile(pdfBlob);
      pdfUrl = file.getUrl();
    } catch (driveError) {
      pdfUrl = 'Error: ' + driveError.toString();
    }
    
    // Save invoice data to sheet with all columns
    sheet.appendRow([
      data.invoiceNo,
      new Date(),
      data.to.name,
      data.to.email,
      data.to.phone,
      data.invoiceDate,
      data.dueDate,
      data.subTotal,
      data.advancePayment,
      data.balanceDue,
      data.total,
      data.paymentMethod,
      'Generated',
      pdfUrl,
      data.terms || '',
      data.paymentDetails.upi ? data.paymentDetails.upi.upiId : ''
    ]);
    
    return {
      success: true,
      message: 'Invoice generated successfully',
      invoiceNo: data.invoiceNo,
      pdfUrl: pdfUrl
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Generate Invoice PDF
function generateInvoicePDF(data) {
  const html = generateInvoiceHTML(data);
  const blob = Utilities.newBlob(html, 'text/html', 'invoice.html')
    .getAs('application/pdf')
    .setName('Invoice_' + data.invoiceNo + '.pdf');
  return blob;
}

// Generate Invoice HTML
function generateInvoiceHTML(data) {
  let itemsHTML = '';
  
  data.items.forEach(item => {
    const lineTotal = parseFloat(item.qty) * parseFloat(item.amount);
    itemsHTML += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.slNo}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.qty}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${parseFloat(item.amount).toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${lineTotal.toFixed(2)}</td>
      </tr>
    `;
  });
  
  let paymentHTML = '';
  if (data.paymentDetails.bank) {
    const bank = data.paymentDetails.bank;
    paymentHTML += `
      <div style="margin-top: 20px;">
        <h3 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 5px;">Bank Details</h3>
        <p><strong>Account Holder:</strong> ${bank.accountHolder || 'N/A'}</p>
        <p><strong>Bank Name:</strong> ${bank.bankName || 'N/A'}</p>
        <p><strong>Account Number:</strong> ${bank.accountNumber || 'N/A'}</p>
        <p><strong>Account Type:</strong> ${bank.accountType || 'N/A'}</p>
        <p><strong>IFSC Code:</strong> ${bank.ifscCode || 'N/A'}</p>
        <p><strong>Branch:</strong> ${bank.branch || 'N/A'}</p>
        ${bank.swiftCode ? '<p><strong>SWIFT Code:</strong> ' + bank.swiftCode + '</p>' : ''}
      </div>
    `;
  }
  
  // UPI Payment with QR Code
  if (data.paymentDetails.upi) {
    const upi = data.paymentDetails.upi;
    const upiId = upi.upiId || '';
    const advanceAmount = parseFloat(data.advancePayment) || 0;
    
    // Use the QR code image data sent from client
    const qrBase64 = data.qrCodeBase64 || '';
    
    if (qrBase64) {
      paymentHTML += `
        <div style="margin-top: 20px; text-align: center; border: 2px solid #e94560; padding: 20px; border-radius: 10px; page-break-inside: avoid;">
          <h3 style="color: #1a1a2e; margin-top: 0;">UPI Payment</h3>
          <p style="font-size: 16px; margin: 10px 0;"><strong>Scan to Pay Advance: ₹${advanceAmount.toFixed(2)}</strong></p>
          <div style="background: white; padding: 10px; display: inline-block; margin: 15px 0;">
            <img src="${qrBase64}" alt="UPI QR Code" style="width: 200px; height: 200px; display: block;" />
          </div>
          <p style="margin: 10px 0;"><strong>UPI ID:</strong> ${upiId}</p>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${upi.name || 'Bluemoon Production'}</p>
          <p style="font-size: 11px; color: #666; margin-top: 10px;">Scan with Google Pay, PhonePe, Paytm or any UPI app</p>
        </div>
      `;
    } else {
      paymentHTML += `
        <div style="margin-top: 20px; border: 2px solid #e94560; padding: 20px; border-radius: 10px;">
          <h3 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 5px;">UPI Payment Details</h3>
          <p><strong>Pay Advance Amount:</strong> ₹${advanceAmount.toFixed(2)}</p>
          <p><strong>UPI ID:</strong> ${upiId}</p>
          <p><strong>Name:</strong> ${upi.name || 'Bluemoon Production'}</p>
        </div>
      `;
    }
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #e94560; padding-bottom: 20px; }
        .header h1 { color: #1a1a2e; margin: 0; font-size: 32px; }
        .header h2 { color: #e94560; margin: 5px 0; font-size: 24px; }
        .invoice-info { margin: 20px 0; }
        .invoice-info p { margin: 5px 0; }
        .section { margin: 20px 0; }
        .section h3 { color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #1a1a2e; color: white; padding: 10px; text-align: left; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        .totals { text-align: right; margin: 20px 0; font-size: 14px; }
        .totals p { margin: 8px 0; }
        .total-amount { font-size: 18px; font-weight: bold; color: #e94560; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <h2>Bluemoon Production</h2>
      </div>
      
      <div class="invoice-info">
        <p><strong>Invoice No:</strong> ${data.invoiceNo}</p>
        <p><strong>Invoice Date:</strong> ${data.invoiceDate}</p>
        <p><strong>Due Date:</strong> ${data.dueDate}</p>
        ${data.terms ? '<p><strong>Terms:</strong> ' + data.terms + '</p>' : ''}
      </div>
      
      <div class="section">
        <h3>From:</h3>
        <p><strong>${data.from.name}</strong></p>
        <p>Email: ${data.from.email}</p>
        <p>Phone: ${data.from.phone}</p>
        <p>Address: ${data.from.address}</p>
      </div>
      
      <div class="section">
        <h3>Bill To:</h3>
        <p><strong>${data.to.name}</strong></p>
        <p>Email: ${data.to.email}</p>
        <p>Phone: ${data.to.phone}</p>
        <p>Address: ${data.to.address}</p>
      </div>
      
      <div class="section">
        <h3>Items:</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Sl.No</th>
              <th>Description</th>
              <th style="width: 80px; text-align: center;">Qty</th>
              <th style="width: 100px; text-align: right;">Rate</th>
              <th style="width: 100px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>
      
      <div class="totals">
        <p><strong>Sub Total:</strong> ₹${data.subTotal}</p>
        <p><strong>Total:</strong> ₹${data.total}</p>
        <p><strong>Advance Payment:</strong> ₹${data.advancePayment}</p>
        <p class="total-amount"><strong>Balance Due:</strong> ₹${data.balanceDue}</p>
        <p style="font-style: italic; font-size: 12px;">${data.totalWords}</p>
      </div>
      
      ${paymentHTML}
      
      ${data.termsConditions ? `
        <div class="section">
          <h3>Terms & Conditions:</h3>
          <p>${data.termsConditions}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Bluemoon Production - Professional Music Production Services</p>
      </div>
    </body>
    </html>
  `;
}

// Get Invoice List
function getInvoices(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.INVOICE);
    
    if (!sheet) {
      return { success: true, invoices: [] };
    }
    
    const dataRange = sheet.getDataRange().getValues();
    const invoices = [];
    
    // Skip header row
    for (let i = 1; i < dataRange.length; i++) {
      const row = dataRange[i];
      invoices.push({
        invoiceNo: row[0],
        timestamp: row[1],
        customerName: row[2],
        customerEmail: row[3],
        totalAmount: row[10],
        status: row[12],
        pdfUrl: row[13],
        rowIndex: i + 1
      });
    }
    
    // Return in reverse order (newest first)
    return { success: true, invoices: invoices.reverse() };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Get Invoice Details for Edit
function getInvoiceDetails(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.INVOICE);
    
    if (!sheet) {
      return { success: false, error: 'No invoices found' };
    }
    
    const dataRange = sheet.getDataRange().getValues();
    
    // Find invoice by invoice number
    for (let i = 1; i < dataRange.length; i++) {
      const row = dataRange[i];
      if (row[0] === data.invoiceNo) {
        return {
          success: true,
          invoice: {
            invoiceNo: row[0],
            customerName: row[2],
            customerEmail: row[3],
            customerPhone: row[4],
            invoiceDate: row[5],
            dueDate: row[6],
            subTotal: row[7],
            advancePayment: row[8],
            balanceDue: row[9],
            total: row[10],
            paymentMethod: row[11],
            terms: row[14],
            upiId: row[15]
          }
        };
      }
    }
    
    return { success: false, error: 'Invoice not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
