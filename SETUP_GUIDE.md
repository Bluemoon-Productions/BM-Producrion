# 🎯 Quick Setup Guide - Bluemoon Production Website

Follow these steps in order to get your website up and running.

## ✅ Checklist

- [ ] Step 1: Create Google Sheets
- [ ] Step 2: Create Google Drive Folder
- [ ] Step 3: Setup Google Apps Script
- [ ] Step 4: Update Website Configuration
- [ ] Step 5: Test Everything
- [ ] Step 6: Deploy Website

---

## 📋 Step 1: Create Google Sheets (5 minutes)

1. Go to https://sheets.google.com
2. Click "Blank" to create a new spreadsheet
3. Name it: **Bluemoon Production Data**
4. Create 3 sheets by clicking the "+" button at bottom:
   - Rename Sheet1 to: `ContactForm`
   - Create and name Sheet2: `SignupData`
   - Create and name Sheet3: `InvoiceData`

5. **Copy your Spreadsheet ID:**
   - Look at the URL in your browser
   - Copy the ID between `/d/` and `/edit`
   - Example: `https://docs.google.com/spreadsheets/d/1MaNVyZ_4qJ29I7jzxfCuZIIFCEAw8W5xQ8xolYAEOL8/edit`
   - Your ID is: `1MaNVyZ_4qJ29I7jzxfCuZIIFCEAw8W5xQ8xolYAEOL8`
   - **Save this ID** - you'll need it later!

---

## 📁 Step 2: Create Google Drive Folder (2 minutes)

1. Go to https://drive.google.com
2. Click "New" → "Folder"
3. Name it: **Bluemoon Invoices**
4. Right-click the folder → "Get link"
5. **Copy your Folder ID:**
   - Look at the URL
   - Copy the ID after `/folders/`
   - Example: `https://drive.google.com/drive/folders/1t9584xnhVxqvMUrzDUn9e4y2pU-vpjZa`
   - Your ID is: `1t9584xnhVxqvMUrzDUn9e4y2pU-vpjZa`
   - **Save this ID** - you'll need it later!

---

## 💻 Step 3: Setup Google Apps Script (10 minutes)

1. **Open Apps Script:**
   - Go back to your Google Sheet
   - Click: Extensions → Apps Script
   - You'll see a code editor

2. **Delete existing code:**
   - Select all code (Ctrl+A or Cmd+A)
   - Delete it

3. **Copy the script:**
   - Open the file `GoogleAppsScript.gs` from your project
   - Copy ALL the code
   - Paste it into the Apps Script editor

4. **Update the IDs:**
   - Find line 5: `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';`
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your Spreadsheet ID from Step 1
   - Find line 6: `const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE';`
   - Replace `YOUR_DRIVE_FOLDER_ID_HERE` with your Folder ID from Step 2

5. **Save the script:**
   - Click the disk icon or press Ctrl+S (Cmd+S on Mac)
   - Name it: "Bluemoon API"

6. **Deploy as Web App:**
   - Click "Deploy" → "New deployment"
   - Click the gear icon ⚙️ next to "Select type"
   - Choose "Web app"
   - Fill in:
     - **Description:** Bluemoon Production API
     - **Execute as:** Me (your email)
     - **Who has access:** Anyone
   - Click "Deploy"

7. **Authorize the app:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to Bluemoon API (unsafe)"
   - Click "Allow"
   - **Note:** The script only needs Sheets and Drive permissions, no Document permissions required

8. **Copy your Web App URL:**
   - After deployment, you'll see a URL like:
   ```
   https://script.google.com/macros/s/AKfycbyROwV2Km5_-nYvzHOIg1NbGjXmOKpTB6PWK1Lo8UVnP_c2xX2vOf9DaGOmjD1Ab1Ue/exec
   ```
   - **Copy this entire URL** - you'll need it next!

---

## 🔧 Step 4: Update Website Configuration (2 minutes)

1. **Open config.js:**
   - Navigate to: `js/config.js`
   - Open it in a text editor

2. **Update the SCRIPT_URL:**
   - Find line 3: `SCRIPT_URL: 'https://script.google.com/macros/s/...'`
   - Replace the URL with your Web App URL from Step 3
   - Save the file

3. **Add your logo (optional):**
   - Add your logo image to the `images/` folder
   - Name it `logo.png`
   - Or update the image path in `index.html` line 18

---

## 🧪 Step 5: Test Everything (5 minutes)

### Test 1: Contact Form
1. Open `index.html` in your browser
2. Scroll to "Contact Us" section
3. Fill out the form and submit
4. Check your Google Sheet → `ContactForm` tab
5. ✅ You should see the data appear!

### Test 2: Signup
1. Click "Login" button in the navbar
2. Click "Sign Up" link
3. Fill out the signup form
4. Submit the form
5. Check your Google Sheet → `SignupData` tab
6. ✅ You should see the user data!

### Test 3: Login
1. Click "Login" button
2. Enter the email and password you just created
3. Click "Login"
4. ✅ You should see a user profile icon appear!
5. ✅ "Generate Invoice" menu should now be visible!

### Test 4: Invoice Generation
1. Click "Generate Invoice" in the menu
2. Fill out the invoice form
3. Add some items
4. Submit the form
5. Check your Google Sheet → `InvoiceData` tab
6. Check your Google Drive → `Bluemoon Invoices` folder
7. ✅ You should see the invoice data and PDF!

---

## 🚀 Step 6: Deploy Website (Choose One)

### Option A: GitHub Pages (Free & Easy)

1. **Create GitHub Repository:**
   - Go to https://github.com
   - Click "New repository"
   - Name it: `bluemoon-production`
   - Make it Public
   - Click "Create repository"

2. **Push your code:**
   ```bash
   cd /Users/pawanshukla/Documents/GitHub/bmJsInvoice
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bluemoon-production.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Click "Pages" in sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://YOUR_USERNAME.github.io/bluemoon-production`

### Option B: Netlify (Free & Fast)

1. Go to https://www.netlify.com
2. Sign up / Log in
3. Drag and drop your project folder
4. Your site is live instantly!

### Option C: Vercel (Free & Professional)

1. Go to https://vercel.com
2. Sign up / Log in
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

---

## 🎉 You're Done!

Your website is now live and fully functional!

### What You Can Do Now:

✅ Users can view your services and company info
✅ Users can contact you via the form
✅ Users can sign up and log in
✅ Logged-in users can generate invoices
✅ All data is saved to Google Sheets
✅ Invoice PDFs are saved to Google Drive

---

## 🔄 Making Updates

### To update the website:
1. Edit the HTML/CSS/JS files
2. Test locally by opening `index.html`
3. Push changes to GitHub (if using GitHub Pages)
4. Changes will be live automatically!

### To update Google Apps Script:
1. Go to your Apps Script editor
2. Make changes
3. Click "Deploy" → "Manage deployments"
4. Click "Edit" (pencil icon)
5. Change version to "New version"
6. Click "Deploy"

---

## 📞 Need Help?

### Common Issues:

**"Contact form not working"**
- Check if SCRIPT_URL in config.js is correct
- Make sure Apps Script is deployed with "Anyone" access

**"Login not working"**
- Make sure you signed up first
- Check if SignupData sheet has your data
- Verify email and password are correct

**"Invoice not generating"**
- Check if you're logged in
- Verify Drive folder ID is correct
- Check Apps Script execution logs

### Check Logs:
1. Go to Apps Script editor
2. Click "Executions" in left sidebar
3. See what errors occurred

---

## 🎨 Customization Tips

### Change Colors:
- Edit `css/style.css` → Look for `:root` variables

### Add More Services:
- Edit `index.html` → Find "services-grid" section
- Copy a service card and modify

### Change Slider Images:
- Edit `index.html` → Find "slider" section
- Replace image URLs with your own

### Update Company Info:
- Edit `index.html` → Find "about-section"
- Update the text content

---

**🎵 Enjoy your new website! 🎵**
