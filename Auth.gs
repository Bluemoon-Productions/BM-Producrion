// Auth.gs — Signup and Login

function handleSignup(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.SIGNUP);

    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.SIGNUP);
      sheet.appendRow(['Timestamp', 'Full Name', 'Stage Name', 'Email', 'Phone', 'Password', 'Status', 'Role']);
    }

    // Normalize
    const email    = (data.email    || '').trim().toLowerCase();
    const password = (data.password || '').trim();
    const fullName = (data.fullName || '').trim();
    const phone    = (data.phone    || '').trim();

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if ((rows[i][3] || '').toString().trim().toLowerCase() === email) {
        return { success: false, error: 'Email already registered' };
      }
    }

    sheet.appendRow([
      new Date(),
      fullName,
      (data.stageName || '').trim(),
      email,
      phone,
      password,
      'Inactive',
      'User'
    ]);

    return { success: true, message: 'Signup successful. Wait for admin approval.' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleLogin(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.SIGNUP);

    if (!sheet) return { success: false, error: 'No users registered yet' };

    // Normalize input — trim whitespace, lowercase email
    const inputEmail    = (data.email    || '').trim().toLowerCase();
    const inputPassword = (data.password || '').trim();

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowEmail    = (row[3] || '').toString().trim().toLowerCase();
      const rowPassword = (row[5] || '').toString().trim();

      if (rowEmail === inputEmail && rowPassword === inputPassword) {
        const status = (row[6] || 'Inactive').toString().trim();
        if (status !== 'Active') {
          return { success: false, error: 'Account not active. Contact admin for approval.' };
        }
        return {
          success: true,
          user: {
            fullName:  (row[1] || '').toString().trim(),
            stageName: (row[2] || '').toString().trim(),
            email:     row[3].toString().trim(),
            phone:     (row[4] || '').toString().trim(),
            status:    status,
            role:      (row[7] || 'User').toString().trim()
          }
        };
      }
    }

    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
