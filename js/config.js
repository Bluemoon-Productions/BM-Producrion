// Google Apps Script Configuration
const CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxZy5PY6DsJJulX46MSnRorO-kli-_tQn_YnAOxX9mocMDH0-J2InY_B0tgg1TCt-Uw/exec',
    
    // Sheet names (must match your Google Sheets)
    SHEETS: {
        CONTACT: 'ContactForm',
        SIGNUP: 'SignupData',
        INVOICE: 'InvoiceData'
    },
    
    // Actions for Google Apps Script
    ACTIONS: {
        CONTACT: 'submitContact',
        SIGNUP: 'submitSignup',
        LOGIN: 'checkLogin',
        INVOICE: 'generateInvoice',
        GET_INVOICES: 'getInvoices',
        GET_INVOICE_DETAILS: 'getInvoiceDetails'
    }
};
