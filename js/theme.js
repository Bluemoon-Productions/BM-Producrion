// Theme — fixed purple theme, no switching
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { localStorage.removeItem('selectedTheme'); });
} else {
    localStorage.removeItem('selectedTheme');
}

window.themeManager = {
    addThemeToProfile() {},
    checkAdminAccess() {},
    switchTheme() {}
};
