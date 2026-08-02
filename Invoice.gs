// Invoice.gs — Invoice generate, get, update, delete + PDF generation

function handleInvoice(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.INVOICE);

    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.INVOICE);
      sheet.appendRow(['Invoice Number', 'Timestamp', 'Customer Name', 'Customer Email', 'Customer Phone',
        'Invoice Date', 'Due Date', 'Subtotal', 'Advance Payment', 'Balance Due',
        'Total Amount', 'Payment Method', 'Status', 'PDF URL', 'Terms',
        'UPI ID', 'UPI User Name', 'Bank Details', 'Bank User Name', 'Remark', 'Final Payment']);
    }

    let pdfUrl = '';
    try {
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      const pdfBlob = generateInvoicePDF(data);
      pdfUrl = folder.createFile(pdfBlob).getUrl();
    } catch (driveError) {
      pdfUrl = 'Error: ' + driveError.toString();
    }

    sheet.appendRow([
      data.invoiceNo,           // A
      new Date(),               // B
      data.to.name,             // C
      data.to.email,            // D
      data.to.phone,            // E
      data.invoiceDate,         // F
      data.dueDate,             // G
      data.subTotal,            // H
      data.advancePayment,      // I
      data.balanceDue,          // J
      data.total,               // K
      data.paymentMethod === 'upi' ? 'UPI' : 'AC',  // L
      'Generated',              // M
      pdfUrl,                   // N
      data.terms || '',         // O
      data.paymentDetails.upi  ? data.paymentDetails.upi.upiId  : '',  // P - UPI ID
      data.paymentDetails.upi  ? data.paymentDetails.upi.name   : '',  // Q - UPI User Name
      data.paymentDetails.bank ? JSON.stringify({
        accountNumber: data.paymentDetails.bank.accountNumber,
        ifscCode:      data.paymentDetails.bank.ifscCode
      }) : '',                  // R - Bank Details JSON
      data.paymentDetails.bank ? data.paymentDetails.bank.accountHolder : '',  // S - Bank User Name
      '',                       // T - Remark
      ''                        // U - Final Payment
    ]);

    return { success: true, message: 'Invoice generated successfully', invoiceNo: data.invoiceNo, pdfUrl };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getInvoices(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.INVOICE);
    if (!sheet) return { success: true, invoices: [] };

    const rows = sheet.getDataRange().getValues();
    const invoices = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if ((row[12] || '').toString().toLowerCase() === 'deleted') continue;
      invoices.push({
        invoiceNo:       row[0],
        timestamp:       row[1],
        customerName:    row[2],
        customerEmail:   row[3],
        customerPhone:   row[4],
        totalAmount:     row[10],
        advancePayment:  row[8],
        balanceDue:      row[9],
        paymentMethod:   row[11],
        status:          row[12],
        pdfUrl:          row[13],
        upiId:           row[15],
        upiName:         row[16],
        bankDetails:     row[17],
        bankUserName:    row[18],
        remark:          row[19] || '',
        finalPayment:    row[20] || '',
        rowIndex: i + 1
      });
    }
    return { success: true, invoices: invoices.reverse() };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getInvoiceDetails(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.INVOICE);
    if (!sheet) return { success: false, error: 'No invoices found' };

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === data.invoiceNo) {
        return {
          success: true,
          invoice: {
            invoiceNo: row[0], customerName: row[2], customerEmail: row[3],
            customerPhone: row[4], invoiceDate: row[5], dueDate: row[6],
            subTotal: row[7], advancePayment: row[8], balanceDue: row[9],
            total: row[10], paymentMethod: row[11], terms: row[14],
            upiId: row[15], upiName: row[16], bankDetails: row[17], bankUserName: row[18]
          }
        };
      }
    }
    return { success: false, error: 'Invoice not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function updateInvoiceStatus(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.INVOICE);
    if (!sheet) return { success: false, error: 'Invoice sheet not found' };

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.invoiceNo) {
        sheet.getRange(i + 1, 13).setValue(data.status);   // M - Status
        sheet.getRange(i + 1, 20).setValue(data.remark || ''); // T - Remark
        if (data.finalPayment) {
          const existing = rows[i][20] || '';
          const updated  = existing ? existing + ', ' + data.finalPayment : data.finalPayment;
          sheet.getRange(i + 1, 21).setValue(updated);     // U - Final Payment
          sheet.getRange(i + 1, 10).setValue(0);           // J - Balance Due = 0
        }
        return { success: true, message: 'Status updated successfully' };
      }
    }
    return { success: false, error: 'Invoice not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function deleteInvoice(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.INVOICE);
    if (!sheet) return { success: false, error: 'Invoice sheet not found' };

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.invoiceNo) {
        sheet.getRange(i + 1, 13).setValue('Deleted');
        if (data.remark) sheet.getRange(i + 1, 20).setValue(data.remark);
        return { success: true, message: 'Invoice marked as deleted' };
      }
    }
    return { success: false, error: 'Invoice not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// PDF generation

function generateInvoicePDF(data) {
  return Utilities.newBlob(generateInvoiceHTML(data), 'text/html', 'invoice.html')
    .getAs('application/pdf')
    .setName('Invoice_' + data.invoiceNo + '.pdf');
}

function generateInvoiceHTML(data) {
  let itemsHTML = '';
  data.items.forEach(item => {
    const lineTotal = parseFloat(item.qty) * parseFloat(item.amount);
    itemsHTML += `
      <tr>
        <td style="border:1px solid #ddd;padding:8px">${item.slNo}</td>
        <td style="border:1px solid #ddd;padding:8px">${item.description}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center">${item.qty}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right">₹${parseFloat(item.amount).toFixed(2)}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:right">₹${lineTotal.toFixed(2)}</td>
      </tr>`;
  });

  let paymentHTML = '';
  if (data.paymentDetails.bank) {
    const b = data.paymentDetails.bank;
    paymentHTML += `
      <div style="margin-top:20px">
        <h3 style="color:#1a1a2e;border-bottom:2px solid #e94560;padding-bottom:5px">Bank Details</h3>
        <p><strong>Account Holder:</strong> ${b.accountHolder || 'N/A'}</p>
        <p><strong>Bank Name:</strong> ${b.bankName || 'N/A'}</p>
        <p><strong>Account Number:</strong> ${b.accountNumber || 'N/A'}</p>
        <p><strong>Account Type:</strong> ${b.accountType || 'N/A'}</p>
        <p><strong>IFSC Code:</strong> ${b.ifscCode || 'N/A'}</p>
        <p><strong>Branch:</strong> ${b.branch || 'N/A'}</p>
        ${b.swiftCode ? '<p><strong>SWIFT Code:</strong> ' + b.swiftCode + '</p>' : ''}
      </div>`;
  }

  if (data.paymentDetails.upi) {
    const upi = data.paymentDetails.upi;
    const advance = parseFloat(data.advancePayment) || 0;
    paymentHTML += data.qrCodeBase64
      ? `<div style="margin-top:20px;text-align:center;border:2px solid #e94560;padding:20px;border-radius:10px;page-break-inside:avoid">
           <h3 style="color:#1a1a2e;margin-top:0">UPI Payment</h3>
           <p><strong>Scan to Pay Advance: ₹${advance.toFixed(2)}</strong></p>
           <div style="background:white;padding:10px;display:inline-block;margin:15px 0">
             <img src="${data.qrCodeBase64}" alt="UPI QR Code" style="width:200px;height:200px;display:block"/>
           </div>
           <p><strong>UPI ID:</strong> ${upi.upiId}</p>
           <p><strong>Name:</strong> ${upi.name || 'Bluemoon Production'}</p>
           <p style="font-size:11px;color:#666">Scan with Google Pay, PhonePe, Paytm or any UPI app</p>
         </div>`
      : `<div style="margin-top:20px;border:2px solid #e94560;padding:20px;border-radius:10px">
           <h3 style="color:#1a1a2e;border-bottom:2px solid #e94560;padding-bottom:5px">UPI Payment Details</h3>
           <p><strong>Pay Advance Amount:</strong> ₹${advance.toFixed(2)}</p>
           <p><strong>UPI ID:</strong> ${upi.upiId}</p>
           <p><strong>Name:</strong> ${upi.name || 'Bluemoon Production'}</p>
         </div>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body{font-family:Arial,sans-serif;padding:30px;color:#333}
    .header{text-align:center;margin-bottom:30px;border-bottom:3px solid #e94560;padding-bottom:20px}
    .header h1{color:#1a1a2e;margin:0;font-size:32px}
    .header h2{color:#e94560;margin:5px 0;font-size:24px}
    .section{margin:20px 0}
    .section h3{color:#1a1a2e;border-bottom:2px solid #e94560;padding-bottom:5px}
    table{width:100%;border-collapse:collapse;margin:20px 0}
    th{background:#1a1a2e;color:white;padding:10px;text-align:left;border:1px solid #ddd}
    .totals{text-align:right;margin:20px 0;font-size:14px}
    .totals p{margin:8px 0}
    .total-amount{font-size:18px;font-weight:bold;color:#e94560}
    .footer{margin-top:40px;text-align:center;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:20px}
  </style></head><body>
    <div class="header"><h1>INVOICE</h1><h2>Bluemoon Production</h2></div>
    <div class="section">
      <p><strong>Invoice No:</strong> ${data.invoiceNo}</p>
      <p><strong>Invoice Date:</strong> ${data.invoiceDate}</p>
      <p><strong>Due Date:</strong> ${data.dueDate}</p>
      ${data.terms ? '<p><strong>Terms:</strong> ' + data.terms + '</p>' : ''}
    </div>
    <div class="section"><h3>From:</h3>
      <p><strong>${data.from.name}</strong></p>
      <p>Email: ${data.from.email}</p><p>Phone: ${data.from.phone}</p><p>Address: ${data.from.address}</p>
    </div>
    <div class="section"><h3>Bill To:</h3>
      <p><strong>${data.to.name}</strong></p>
      <p>Email: ${data.to.email}</p><p>Phone: ${data.to.phone}</p><p>Address: ${data.to.address}</p>
    </div>
    <div class="section"><h3>Items:</h3>
      <table><thead><tr>
        <th style="width:50px">Sl.No</th><th>Description</th>
        <th style="width:80px;text-align:center">Qty</th>
        <th style="width:100px;text-align:right">Rate</th>
        <th style="width:100px;text-align:right">Amount</th>
      </tr></thead><tbody>${itemsHTML}</tbody></table>
    </div>
    <div class="totals">
      <p><strong>Sub Total:</strong> ₹${data.subTotal}</p>
      <p><strong>Total:</strong> ₹${data.total}</p>
      <p><strong>Advance Payment:</strong> ₹${data.advancePayment}</p>
      <p class="total-amount"><strong>Balance Due:</strong> ₹${data.balanceDue}</p>
      <p style="font-style:italic;font-size:12px">${data.totalWords}</p>
    </div>
    ${paymentHTML}
    ${data.termsConditions ? '<div class="section"><h3>Terms & Conditions:</h3><p>' + data.termsConditions + '</p></div>' : ''}
    <div class="footer"><p>Thank you for your business!</p><p>Bluemoon Production - Professional Music Production Services</p></div>
  </body></html>`;
}
