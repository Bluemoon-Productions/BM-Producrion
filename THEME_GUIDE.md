# Theme Switcher Guide

## Overview
The theme switcher is an admin-only feature that allows changing the website's color scheme dynamically.

## Features

### Available Themes
1. **Purple Theme** (Default) - `#352487`
2. **Pink Theme** - `#e94560`
3. **Holi Festival** - Multicolor gradient (Red, Yellow, Green, Blue, Pink)
4. **Diwali Festival** - Orange, Gold, Red gradient
5. **Republic Day** - Saffron, White, Green, Navy Blue
6. **Independence Day** - Saffron, White, Green tricolor
7. **Dark Theme** - Dark mode with purple accents
8. **Light Theme** - Clean light theme with blue accents

## How It Works

### Admin Access
- Only users with `role: 'admin'` can see and use the theme switcher
- The theme switcher appears in the user profile dropdown menu (click on profile icon)
- Regular users won't see the theme options in their profile

### Using the Theme Switcher
1. Login with an admin account
2. Click on your profile icon in the top-right corner
3. The theme selector will appear in the dropdown menu
4. Click on any theme preview to apply it instantly
5. Theme preference is saved automatically

### Theme Persistence
- Selected theme is saved automatically
- Theme persists across page reloads
- Theme applies to both index.html and invoice.html

## Files Added

### CSS Files
- `css/theme.css` - Theme switcher styles and theme variables

### JavaScript Files
- `js/theme.js` - Theme management logic

## Implementation Details

### Theme Structure
Each theme contains:
- Primary color (main backgrounds)
- Secondary color (secondary elements)
- Accent color (borders, highlights)
- Highlight color (buttons, links, active states)
- Text colors (light and dark)
- Background color (page background)

### How to Add New Themes
Edit `js/theme.js` and add to the THEMES object:

```javascript
themeName: {
    name: 'Display Name',
    colors: {
        primary: '#color1',
        secondary: '#color2',
        accent: '#color3',
        highlight: '#color4',
        textLight: '#ffffff',
        textDark: '#333333',
        bgLight: '#f5f5f5'
    }
}
```

Then add preview in `css/theme.css`:
```css
.theme-themeName { 
    background: linear-gradient(135deg, #color1 0%, #color2 100%); 
}
```

## Testing Admin Access

### Method 1: Set Admin Role in Login Response
Modify your Google Apps Script to return `role: 'admin'` for specific users.

### Method 2: Manual Testing
In browser console:
```javascript
let user = JSON.parse(localStorage.getItem('user'));
user.role = 'admin';
localStorage.setItem('user', JSON.stringify(user));
location.reload();
```

## Responsive Design
- Theme switcher is fully responsive
- On mobile: Smaller button, adjusted panel size
- Touch-friendly interface

## Browser Compatibility
- Works on all modern browsers
- Uses CSS custom properties (CSS variables)
- Fallback for older browsers: default theme

## Notes
- Theme changes are instant (no page reload needed)
- All CSS uses CSS variables for easy theming
- Dark theme includes special styling for better readability
- Festival themes are perfect for seasonal promotions
