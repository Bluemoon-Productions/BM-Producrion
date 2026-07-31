// Auth.gs — Signup and Login

function handleSignup(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.SIGNUP);

    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.SIGNUP);
      sheet.appendRow(['Timestamp', 'Full Name', 'Stage Name', 'Email', 'Phone', 'Password', 'Status', 'Role']);
    }

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][3] === data.email) {
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

function handleLogin(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.SIGNUP);

    if (!sheet) return { success: false, error: 'No users registered yet' };

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[3] === data.email && row[5] === data.password) {
        const status = row[6] || 'Inactive';
        if (status !== 'Active') {
          return { success: false, error: 'Account not active. Contact admin for approval.' };
        }
        return {
          success: true,
          user: {
            fullName: row[1],
            stageName: row[2],
            email: row[3],
            phone: row[4],
            status: status,
            role: row[7] || 'User'
          }
        };
      }
    }

    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
