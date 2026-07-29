# 🎯 Quick Reference Guide - Common Tasks

## 🎨 Customization Tasks

### Change Website Colors

**File:** `css/style.css` (Lines 7-14)

```css
:root {
    --primary-color: #1a1a2e;      /* Dark blue - main backgrounds */
    --secondary-color: #16213e;     /* Darker blue - accents */
    --accent-color: #0f3460;        /* Medium blue - highlights */
    --highlight-color: #e94560;     /* Pink/Red - buttons, links */
    --text-light: #ffffff;          /* White text */
    --text-dark: #333333;           /* Dark text */
    --bg-light: #f5f5f5;           /* Light gray backgrounds */
}
```

### Change Company Name

**Files to update:**
1. `index.html` - Line 17 (navbar)
2. `index.html` - Line 8 (page title)
3. `js/invoice.js` - Line 123 (default "From" name)

### Update Contact Information

**File:** `index.html` - About section (around line 200)

Add your actual contact details in the About Us section.

### Change Slider Images

**File:** `index.html` - Lines 40-80

Replace Unsplash URLs with your own images:
```html
<img src="YOUR_IMAGE_URL_HERE" alt="Description">
```

### Update Service Cards

**File:** `index.html` - Lines 90-150

Each service card structure:
```html
<div class="service-card">
    <i class="fas fa-ICON-NAME"></i>
    <h3>Service Title</h3>
    <p>Service description text here.</p>
</div>
```

Find icons at: https://fontawesome.com/icons

### Add Client Videos

**File:** `index.html` - Lines 160-250

Replace YouTube embed URLs:
```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

### Update About Us Content

**File:** `index.html` - Lines 260-310

Edit the text content directly in the HTML.

---

## 🔧 Configuration Tasks

### Update Google Apps Script URL

**File:** `js/config.js` - Line 3

```javascript
SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
```

### Change Sheet Names

**Files to update:**
1. `js/config.js` - Lines 6-10
2. `GoogleAppsScript.gs` - Lines 8-12
3. Your actual Google Sheets

Make sure all three match exactly!

### Change Invoice Number Format

**File:** `js/invoice.js` - Lines 280-286

```javascript
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;  // Change format here
}
```

### Change Default Payment Terms

**File:** `index.html` - Line 420

```html
<input type="text" id="terms" placeholder="e.g., Net 30">
```

Change "Net 30" to your preferred default.

---

## 📝 Content Updates

### Add More Services (10th, 11th service, etc.)

**File:** `index.html` - After line 150

Copy this template:
```html
<div class="service-card">
    <i class="fas fa-microphone-alt"></i>
    <h3>Your Service Name</h3>
    <p>Description of your service goes here.</p>
</div>
```

**Note:** Update CSS if you want to keep 3x3 grid or change to 4x3, etc.

### Add More Carousel Items

**File:** `index.html` - After line 250

Copy this template:
```html
<div class="carousel-item">
    <div class="carousel-video">
        <iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="carousel-content">
        <h3>Project Title</h3>
        <p>Project description and details.</p>
    </div>
</div>
```

### Update Footer Social Links

**File:** `index.html` - Lines 580-585

```html
<a href="https://facebook.com/yourpage"><i class="fab fa-facebook"></i></a>
<a href="https://instagram.com/yourpage"><i class="fab fa-instagram"></i></a>
<a href="https://youtube.com/yourchannel"><i class="fab fa-youtube"></i></a>
<a href="https://open.spotify.com/artist/yourid"><i class="fab fa-spotify"></i></a>
```

---

## 🔐 Security & Privacy

### Add Password Hashing (Recommended for Production)

**File:** `GoogleAppsScript.gs`

Replace password storage with hashing:
```javascript
// Add this function
function hashPassword(password) {
    return Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        password
    ).map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

// Update signup function (line 60)
sheet.appendRow([
    new Date(),
    data.fullName,
    data.stageName || '',
    data.email,
    data.phone,
    hashPassword(data.password)  // Hash the password
]);

// Update login function (line 90)
if (row[3] === data.email && row[5] === hashPassword(data.password)) {
    // Login successful
}
```

### Add Rate Limiting

**File:** `GoogleAppsScript.gs`

Add at the beginning of doPost:
```javascript
function doPost(e) {
    // Simple rate limiting
    const cache = CacheService.getScriptCache();
    const ip = e.parameter.userip || 'unknown';
    const key = 'rate_' + ip;
    const count = cache.get(key) || 0;
    
    if (count > 100) {  // Max 100 requests per hour
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded'
        })).setMimeType(ContentService.MimeType.JSON);
    }
    
    cache.put(key, parseInt(count) + 1, 3600);  // 1 hour
    
    // Rest of your code...
}
```

---

## 🎨 Styling Quick Fixes

### Change Button Colors

**File:** `css/style.css`

Search for `.submit-btn` and `.login-btn` and update:
```css
.submit-btn {
    background: #YOUR_COLOR;  /* Change this */
}
```

### Change Font

**File:** `css/style.css` - Line 16

```css
body {
    font-family: 'Your Font', 'Segoe UI', sans-serif;
}
```

Add Google Font in `index.html` head:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

### Adjust Section Spacing

**File:** `css/style.css`

Search for section classes and adjust padding:
```css
.services-section {
    padding: 80px 0;  /* Change these values */
}
```

### Change Navbar Height

**File:** `css/navbar.css` - Line 18

```css
.nav-container {
    height: 70px;  /* Change this value */
}
```

Also update in `css/style.css` - Line 50:
```css
.home-section {
    margin-top: 70px;  /* Match navbar height */
}
```

---

## 📱 Mobile Optimization

### Adjust Mobile Breakpoints

**File:** `css/style.css` - Bottom of file

```css
@media (max-width: 768px) {
    /* Tablet styles */
}

@media (max-width: 480px) {
    /* Mobile styles */
}
```

Change `768px` and `480px` to your preferred breakpoints.

### Change Mobile Font Sizes

**File:** `css/style.css` - In media queries

```css
@media (max-width: 768px) {
    .slide-content h1 {
        font-size: 1.8rem;  /* Adjust this */
    }
}
```

---

## 🐛 Debugging

### Enable Console Logging

**File:** `js/auth.js` and `js/invoice.js`

Add console.log statements:
```javascript
console.log('Form data:', formData);
console.log('Response:', result);
```

### Check Google Apps Script Logs

1. Go to Apps Script editor
2. Click "Executions" in left sidebar
3. View execution logs and errors

### Test API Endpoint

Open in browser:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Should show: "Bluemoon Production API is running!"

---

## 📊 Analytics Integration

### Add Google Analytics

**File:** `index.html` - In `<head>` section

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🚀 Performance Optimization

### Optimize Images

Use tools like:
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app

Recommended sizes:
- Slider images: 1920x1080px
- Service icons: Vector (SVG)
- Logo: 200x200px

### Enable Caching

**File:** Create `.htaccess` (for Apache servers)

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 📧 Email Notifications

### Add Email Notification on Contact Form

**File:** `GoogleAppsScript.gs` - In `handleContactForm` function

Add after saving to sheet:
```javascript
// Send email notification
MailApp.sendEmail({
    to: 'your-email@example.com',
    subject: 'New Contact Form Submission',
    body: `
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Message: ${data.message}
    `
});
```

### Add Email on Invoice Generation

**File:** `GoogleAppsScript.gs` - In `handleInvoice` function

Add after PDF generation:
```javascript
// Send invoice to client
MailApp.sendEmail({
    to: data.to.email,
    subject: `Invoice ${data.invoiceNo} from Bluemoon Production`,
    body: 'Please find attached your invoice.',
    attachments: [pdfBlob]
});
```

---

## 🔄 Backup & Restore

### Backup Your Data

1. **Google Sheets:** File → Download → Excel or CSV
2. **Google Drive:** Right-click folder → Download
3. **Code:** Push to GitHub regularly

### Restore from Backup

1. **Sheets:** Import CSV/Excel to new sheet
2. **Drive:** Upload files to folder
3. **Code:** Pull from GitHub

---

## 📞 Support Resources

- **Font Awesome Icons:** https://fontawesome.com/icons
- **Google Fonts:** https://fonts.google.com
- **Color Picker:** https://htmlcolorcodes.com
- **Image Optimization:** https://tinypng.com
- **CSS Reference:** https://developer.mozilla.org/en-US/docs/Web/CSS

---

**Keep this file handy for quick reference! 📌**
