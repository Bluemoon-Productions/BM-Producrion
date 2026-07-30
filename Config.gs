// Shared configuration — used by all .gs files
const SPREADSHEET_ID = '1MaNVyZ_4qJ29I7jzxfCuZIIFCEAw8W5xQ8xolYAEOL8';
const DRIVE_FOLDER_ID = '1t9584xnhVxqvMUrzDUn9e4y2pU-vpjZa';

const SHEETS = {
  CONTACT: 'ContactForm',
  SIGNUP: 'SignupData',
  INVOICE: 'InvoiceData'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let result;
    switch (action) {
      case 'submitContact':   result = handleContactForm(data); break;
      case 'submitSignup':    result = handleSignup(data); break;
      case 'checkLogin':      result = handleLogin(data); break;
      case 'generateInvoice': result = handleInvoice(data); break;
      case 'getInvoices':     result = getInvoices(data); break;
      case 'getInvoiceDetails': result = getInvoiceDetails(data); break;
      case 'deleteInvoice':   result = deleteInvoice(data); break;
      case 'updateInvoiceStatus': result = updateInvoiceStatus(data); break;
      // Email actions
      case 'getClients':
      case 'checkEmailExists':
      case 'sendEmail':
      case 'saveDraft':
      case 'getDrafts':
      case 'deleteDraft':
      case 'updateDraftStatus':
        result = handleEmailOperation(data); break;
      default:
        result = { success: false, error: 'Invalid action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false, error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Bluemoon Production API is running!');
}
