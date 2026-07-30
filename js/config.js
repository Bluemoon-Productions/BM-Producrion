// Google Apps Script Configuration
const CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyuInEHvVDJ6LwMcVce8e8ZMdSp8rrA3CMb7Usbm6o1TzbplxV3KDV6DzIAoaY-YDIG/exec',
    
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
        GET_INVOICE_DETAILS: 'getInvoiceDetails',
        DELETE_INVOICE: 'deleteInvoice',
        UPDATE_STATUS: 'updateInvoiceStatus'
    }
};
