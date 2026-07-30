# 🎵 Bluemoon Production — Complete Music Production Website & Invoice System

> **A professional, fully responsive website for Bluemoon Production music company with integrated invoice generation, email management, multi-theme system, and 3D interactive UI.**

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Folder Structure](#-folder-structure)
4. [Setup Guide](#-setup-guide)
5. [Theme System](#-theme-system)
6. [Authentication System](#-authentication-system)
7. [Invoice System](#-invoice-system)
8. [Email System](#-email-system-emailgs)
9. [3D & Visual Effects](#-3d--visual-effects)
10. [Mobile Features](#-mobile-features)
11. [Quick Reference & Customization](#-quick-reference--customization)
12. [Testing Checklist](#-testing-checklist)
13. [Troubleshooting](#-troubleshooting)
14. [Deployment Guide](#-deployment-guide)
15. [Security Notes](#-security-notes)
16. [Technical Specifications](#-technical-specifications)

---

## 🎯 Project Overview

This is a complete business solution for **Bluemoon Production**, a music production company based in Indore, India. It combines a stunning marketing website with powerful backend tools for client management, invoicing, and email communication.

### Built With
| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Backend** | Google Apps Script (REST API) |
| **Database** | Google Sheets (3 sheets) |
| **File Storage** | Google Drive (PDF invoices) |
| **3D Engine** | Three.js + GSAP |
| **Animations** | CSS3, Web Audio API, Canvas |
| **Icons** | Font Awesome 6 |
| **Fonts** | Space Grotesk, Orbitron (Google Fonts) |

---

## ✨ Features

### 🌐 Website Features
- **Responsive Design** — Works on desktop (1920px+), tablet, and mobile (320px+)
- **Dynamic Image Slider** — 5 slides with smooth transitions, auto-play, touch swipe support
- **3D Flip Service Cards** — 9 music production services with 3D hover/tap flip effect
- **Client Carousel** — 7 client showcase slides with video embeds
- **About Section** — Split layout with animated stats counter, feature cards, team disciplines
- **Contact Form** — Google Sheets integration with auto-acknowledgement email
- **Authentication** — Login/Signup with role-based access (Admin/User)
- **6 Theme System** — Purple, Pink, Holi, Diwali, Independence Day, Dark
- **Admin Sidebar** — Vertical sidebar (desktop) / bottom bar (mobile) for admin tools
- **Custom Alert/Confirm** — Styled modal dialogs throughout
- **Animated Footer** — Music instrument icons with floating animation

### 🎨 Theme System
- **6 Unique Themes** with complete visual transformations
- **Theme Effects** — Floating balloons (Holi), twinkling lights (Diwali), flags (Independence), etc.
- **CSS Variables** — Dynamic color changes via `--highlight-color`, `--primary-color`, etc.
- **Persistence** — Theme saved to `localStorage`, persists across sessions
- **Role-Based Access** — Only Admin users can switch themes
- **Mobile Support** — Full theme selector in mobile hamburger menu

### 🔐 Authentication System
- **Signup** — Full name, stage name, email, phone, password
- **Login** — Email + password verification via Google Sheets
- **Role Management** — Admin (access to invoices, themes) / User (basic access)
- **Status Control** — Accounts created as "Inactive"; admin activates manually
- **Session Persistence** — `localStorage`-based, survives page refreshes
- **Edge Cases Handled** — Window resize, mobile/desktop toggle, double-login prevention

### 📄 Invoice Generator
- **Dynamic Item Table** — Add/remove items with auto-calculation
- **Auto Calculations** — Subtotal, total, advance payment, balance due
- **Number to Words** — Converts amounts to Indian Rupees format
- **Multiple Payment Methods** — Bank details, UPI, or Both
- **QR Code Generation** — Dynamic UPI QR codes for advance payment
- **PDF Generation** — Server-side via Google Apps Script (no DocumentApp needed)
- **Google Drive Storage** — Auto-save PDFs to designated Drive folder
- **Invoice History** — Full invoice list with preview, share, delete
- **Invoice Editing** — Load previous invoices for editing/re-creation
- **Stats Dashboard** — Total invoices, amount, paid/pending counts

### 📧 Email System (`Email.gs`)
- **Client Management** — Fetches unique client list from ContactForm sheet
- **Send Emails** — HTML templates with branding, file attachments
- **Reply to Threads** — Detects existing email threads via GmailApp
- **Draft Management** — Save, view, delete drafts
- **File Upload** — Upload files to Google Drive via base64
- **Google Drive Attachments** — Attach Drive files by ID

### 🎮 3D & Visual Effects
- **Three.js Scene** — Floating neon orbs, particle systems, mouse parallax
- **GSAP Animations** — Scroll-triggered effects, card hover lifts
- **Custom Cursor** — Dot + ring with magnetic hover effect
- **Particle Trail** — Colorful particles following mouse
- **Spinning Vinyl** — Animated record player in hero section
- **Sound Wave Bars** — Animated equalizer bars in hero
- **Glitch Text** — Cyberpunk glitch effect on slider headings
- **Floating Music Notes** — Ambient floating ♪/♫ symbols
- **Magnetic Buttons** — Buttons subtly follow cursor position
- **3D Card Tilt** — Service cards tilt based on mouse position
- **Scroll Reveal** — Elements fade and rotate into view
- **Noise Overlay** — Subtle grain texture for depth
- **Footer Equalizer** — Animated equalizer bars before footer

### 📱 Mobile Features
- **Hamburger Menu** — Full-screen overlay with animated bars
- **Mobile Login/Logout** — Login button and profile section inside hamburger menu
- **Mobile Theme Selector** — Grid layout with color circles, apply/cancel buttons
- **Responsive Admin Bar** — Bottom navigation bar on mobile (vs. sidebar on desktop)
- **Touch Swipe** — Slider supports touch swipe gestures
- **Card Tap Flip** — Service cards flip on tap (vs. hover on desktop)
- **Scroll Snap** — Carousel uses CSS scroll-snap on mobile
- **Responsive Grid** — Services grid adjusts from 3 columns (desktop) → 2 (tablet) → 1 (mobile)

---

## 📁 Folder Structure

```
BM-Producrion/
│
├── index.html                        # Main landing page
│
├── admin-manue/                      # Admin pages
│   ├── invoice.html                  # Invoice generator (admin only)
│   └── invoice-list.html             # Invoice list viewer (admin only)
│
├── css/                              # Stylesheets
│   ├── style.css                     # Core styles, about section, responsive
│   ├── navbar.css                    # Navbar glassmorphism, mobile menu, theme
│   ├── auth.css                      # Login/signup modal styling
│   ├── invoice.css                   # Invoice form & list page styling
│   ├── theme.css                     # 6 theme definitions + special effects
│   ├── admin.css                     # Admin sidebar (desktop left, mobile bottom)
│   └── animations.css                # 3D effects, cursor, glitch, vinyl, particles
│
├── js/                               # JavaScript files
│   ├── config.js                     # Google Apps Script URL + actions
│   ├── main.js                       # Navbar, slider, carousel, profile management
│   ├── auth.js                       # Login/Signup with validation
│   ├── theme.js                      # ThemeManager with visual effects
│   ├── animations.js                 # 3D canvas, particles, card tilt, scroll reveal
│   ├── three-setup.js                # Three.js 3D scene with floating orbs
│   ├── invoice.js                    # Invoice form, calculations, QR codes, list
│   ├── invoice-list.js               # Invoice list viewer with 3D cards & GSAP
│   └── utils.js                      # Custom alert/confirm dialogs
│
├── images/                           # Media assets
│   ├── bluemoon_production.gif       # Animated logo
│   ├── bm_favicon.png                # Browser tab icon
│   └── logo.svg                      # Vector logo placeholder
│
├── GoogleAppsScript.gs               # Backend: contact, auth, invoice, PDF gen
├── Email.gs                          # Email system: client list, send/reply, drafts
│
├── test-mobile-login.html            # Testing utility for mobile login
│
└── README.md                         # This file 📘
```

---

## 🚀 Setup Guide

### Step 1: Create Google Sheets
1. Go to [Google Sheets](https://sheets.google.com) → Create "Bluemoon Production Data"
2. Create 3 sheets:
   - `ContactForm` — Columns: Timestamp, Name, Stage Name, Instagram, Email, Phone, Message
   - `SignupData` — Columns: Timestamp, Full Name, Stage Name, Email, Phone, Password, Status, Role
   - `InvoiceData` — Columns: Invoice Number, Timestamp, Customer Name, Customer Email, Customer Phone, Invoice Date, Due Date, Subtotal, Advance Payment, Balance Due, Total Amount, Payment Method, Status, PDF URL, Terms, UPI ID
3. Copy **Spreadsheet ID** from URL (`/d/SPREADSHEET_ID/edit`)

### Step 2: Create Google Drive Folder
1. Go to [Google Drive](https://drive.google.com) → Create folder "Bluemoon Invoices"
2. Copy **Folder ID** from URL (`/folders/FOLDER_ID`)

### Step 3: Deploy Google Apps Script
1. Open your Google Sheet → Extensions → Apps Script
2. Copy contents of `GoogleAppsScript.gs` and `Email.gs` into the editor
3. Update IDs in the script:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';
   ```
4. Deploy → New deployment → Web app:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Copy the **Web App URL** (ends in `/exec`)

### Step 4: Update Configuration
In `js/config.js`, update:
```javascript
const CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec',
    SHEETS: { CONTACT: 'ContactForm', SIGNUP: 'SignupData', INVOICE: 'InvoiceData' },
    ACTIONS: { CONTACT: 'submitContact', SIGNUP: 'submitSignup', LOGIN: 'checkLogin', ... }
};
```

### Step 5: Test
1. Open `index.html` locally or deploy to a server
2. Submit contact form → Check `ContactForm` sheet
3. Sign up → Check `SignupData` sheet
4. Login → Verify profile appears
5. Generate invoice → Check `InvoiceData` sheet + Drive folder for PDF

---

## 🎨 Theme System

### Available Themes

| Theme | Highlight Color | Effects | Best For |
|-------|----------------|---------|----------|
| **Purple** (Default) | `#352487` | None | Professional, default |
| **Pink** | `#e91e63` | Pink gradient navbar/footer | Vibrant, energetic |
| **Holi** 🎉 | Multi-color | Floating balloons, color splash on click, animated rainbow gradient | Festival season |
| **Diwali** 🪔 | `#ffd54f` (golden) | Twinkling string lights, sparkles, diya click effect | Festival of Lights |
| **Independence** 🇮🇳 | `#ff9933` / `#138808` | Floating flags, tricolor navbar/buttons | National holidays |
| **Dark** 🌙 | `#bb86fc` | Dark backgrounds, purple accents | Night browsing, OLED |

### How to Switch Themes
- **Desktop:** Click profile icon → Theme section in dropdown → Select → Apply
- **Mobile:** Open hamburger menu → Scroll to profile → Theme grid → Select → Apply
- **Admin only:** Regular users cannot see the theme selector

### Adding a New Theme
Edit `js/theme.js` → Add to `THEMES` object:
```javascript
THEMES: {
    yourTheme: {
        name: 'Your Theme',
        colors: {
            primary: '#color1',
            secondary: '#color2',
            accent: '#color3',
            highlight: '#color4',
            textLight: '#ffffff',
            textDark: '#333333',
            bgLight: '#f5f5f5'
        },
        effects: 'effectName' // or leave undefined
    }
}
```
Then add CSS in `css/theme.css` for the effect + update `ThemeManager.applyThemeEffects()` in `js/theme.js`.

---

## 🔐 Authentication System

### User Roles
| Role | Can View Site | Can Login | Can Generate Invoices | Can Switch Themes |
|------|:------------:|:---------:|:--------------------:|:-----------------:|
| Guest | ✅ | ❌ | ❌ | ❌ |
| User | ✅ | ✅ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

### Account Lifecycle
1. User signs up → Account created with `Status: Inactive`, `Role: User`
2. Admin manually changes status to `Active` in Google Sheets
3. User can now login
4. Admin can promote users by changing role to `Admin`

### Security Notes
- ⚠️ Passwords currently stored in **plain text** (see Security Notes for improvement)
- Session stored in `localStorage` (cleared on logout)
- No sensitive tokens exposed client-side

---

## 📄 Invoice System

### Invoice Form Fields
| Section | Fields |
|---------|--------|
| **Invoice Info** | Invoice No (auto-generated), From (Company/Person, Phone, Email, Address) |
| **Client Details** | To (Name, Phone, Email, Address) |
| **Dates** | Invoice Date, Terms, Due Date |
| **Items** | Dynamic table with Sl.No, Description, Qty, Amount |
| **Totals** | Sub Total, Total, Advance Payment, Balance Due, Total in Words |
| **Payment** | Bank Details (Account Holder, Bank Name, Account Number, Type, IFSC, Branch, SWIFT) / UPI Details (UPI ID, Name) / Both |
| **Terms** | Free text terms & conditions |

### Payment Methods
- **Bank:** Account holder, bank name, account number, account type, IFSC code, branch, SWIFT code
- **UPI:** UPI ID, name — auto-generates QR code for advance payment amount
- **Both:** Shows both bank and UPI sections

### Invoice Data Flow
1. User fills form → JavaScript validates + calculates
2. QR code generated client-side via `api.qrserver.com`
3. Data sent to Google Apps Script via `POST` (JSON)
4. Apps Script saves data to `InvoiceData` sheet
5. Apps Script generates HTML invoice → converts to PDF via `Utilities.newBlob().getAs('application/pdf')`
6. PDF saved to Google Drive folder
7. Sheet URL and Drive URL returned to client

### Invoice List Features
- **Stats Dashboard:** Total invoices, total amount, paid/pending counts
- **3D Cards:** Invoices displayed as interactive 3D cards (GSAP animations)
- **Preview:** Google Drive PDF preview in modal
- **Share:** Native share API or clipboard copy
- **Delete:** Remove invoice from sheet
- **Auto-Refresh:** List refreshes every 30 seconds

---

## 📧 Email System (`Email.gs`)

The separate `Email.gs` file provides a complete email marketing tool:

| Action | Description |
|--------|-------------|
| `getClients` | Fetch unique client list from ContactForm (deduplicated by email) |
| `checkEmailExists` | Check if an email has previously contacted |
| `sendEmail` | Send HTML-branded email with optional Drive attachments |
| `saveDraft` | Save email as draft to DraftEmails sheet |
| `getDrafts` | Fetch all saved drafts |
| `deleteDraft` | Delete a draft by ID |
| `updateDraftStatus` | Update draft status (draft → sent) |
| `uploadFileToGoogleDrive` | Upload base64 file to Drive |

Email templates include:
- Professional HTML with Bluemoon Production branding
- Gradient header, styled content areas, footer with signature
- Support for inline links, file attachments, and reply-to-thread detection

---

## 🎮 3D & Visual Effects

### Effects Breakdown

| Effect | File | Description |
|--------|------|-------------|
| Three.js Scene | `three-setup.js` | 12 floating neon orbs, 500-particle system, mouse interaction |
| GSAP Scroll | `three-setup.js` | Parallax scroll effects on orbs |
| Custom Cursor | `animations.css` | Dot + ring cursor with magnetic hover (commented out by default) |
| Particle Trail | `animations.js` | Colorful particles follow mouse (throttled at 40ms) |
| 3D Background | `animations.js` | 55 floating music symbols (♪♫♬) with connection lines |
| Sound Wave Bars | `animations.js` | 100 animated bars in hero (50 on mobile) |
| Spinning Vinyl | `animations.js` | Animated record with glowing center (desktop only) |
| Glitch Text | `animations.css` | Cyberpunk glitch on slider h1 elements |
| Floating Notes | `animations.js` | Ambient ♪/♫ notes every 800ms |
| 3D Card Tilt | `animations.js` | Service cards tilt 12° on mouse move |
| Magnetic Buttons | `animations.js` | Buttons follow cursor with 0.25x offset |
| Scroll Reveal | `animations.js` | Elements fade+rotate into view on scroll |
| Stats Counter | `animations.js` | Number counters animate from 0 to target |
| Footer Equalizer | `animations.js` | 22 animated equalizer bars in footer |
| Noise Overlay | `animations.css` | Subtle SVG noise grain overlay |
| Neon Glow | `animations.css` | Nav links glow on hover |

### Performance Optimizations
- Effects are disabled or reduced on mobile (`window.innerWidth <= 768`)
- Particle trail throttled to avoid performance issues
- Three.js scene uses `alpha: true` to overlay on content
- All animations use GPU-accelerated CSS transforms

---

## 📱 Mobile Features

### Responsive Breakpoints
| Device | Width | Grid Columns | Features |
|--------|-------|:------------:|----------|
| Desktop | ≥ 1024px | 3 | Full sidebar, hover effects, vinyl record |
| Laptop | 1024-1919px | 3 | Full functionality |
| Tablet | 768-1023px | 2 | Adjusted about section |
| Mobile | 320-767px | 1 | Hamburger menu, bottom admin bar, tap-to-flip cards |

### Mobile-Specific Features
- **Hamburger Menu:** Animated bars (→ X on open), full-screen overlay with scroll
- **Mobile Login:** Login button inside hamburger menu when logged out
- **Mobile Profile:** User info + logout button inside hamburger menu when logged in
- **Mobile Theme Selector:** Responsive grid (2-3 columns), color circles, apply/cancel buttons
- **Bottom Admin Bar:** On mobile, the admin sidebar becomes a bottom tab bar
- **Touch Swipe:** Slider supports swipe gestures (50px threshold)
- **Card Tap Flip:** Service cards flip on tap (not hover) — `.flipped` class toggle
- **Scroll-Snap Carousel:** CSS `scroll-snap-type: x mandatory` for smooth swiping

### Desktop→Mobile Transition
- Automatic detection via `window.innerWidth` + resize event listener
- Mobile elements created/removed dynamically from DOM
- CSS backup: `@media (min-width: 769px) { .mobile-login, .mobile-profile { display: none !important; } }`

---

## 🎯 Quick Reference & Customization

### Change Colors
In `css/style.css`:
```css
:root {
    --primary-color: #1a1a2e;
    --secondary-color: #16213e;
    --accent-color: #0f3460;
    --highlight-color: #352487;
    --text-light: #ffffff;
    --text-dark: #333333;
    --bg-light: #f5f5f5;
}
```

### Update Company Info
- **Logo:** Replace `images/bluemoon_production.gif` or update `<img>` path in `index.html`
- **Company Name:** Update in `index.html` (title, navbar) and `admin-manue/invoice.html` (default "From" name)
- **Contact:** Update default email/phone in `admin-manue/invoice.html` from fields
- **Social Links:** Update footer `<a href="...">` in `index.html`
- **Slider Images:** Replace Unsplash URLs in `index.html` slider section
- **Client Videos:** Replace YouTube embed IDs in carousel section

### Add More Services
Copy a `.service-card` block in `index.html`:
```html
<div class="service-card">
    <div class="sc-inner">
        <div class="sc-front">
            <span class="sc-num">10</span>
            <div class="sc-icon-wrap"><i class="fas fa-icon-name"></i></div>
            <h3>Service Name</h3>
            <div class="sc-line"></div>
        </div>
        <div class="sc-back">
            <i class="fas fa-icon-name sc-back-icon"></i>
            <h3>Service Name</h3>
            <p>Description here...</p>
            <span class="sc-tag">Tag1 · Tag2</span>
        </div>
    </div>
</div>
```

### Change Invoice Number Format
In `js/invoice.js`:
```javascript
function generateInvoiceNumber() {
    // Change the format here
    return `INV-${year}${month}-${random}`;
}
```

### Add Password Hashing
In `GoogleAppsScript.gs`, add SHA-256 hashing:
```javascript
function hashPassword(password) {
    return Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256, password
    ).map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}
// In handleSignup: hashPassword(data.password)
// In handleLogin: row[5] === hashPassword(data.password)
```

### Add Google Analytics
In `index.html` `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','GA_MEASUREMENT_ID');</script>
```

### Custom Alert/Confirm
Reusable `customAlert()` and `customConfirm()` functions in `js/utils.js`:
```javascript
await customAlert('Message', 'Title', 'Icon');
await customConfirm('Are you sure?', 'Confirm', '❓');
```

---

## 🧪 Testing Checklist

### 📱 Responsive Design
- [ ] Desktop (1920px+) — 3-column grid, full sidebar, hover effects
- [ ] Tablet (768-1023px) — 2-column grid, adjusted layout
- [ ] Mobile (320-767px) — Hamburger menu, 1-column, tap-to-flip, bottom bar

### 🔐 Authentication
- [ ] Signup with validation (password match, min 6 chars, email format)
- [ ] Login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Login fails for inactive accounts ("Contact admin" message)
- [ ] Profile icon appears on login
- [ ] Logout clears session
- [ ] Admin sees invoice menu and theme selector
- [ ] Regular user does NOT see invoice menu
- [ ] Session persists across page refresh

### 📧 Contact Form
- [ ] All required fields validated
- [ ] Form submits to Google Sheets
- [ ] Success message displayed
- [ ] Auto-acknowledgement email sent

### 📄 Invoice Generator
- [ ] Add/remove items works
- [ ] Calculations correct (qty × amount, subtotal, advance, balance)
- [ ] Number to words converts correctly
- [ ] Payment methods toggle correctly
- [ ] UPI QR code generated
- [ ] Invoice saves to Google Sheets
- [ ] PDF generated and saved to Google Drive
- [ ] Invoice list loads with stats
- [ ] Preview/Share/Delete actions work

### 🎨 Theme System
- [ ] All 6 themes apply correctly
- [ ] Theme effects work (Holi balloons, Diwali lights, etc.)
- [ ] Theme persists on refresh
- [ ] Only Admin users see theme selector
- [ ] Mobile theme selector works

### 🎮 3D Effects
- [ ] Three.js orbs animate (desktop)
- [ ] Particles and connection lines visible
- [ ] Sound wave bars animate
- [ ] Service cards tilt on hover (desktop)
- [ ] Cards flip on tap (mobile)
- [ ] Scroll reveal works
- [ ] Stats counter animates
- [ ] Footer equalizer animates

### 🐛 Edge Cases
- [ ] Window resize desktop↔mobile maintains correct UI
- [ ] No double login buttons
- [ ] Mobile login/logout works correctly
- [ ] Admin bottom bar on mobile
- [ ] All forms handle CORS errors gracefully (fallback logic)
- [ ] Theme effects don't break when switching
- [ ] No console errors

---

## 🔧 Troubleshooting

### Contact Form Not Submitting
- ✅ Verify `SCRIPT_URL` in `config.js` matches deployed Web App URL
- ✅ Ensure Apps Script deployed with "Anyone" access
- ✅ Check `SPREADSHEET_ID` is correct
- ✅ Verify sheet name is exactly `ContactForm`

### Login Not Working
- ✅ Ensure account status is "Active" in `SignupData` sheet
- ✅ Check email and password match exactly (case-sensitive)
- ✅ Clear browser cache and try again
- ✅ Check browser console for JavaScript errors

### Invoice PDF Not Generating
- ✅ Verify `DRIVE_FOLDER_ID` is correct in `GoogleAppsScript.gs`
- ✅ Check Drive folder permissions (owner)
- ✅ Ensure Apps Script has Drive access
- ❌ **Fixed:** No longer uses `DocumentApp.create()` — uses `Utilities.newBlob()` instead

### "Script is not deployed" Error
- ✅ Deploy as Web App with "Anyone" access
- ✅ Set "Execute as" to "Me"
- ✅ Copy correct Web App URL (ends in `/exec`)

### CORS Errors in Console
- ✅ **This is normal!** Google Apps Script uses `no-cors` mode
- ✅ Data is still saved correctly
- ✅ Check Google Sheets to verify, not console messages

### Theme Not Changing
- ✅ Ensure you're logged in as Admin
- ✅ Tap theme to select it, then click "Apply"
- ✅ Check `localStorage` for `selectedTheme` key

### Double Login Button on Desktop
- ✅ **Fixed:** Screen width checks prevent mobile elements on desktop
- ✅ CSS backup: `@media (min-width: 769px) { .mobile-login, .mobile-profile { display: none !important; } }`

### Debugging Tools
```javascript
// Browser console checks
localStorage.getItem('user');              // Check auth state
localStorage.getItem('selectedTheme');     // Check current theme
document.querySelector('.mobile-login');   // Check mobile elements
document.querySelector('.mobile-profile');
window.innerWidth;                         // Check viewport
```

### Apps Script Debugging
1. Open Apps Script editor → "Executions" sidebar
2. View execution logs and errors
3. Add `Logger.log()` for custom debugging
4. Test endpoint: Visit your Web App URL directly (should show "Bluemoon Production API is running!")

---

## 🚀 Deployment Guide

### Option 1: GitHub Pages (Free)
```bash
cd /path/to/BM-Producrion
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bluemoon-production.git
git push -u origin main
```
Then: Repository → Settings → Pages → Select "main" branch → Save

### Option 2: Netlify (Free)
- Drag-and-drop project folder to [Netlify](https://netlify.com)
- Or connect GitHub repository → Auto-deploys on push

### Option 3: Vercel (Free)
- Import from GitHub at [Vercel](https://vercel.com)
- Or `npx vercel deploy`

### Option 4: Traditional Hosting
- Upload all files via FTP to `public_html/` or `www/` folder
- Ensure correct file permissions (755 for directories, 644 for files)

### Post-Deployment Checklist
- [ ] All forms submit successfully (check Google Sheets)
- [ ] Login/Signup works on live URL
- [ ] Invoice generates PDF to Drive
- [ ] Google Apps Script is deployed with correct permissions
- [ ] Theme switching works
- [ ] Mobile responsive on real devices
- [ ] No broken links or missing assets

---

## 🔒 Security Notes

⚠️ **Important security improvements recommended before production:**

1. **Password Hashing** — Passwords stored in plain text. Add SHA-256 in `GoogleAppsScript.gs`
2. **Rate Limiting** — Add to `GoogleAppsScript.gs` using `CacheService.getScriptCache()`
3. **Input Validation** — Add server-side validation in Apps Script
4. **CAPTCHA** — Consider adding reCAPTCHA to contact/signup forms
5. **API Security** — Web App is open to "Anyone"; consider API key authentication
6. **localStorage** — No sensitive data stored; session-only user info
7. **HTTPS** — All deployments should use HTTPS (GitHub Pages, Netlify, Vercel all provide this)

---

## 💻 Technical Specifications

### Browser Support
| Browser | Support |
|---------|:-------:|
| Chrome 90+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |
| iOS Safari | ✅ Full |
| Android Chrome | ✅ Full |
| IE 11 | ⚠️ Limited (no effects) |

### File Sizes
| Category | Size |
|----------|:----:|
| HTML | ~60 KB |
| CSS (combined) | ~80 KB |
| JS (combined) | ~120 KB |
| Images | ~500 KB (GIF) |
| Total | ~760 KB |

### Dependencies (CDN)
```html
<!-- Three.js 3D Engine -->
<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>

<!-- GSAP Animation Library -->
<script src="https://cdn.skypack.dev/gsap@3.12.5"></script>

<!-- Font Awesome Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
```

### Google Sheets Structure

**ContactForm:**
| Timestamp | Name | Stage Name | Instagram | Email | Phone | Message |

**SignupData:**
| Timestamp | Full Name | Stage Name | Email | Phone | Password | Status | Role |

**InvoiceData:**
| Invoice Number | Timestamp | Customer Name | Customer Email | Customer Phone | Invoice Date | Due Date | Subtotal | Advance Payment | Balance Due | Total Amount | Payment Method | Status | PDF URL | Terms | UPI ID |

**DraftEmails (via Email.gs):**
| Timestamp | To | Subject | Message | Links | Status | Is Reply | Row ID |

---

## 📝 License

Created for **Bluemoon Production** — Indore, Madhya Pradesh, India.

All rights reserved. This project is proprietary software for Bluemoon Production's business operations.

---

## 🎉 Credits

- **Font Awesome** — Icons
- **Google Fonts** — Space Grotesk, Orbitron typography
- **Three.js** — 3D rendering engine
- **GSAP** — Animation library
- **Unsplash** — Stock images (placeholder)
- **QR Server API** — UPI QR code generation

---

**Built with ❤️ for Bluemoon Production**
*Professional. Responsive. Feature-Complete.*

---

> **Quick Start:** Open `index.html` in a browser to view the site.

