# Bluemoon Production - Static Website with Invoice Generator

A professional, fully responsive website for Bluemoon Production music company with integrated invoice generation system using Google Apps Script and Google Drive.

## 🎵 Features

### Website Features
- **Responsive Navigation Bar** with hamburger menu for mobile
- **Dynamic Image Slider** with 5 slides and smooth animations
- **Services Section** showcasing 9 music production services
- **Clients Carousel** with video previews and descriptions
- **About Us** section with company information
- **Contact Form** with Google Sheets integration
- **User Authentication** (Login/Signup) with Google Sheets backend
- **Professional Footer** with animated music instrument icons

### Invoice Generator Features
- Complete invoice form with all necessary fields
- Dynamic item addition/removal
- Automatic calculations (subtotal, balance due)
- Number to words conversion
- Multiple payment methods (Bank, UPI, or Both)
- PDF generation and Google Drive storage
- Invoice data storage in Google Sheets

## 📁 Folder Structure

```
bmJsInvoice/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles
│   ├── navbar.css         # Navigation bar styles
│   ├── auth.css           # Authentication form styles
│   └── invoice.css        # Invoice form styles
├── js/
│   ├── config.js          # Configuration file
│   ├── main.js            # Main JavaScript
│   ├── auth.js            # Authentication logic
│   └── invoice.js         # Invoice generation logic
├── images/
│   └── logo.png           # Company logo (add your own)
├── GoogleAppsScript.gs    # Backend Google Apps Script code
└── README.md              # This file
```

## 🚀 Setup Instructions

### Step 1: Google Sheets Setup

1. **Create a Google Spreadsheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "Bluemoon Production Data"
   - Copy the Spreadsheet ID from the URL:
     ```
     https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
     ```

2. **Create Three Sheets**
   - Sheet 1: Name it `ContactForm`
   - Sheet 2: Name it `SignupData`
   - Sheet 3: Name it `InvoiceData`
   
   The headers will be automatically created by the script on first use.

### Step 2: Google Drive Setup

1. **Create a Folder for Invoices**
   - Go to [Google Drive](https://drive.google.com)
   - Create a new folder named "Bluemoon Invoices"
   - Right-click the folder → Get link → Copy the folder ID from URL:
     ```
     https://drive.google.com/drive/folders/FOLDER_ID_HERE
     ```

### Step 3: Google Apps Script Setup

1. **Open Apps Script Editor**
   - In your Google Spreadsheet, go to: Extensions → Apps Script
   - Delete any existing code

2. **Copy the Script**
   - Open `GoogleAppsScript.gs` file from this project
   - Copy all the code
   - Paste it into the Apps Script editor

3. **Update Configuration**
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
   - Replace `YOUR_DRIVE_FOLDER_ID_HERE` with your actual Drive Folder ID

4. **Deploy as Web App**
   - Click on "Deploy" → "New deployment"
   - Click the gear icon → Select "Web app"
   - Fill in the details:
     - Description: "Bluemoon Production API"
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Web App URL (it will look like):
     ```
     https://script.google.com/macros/s/DEPLOYMENT_ID/exec
     ```
   - Authorize the script when prompted

### Step 4: Update Website Configuration

1. **Update config.js**
   - Open `js/config.js`
   - Replace the `SCRIPT_URL` with your Web App URL from Step 3

2. **Test the Setup**
   - Open `index.html` in a web browser
   - Try submitting the contact form
   - Check if data appears in your Google Sheet

### Step 5: Add Your Logo

1. Add your company logo to the `images/` folder
2. Name it `logo.png` or update the image path in `index.html`

## 🔧 Configuration

### Updating Google Apps Script URL

In `js/config.js`:
```javascript
const CONFIG = {
    SCRIPT_URL: 'YOUR_WEB_APP_URL_HERE',
    // ... rest of config
};
```

### Customizing Colors

In `css/style.css`, update the CSS variables:
```css
:root {
    --primary-color: #1a1a2e;
    --secondary-color: #16213e;
    --accent-color: #0f3460;
    --highlight-color: #e94560;
    --text-light: #ffffff;
    --text-dark: #333333;
    --bg-light: #f5f5f5;
}
```

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Authentication Flow

1. **Signup**
   - User fills signup form
   - Data stored in `SignupData` sheet
   - Password validation (min 6 characters)
   - Email uniqueness check

2. **Login**
   - User enters email and password
   - Credentials verified against `SignupData` sheet
   - User data stored in localStorage
   - Invoice menu becomes visible

3. **Logout**
   - Clears localStorage
   - Hides invoice menu
   - Returns to guest view

## 📄 Invoice Generation Flow

1. User fills invoice form
2. Data sent to Google Apps Script
3. Script saves data to `InvoiceData` sheet
4. PDF generated with invoice details
5. PDF saved to Google Drive folder
6. Success message shown to user

## 🎨 Customization

### Adding More Services

In `index.html`, add more service cards:
```html
<div class="service-card">
    <i class="fas fa-icon-name"></i>
    <h3>Service Name</h3>
    <p>Service description</p>
</div>
```

### Adding More Carousel Items

In `index.html`, add more carousel items:
```html
<div class="carousel-item">
    <div class="carousel-video">
        <iframe src="YOUR_VIDEO_URL" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="carousel-content">
        <h3>Title</h3>
        <p>Description</p>
    </div>
</div>
```

### Changing Slider Images

Replace the image URLs in the slider section with your own images.

## 🐛 Troubleshooting

### Contact Form Not Working
- Check if SCRIPT_URL is correct in `config.js`
- Verify Google Apps Script is deployed with "Anyone" access
- Check browser console for errors

### Login Not Working
- Ensure `SignupData` sheet exists
- Check if user is registered
- Verify password matches

### Invoice PDF Not Generating
- Check Drive folder permissions
- Verify DRIVE_FOLDER_ID is correct
- Ensure Apps Script has Drive access

### CORS Errors
- Google Apps Script uses `no-cors` mode
- Some responses may not be readable
- Fallback logic is implemented for testing

## 📊 Google Sheets Structure

### ContactForm Sheet
| Timestamp | Name | Stage Name | Instagram | Email | Phone | Message |

### SignupData Sheet
| Timestamp | Full Name | Stage Name | Email | Phone | Password |

### InvoiceData Sheet
| Timestamp | Invoice No | Customer Name | Contact No | Date | Advance Amount | Total Amount |

## 🔒 Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: Currently passwords are stored in plain text. For production:
   - Implement password hashing
   - Use a proper authentication service
   - Consider OAuth integration

2. **API Security**: 
   - The Apps Script is open to "Anyone"
   - Add rate limiting for production
   - Implement API key authentication

3. **Data Validation**:
   - Add server-side validation
   - Sanitize user inputs
   - Implement CAPTCHA for forms

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and folder
4. Your site will be live at: `https://username.github.io/repo-name`

### Custom Domain
1. Add CNAME file with your domain
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

## 📝 License

This project is created for Bluemoon Production. All rights reserved.

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review Google Apps Script logs
- Check browser console for errors

## 🎉 Credits

- Font Awesome for icons
- Google Fonts for typography
- Unsplash for placeholder images

---

**Made with ❤️ for Bluemoon Production**
