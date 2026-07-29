// Theme Management System
const THEMES = {
    purple: {
        name: 'Purple',
        colors: {
            primary: '#1a1a2e',
            secondary: '#16213e',
            accent: '#0f3460',
            highlight: '#352487',
            textLight: '#ffffff',
            textDark: '#333333',
            bgLight: '#f5f5f5'
        }
    },
    pink: {
        name: 'Pink',
        colors: {
            primary: '#c2185b',
            secondary: '#880e4f',
            accent: '#f06292',
            highlight: '#e91e63',
            textLight: '#ffffff',
            textDark: '#333333',
            bgLight: '#fce4ec'
        },
        effects: 'pink'
    },
    holi: {
        name: 'Holi',
        colors: {
            primary: '#e91e63',
            secondary: '#9c27b0',
            accent: '#ff9800',
            highlight: '#4caf50',
            textLight: '#ffffff',
            textDark: '#333333',
            bgLight: '#fff3e0'
        },
        effects: 'holi'
    },
    diwali: {
        name: 'Diwali',
        colors: {
            primary: '#ff6f00',
            secondary: '#bf360c',
            accent: '#ffd54f',
            highlight: '#ff6f00',
            textLight: '#ffffff',
            textDark: '#333333',
            bgLight: '#fff8e1'
        },
        effects: 'diwali'
    },
    independence: {
        name: 'Independence',
        colors: {
            primary: '#ff9933',
            secondary: '#138808',
            accent: '#000080',
            highlight: '#138808',
            textLight: '#ffffff',
            textDark: '#333333',
            bgLight: '#ffffff'
        },
        effects: 'india'
    },
    dark: {
        name: 'Dark',
        colors: {
            primary: '#2d2d2d',
            secondary: '#1a1a1a',
            accent: '#404040',
            highlight: '#bb86fc',
            textLight: '#ffffff',
            textDark: '#e0e0e0',
            bgLight: '#121212'
        }
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.selectedTheme = this.currentTheme;
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
    }

    addThemeToProfile() { /* theme switcher hidden */ }

    checkAdminAccess() { /* theme switcher hidden */ }

    switchTheme(themeName) {
        this.currentTheme = themeName;
        this.selectedTheme = themeName;
        this.saveTheme(themeName);
        // Reload page to apply theme properly
        window.location.reload();
    }

    applyTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;

        const root = document.documentElement;
        Object.keys(theme.colors).forEach(key => {
            const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--${cssVar}`, theme.colors[key]);
        });

        if (themeName === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        this.removeAllEffects();
        if (theme.effects) {
            document.body.setAttribute('data-theme-effect', theme.effects);
            this.applyThemeEffects(theme.effects);
        }
    }

    saveTheme(themeName) {
        localStorage.setItem('selectedTheme', themeName);
    }

    loadTheme() {
        return localStorage.getItem('selectedTheme') || 'purple';
    }

    removeAllEffects() {
        document.body.removeAttribute('data-theme-effect');
        const effects = document.querySelector('.theme-effects');
        if (effects) effects.remove();
        if (this.holiClickHandler) document.removeEventListener('click', this.holiClickHandler);
        if (this.diwaliClickHandler) document.removeEventListener('click', this.diwaliClickHandler);
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.background = '';
    }

    applyThemeEffects(effect) {
        if (effect === 'holi') {
            this.createHoliEffect();
        } else if (effect === 'diwali') {
            this.createDiwaliEffect();
        } else if (effect === 'india') {
            this.createIndiaEffect();
        } else if (effect === 'pink') {
            this.createPinkEffect();
        }
    }

    createHoliEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effects holi-effects';
        container.innerHTML = '<div class="holi-balloons"></div>';
        document.body.appendChild(container);

        const balloons = container.querySelector('.holi-balloons');
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff6bff', '#ff9800'];
        
        for (let i = 0; i < 20; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'holi-balloon';
            balloon.textContent = '🎈';
            balloon.style.left = Math.random() * 100 + '%';
            balloon.style.animationDelay = Math.random() * 5 + 's';
            balloon.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            balloons.appendChild(balloon);
        }

        this.holiClickHandler = (e) => {
            for (let i = 0; i < 15; i++) {
                const gulal = document.createElement('div');
                gulal.className = 'holi-gulal';
                gulal.style.left = e.clientX + 'px';
                gulal.style.top = e.clientY + 'px';
                gulal.style.background = colors[Math.floor(Math.random() * colors.length)];
                gulal.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
                gulal.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
                gulal.style.animationDelay = Math.random() * 0.1 + 's';
                document.body.appendChild(gulal);
                setTimeout(() => gulal.remove(), 1500);
            }
        };
        document.addEventListener('click', this.holiClickHandler);
    }

    createDiwaliEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effects diwali-effects';
        container.innerHTML = `
            <div class="diwali-lights"></div>
            <div class="diwali-sparkles"></div>
        `;
        document.body.appendChild(container);

        const lights = container.querySelector('.diwali-lights');
        for (let i = 0; i < 50; i++) {
            const light = document.createElement('div');
            light.className = 'diwali-light';
            light.style.left = (i * 2) + '%';
            light.style.animationDelay = Math.random() * 2 + 's';
            lights.appendChild(light);
        }

        const sparkles = container.querySelector('.diwali-sparkles');
        for (let i = 0; i < 50; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'diwali-sparkle';
            sparkle.textContent = '✨';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            sparkles.appendChild(sparkle);
        }

        const footer = document.querySelector('.footer');
        if (footer) {
            const diyaRow = document.createElement('div');
            diyaRow.className = 'diwali-footer-diyas';
            for (let i = 0; i < 10; i++) {
                const diya = document.createElement('span');
                diya.textContent = '🪔';
                diya.style.animationDelay = (i * 0.2) + 's';
                diyaRow.appendChild(diya);
            }
            footer.insertBefore(diyaRow, footer.firstChild);
        }

        this.diwaliClickHandler = (e) => {
            for (let i = 0; i < 20; i++) {
                const spark = document.createElement('div');
                spark.className = 'diwali-spark';
                spark.textContent = '✨';
                spark.style.left = e.clientX + 'px';
                spark.style.top = e.clientY + 'px';
                spark.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                spark.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
                spark.style.animationDelay = Math.random() * 0.1 + 's';
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 1000);
            }
        };
        document.addEventListener('click', this.diwaliClickHandler);
    }

    createIndiaEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effects india-effects';
        container.innerHTML = '<div class="india-flags"></div>';
        document.body.appendChild(container);

        const flags = container.querySelector('.india-flags');
        for (let i = 0; i < 10; i++) {
            const flag = document.createElement('div');
            flag.className = 'india-flag';
            flag.innerHTML = '🇮🇳';
            flag.style.left = Math.random() * 100 + '%';
            flag.style.animationDelay = Math.random() * 5 + 's';
            flags.appendChild(flag);
        }

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.background = 'linear-gradient(to bottom, #ff9933 0%, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%, #138808 100%)';
        }

        const footer = document.querySelector('.footer');
        if (footer) {
            const decoration = document.createElement('div');
            decoration.className = 'india-footer-decoration';
            const symbols = ['🇮🇳', '🦚', '🐘', '🏛️', '☀️', '🏛️', '🐘', '🦚', '🇮🇳'];
            symbols.forEach((symbol, i) => {
                const span = document.createElement('span');
                span.textContent = symbol;
                span.style.animationDelay = (i * 0.2) + 's';
                decoration.appendChild(span);
            });
            footer.insertBefore(decoration, footer.firstChild);
        }
    }

    createPinkEffect() {
        // Pink theme effect - set data attribute
        document.body.setAttribute('data-theme-effect', 'pink');
    }
}

// Initialize theme manager when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}

// Update theme switcher visibility on login/logout
window.addEventListener('storage', (e) => {
    if (e.key === 'user' && window.themeManager) {
        window.themeManager.checkAdminAccess();
    }
});
