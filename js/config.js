// Google Apps Script Configuration
const CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbz1WnhEmvxeEkyQaPO8NIMAe5WoboOVvoTK_92Ywaen97HjY3omvweovJ-93SDc/exec',
    
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
