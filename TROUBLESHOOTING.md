# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: Invoice Generation Permission Error

**Error Message:**
```
Error generating invoice: Exception: You do not have permission to call DocumentApp.create. 
Required permissions: https://www.googleapis.com/auth/documents
```

**Solution:**
This has been fixed in the latest version of `GoogleAppsScript.gs`. The script now uses `Utilities.newBlob()` instead of `DocumentApp.create()`, which doesn't require additional permissions.

**What to do:**
1. Copy the updated `GoogleAppsScript.gs` code
2. Paste it into your Apps Script editor (replace all existing code)
3. Save the script
4. Deploy a new version:
   - Click "Deploy" → "Manage deployments"
   - Click "Edit" (pencil icon)
   - Change version to "New version"
   - Click "Deploy"
5. Test invoice generation again

**No re-authorization needed!** The script only requires Sheets and Drive permissions.

---

## Other Common Issues

### 1. Contact Form Not Submitting

**Symptoms:**
- Form submits but no data in Google Sheet
- Console shows CORS errors

**Solutions:**
- ✅ Verify `SCRIPT_URL` in `js/config.js` matches your Web App URL
- ✅ Ensure Google Apps Script is deployed with "Anyone" access
- ✅ Check that `SPREADSHEET_ID` is correct in GoogleAppsScript.gs
- ✅ Verify the sheet name is exactly `ContactForm`

**How to check:**
1. Open browser console (F12)
2. Submit the form
3. Look for error messages
4. Go to Apps Script → Executions to see server-side errors

---

### 2. Login Not Working

**Symptoms:**
- "Invalid email or password" even with correct credentials
- Login button doesn't respond

**Solutions:**
- ✅ Make sure you've signed up first
- ✅ Check `SignupData` sheet has your user data
- ✅ Verify email and password match exactly (case-sensitive)
- ✅ Clear browser cache and try again
- ✅ Check browser console for JavaScript errors

**Test login:**
1. Go to Google Sheet → `SignupData` tab
2. Find your email in column D
3. Check password in column F
4. Try logging in with exact values

---

### 3. Invoice PDF Not Generating

**Symptoms:**
- Invoice data saves to sheet but no PDF in Drive
- Error message about Drive permissions

**Solutions:**
- ✅ Verify `DRIVE_FOLDER_ID` is correct in GoogleAppsScript.gs
- ✅ Check folder permissions (you should be the owner)
- ✅ Ensure Apps Script has Drive access
- ✅ Try creating a new deployment

**How to verify:**
1. Go to your Google Drive folder
2. Copy the folder ID from URL
3. Compare with ID in GoogleAppsScript.gs
4. Make sure they match exactly

---

### 4. "Script is not deployed" Error

**Symptoms:**
- Error when submitting forms
- 404 or "not found" errors

**Solutions:**
- ✅ Deploy the script as Web App
- ✅ Set "Execute as" to "Me"
- ✅ Set "Who has access" to "Anyone"
- ✅ Copy the correct Web App URL

**How to deploy:**
1. Apps Script editor → Deploy → New deployment
2. Select "Web app" type
3. Fill in settings
4. Click "Deploy"
5. Copy the URL that ends with `/exec`

---

### 5. Authorization Issues

**Symptoms:**
- "Authorization required" message
- Script asks for permissions repeatedly

**Solutions:**
- ✅ Complete the authorization flow
- ✅ Click "Advanced" → "Go to [script name] (unsafe)"
- ✅ Click "Allow" for all permissions
- ✅ Only Sheets and Drive permissions are needed

**Required permissions:**
- ✅ Google Sheets (to read/write data)
- ✅ Google Drive (to save PDFs)
- ❌ Google Docs (NOT required - fixed in latest version)

---

### 6. CORS Errors in Console

**Symptoms:**
- Red errors in browser console about CORS
- Forms seem to work but show errors

**Explanation:**
This is normal! Google Apps Script uses `no-cors` mode, which means:
- The request is sent successfully
- The response is received by the server
- Browser blocks reading the response (security feature)
- Your data is still saved correctly

**What to do:**
- ✅ Ignore CORS errors in console
- ✅ Check Google Sheets to verify data is saved
- ✅ Test actual functionality, not console messages

---

### 7. Styles Not Loading

**Symptoms:**
- Website looks broken
- No colors or formatting

**Solutions:**
- ✅ Check all CSS files are in `css/` folder
- ✅ Verify file paths in `index.html` are correct
- ✅ Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Check for typos in file names

**File structure should be:**
```
bmJsInvoice/
├── index.html
├── css/
│   ├── style.css
│   ├── navbar.css
│   ├── auth.css
│   └── invoice.css
```

---

### 8. JavaScript Not Working

**Symptoms:**
- Buttons don't respond
- Forms don't submit
- Animations don't work

**Solutions:**
- ✅ Check all JS files are in `js/` folder
- ✅ Verify file paths in `index.html` are correct
- ✅ Open browser console (F12) to see errors
- ✅ Make sure files are loaded in correct order

**Load order in index.html:**
1. config.js (first - has configuration)
2. main.js (second - main functionality)
3. auth.js (third - authentication)
4. invoice.js (last - invoice features)

---

### 9. Mobile Menu Not Working

**Symptoms:**
- Hamburger icon doesn't open menu
- Menu items not visible on mobile

**Solutions:**
- ✅ Check `navbar.css` is loaded
- ✅ Verify `main.js` is loaded
- ✅ Test on actual mobile device, not just browser resize
- ✅ Clear mobile browser cache

---

### 10. Images Not Loading

**Symptoms:**
- Broken image icons
- Logo not showing
- Slider images missing

**Solutions:**
- ✅ Check image URLs are correct
- ✅ Verify images exist in `images/` folder
- ✅ Use relative paths, not absolute
- ✅ Check file extensions match (case-sensitive on some servers)

**For slider images:**
- Using Unsplash URLs (should work)
- Replace with your own hosted images for production

---

## Debugging Steps

### Step 1: Check Browser Console
1. Press F12 (or Cmd+Option+I on Mac)
2. Go to "Console" tab
3. Look for red error messages
4. Note the file and line number

### Step 2: Check Apps Script Logs
1. Go to Apps Script editor
2. Click "Executions" in left sidebar
3. Find recent executions
4. Click to see details and errors

### Step 3: Check Google Sheets
1. Open your Google Sheet
2. Check each tab for data
3. Verify column headers match expected format
4. Look for any error messages

### Step 4: Test Individual Components
1. Test contact form alone
2. Test signup alone
3. Test login alone
4. Test invoice alone
5. Identify which component has issues

---

## Getting Help

### Before Asking for Help:

1. ✅ Check this troubleshooting guide
2. ✅ Review browser console errors
3. ✅ Check Apps Script execution logs
4. ✅ Verify all IDs are correct
5. ✅ Test with a fresh browser/incognito mode

### Information to Provide:

- Error message (exact text)
- Browser and version
- Steps to reproduce
- Console errors (screenshot)
- Apps Script logs (screenshot)

---

## Quick Fixes

### Reset Everything:
```bash
# Clear browser data
- Clear cache
- Clear cookies
- Clear localStorage

# Redeploy script
1. Apps Script → Deploy → Manage deployments
2. Archive old deployment
3. Create new deployment
4. Update config.js with new URL
```

### Test Configuration:
```javascript
// Add to browser console to test
console.log('Config:', CONFIG);
console.log('User:', localStorage.getItem('user'));
```

### Verify IDs:
```javascript
// In GoogleAppsScript.gs, add at top of doPost:
Logger.log('Received action: ' + data.action);
Logger.log('Spreadsheet ID: ' + SPREADSHEET_ID);
Logger.log('Drive Folder ID: ' + DRIVE_FOLDER_ID);
```

---

## Prevention Tips

1. ✅ Always backup before making changes
2. ✅ Test in incognito mode
3. ✅ Keep documentation updated
4. ✅ Use version control (Git)
5. ✅ Test on multiple browsers
6. ✅ Monitor Apps Script executions regularly

---

## Still Having Issues?

1. Re-read the SETUP_GUIDE.md carefully
2. Follow each step exactly
3. Don't skip any steps
4. Test after each major change
5. Check all file paths and IDs

**Most issues are due to:**
- Incorrect IDs in configuration
- Typos in sheet names
- Wrong Web App URL
- Missing authorization

**Double-check these first!**

---

**Updated:** January 2024
**Version:** 1.1 (Fixed DocumentApp permission issue)
