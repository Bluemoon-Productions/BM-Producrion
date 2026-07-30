// Navbar functionality
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar scroll effect
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

if (navLinks.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Image Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.slider-dots');
const sliderContainer = document.querySelector('.slider-container');
let autoSlideInterval;

if (slides.length && dotsContainer) {
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    if (!slides.length) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    if (window.animateWaveBarsOnSlide) window.animateWaveBarsOnSlide();
}

function changeSlide(n) { showSlide(currentSlide + n); }
function goToSlide(n) { showSlide(n); }

function startAutoSlide() {
    autoSlideInterval = setInterval(() => changeSlide(1), 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

if (slides.length) {
    startAutoSlide();
    if (sliderContainer) {
        if (window.innerWidth > 768) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
        let touchStartX = 0, touchEndX = 0;
        sliderContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        sliderContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                stopAutoSlide();
                changeSlide(diff > 0 ? 1 : -1);
                startAutoSlide();
            }
        }, { passive: true });
    }
}

// Clients Carousel
let currentCarouselItem = 0;
const carouselItems = document.querySelectorAll('.carousel-item');

function showCarouselItem(n) {
    carouselItems.forEach(item => item.classList.remove('active'));
    currentCarouselItem = (n + carouselItems.length) % carouselItems.length;
    carouselItems[currentCarouselItem].classList.add('active');
}

function changeCarousel(n) {
    showCarouselItem(currentCarouselItem + n);
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            action: CONFIG.ACTIONS.CONTACT,
            name: document.getElementById('contactName').value,
            stageName: document.getElementById('contactStageName').value,
            instagram: document.getElementById('contactInstagram').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            message: document.getElementById('contactMessage').value
        };

        try {
            await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } catch (error) {
            console.error('Error:', error);
        }
        await customAlert('Thank you for contacting us! We will get back to you soon.', 'Success', '✓');
        contactForm.reset();
    });
}

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        showUserProfile(user);
    } else {
        showMobileLogin();
    }
});

// Handle window resize to show/hide mobile elements
window.addEventListener('resize', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const mobileProfile = document.querySelector('.mobile-profile');
        if (window.innerWidth <= 768 && !mobileProfile) {
            addMobileProfile(user);
        } else if (window.innerWidth > 768 && mobileProfile) {
            mobileProfile.remove();
        }
    } else {
        const mobileLogin = document.querySelector('.mobile-login');
        if (window.innerWidth <= 768 && !mobileLogin) {
            showMobileLogin();
        } else if (window.innerWidth > 768 && mobileLogin) {
            mobileLogin.remove();
        }
    }
});

function showUserProfile(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'block';

    if (user.role && user.role.toLowerCase() === 'admin') {
        document.body.classList.add('admin-view');
    } else {
        document.body.classList.remove('admin-view');
    }

    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileStage = document.getElementById('profileStage');
    if (profileName) profileName.textContent = user.fullName;
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileStage) profileStage.textContent = user.stageName ? `Stage: ${user.stageName}` : '';

    removeMobileLogin();
    addMobileProfile(user);

    if (window.themeManager) {
        setTimeout(() => {
            window.themeManager.addThemeToProfile();
            window.themeManager.checkAdminAccess();
        }, 100);
    }
}

function addMobileProfile(user) {
    const existingMobile = document.querySelector('.mobile-profile');
    if (existingMobile) existingMobile.remove();

    if (window.innerWidth <= 768 && navMenu) {
        const currentTheme = localStorage.getItem('selectedTheme') || 'purple';
        const isAdmin = user.role && user.role.toLowerCase() === 'admin';

        const themeSection = isAdmin ? `
            <div class="mobile-theme-section">
                <h4>🎨 Select Theme</h4>
                <div class="mobile-theme-list">
                    <div class="mobile-theme-item ${currentTheme === 'purple' ? 'active' : ''}" data-theme="purple">
                        <div class="mobile-theme-circle theme-purple"></div>
                        <span class="mobile-theme-label">Purple</span>
                    </div>
                    <div class="mobile-theme-item ${currentTheme === 'pink' ? 'active' : ''}" data-theme="pink">
                        <div class="mobile-theme-circle theme-pink"></div>
                        <span class="mobile-theme-label">Pink</span>
                    </div>
                    <div class="mobile-theme-item ${currentTheme === 'holi' ? 'active' : ''}" data-theme="holi">
                        <div class="mobile-theme-circle theme-holi"></div>
                        <span class="mobile-theme-label">Holi</span>
                    </div>
                    <div class="mobile-theme-item ${currentTheme === 'diwali' ? 'active' : ''}" data-theme="diwali">
                        <div class="mobile-theme-circle theme-diwali"></div>
                        <span class="mobile-theme-label">Diwali</span>
                    </div>
                    <div class="mobile-theme-item ${currentTheme === 'independence' ? 'active' : ''}" data-theme="independence">
                        <div class="mobile-theme-circle theme-independence"></div>
                        <span class="mobile-theme-label">Independence</span>
                    </div>
                    <div class="mobile-theme-item ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                        <div class="mobile-theme-circle theme-dark"></div>
                        <span class="mobile-theme-label">Dark</span>
                    </div>
                </div>
                <div class="mobile-theme-buttons">
                    <button class="mobile-theme-cancel-btn" id="mobileThemeCancelBtn">Cancel</button>
                    <button class="mobile-theme-apply-btn" id="mobileThemeApplyBtn">Apply</button>
                </div>
            </div>
        ` : '';

        const mobileProfile = document.createElement('li');
        mobileProfile.className = 'mobile-profile';
        mobileProfile.innerHTML = `
            <div class="profile-info">
                <p><strong>${user.fullName}</strong></p>
                <p>${user.email}</p>
                ${user.stageName ? `<p>Stage: ${user.stageName}</p>` : ''}
            </div>
            ${themeSection}
            <button class="logout-btn" id="mobileLogoutBtn">Logout</button>
        `;

        navMenu.appendChild(mobileProfile);

        if (isAdmin) {
            let selectedTheme = currentTheme;

            mobileProfile.querySelectorAll('.mobile-theme-item').forEach(item => {
                item.addEventListener('click', () => {
                    selectedTheme = item.dataset.theme;
                    mobileProfile.querySelectorAll('.mobile-theme-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                });
            });

            document.getElementById('mobileThemeApplyBtn').addEventListener('click', async () => {
                if (window.themeManager) {
                    window.themeManager.switchTheme(selectedTheme);
                    await customAlert('Theme applied successfully!', 'Success', '🎨');
                }
            });

            document.getElementById('mobileThemeCancelBtn').addEventListener('click', () => {
                selectedTheme = currentTheme;
                mobileProfile.querySelectorAll('.mobile-theme-item').forEach(i => {
                    i.classList.remove('active');
                    if (i.dataset.theme === currentTheme) i.classList.add('active');
                });
            });
        }

        document.getElementById('mobileLogoutBtn').addEventListener('click', async () => {
            localStorage.removeItem('user');
            hideUserProfile();
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            await customAlert('Logged out successfully!', 'Success', '✓');
        });
    }
}

function showMobileLogin() {
    const existingLogin = document.querySelector('.mobile-login');
    if (existingLogin) existingLogin.remove();

    if (window.innerWidth <= 768 && navMenu) {
        const mobileLogin = document.createElement('li');
        mobileLogin.className = 'mobile-login';
        mobileLogin.innerHTML = `<button class="login-btn" id="mobileLoginBtn">Login</button>`;
        navMenu.appendChild(mobileLogin);

        document.getElementById('mobileLoginBtn').addEventListener('click', () => {
            if (window.authModal) {
                window.authModal.style.display = 'block';
                if (window.showLoginForm) window.showLoginForm();
            }
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    }
}

function removeMobileLogin() {
    const mobileLogin = document.querySelector('.mobile-login');
    if (mobileLogin) mobileLogin.remove();
}

function hideUserProfile() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    if (loginBtn) loginBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    document.body.classList.remove('admin-view');

    const mobileProfile = document.querySelector('.mobile-profile');
    if (mobileProfile) mobileProfile.remove();

    showMobileLogin();
}

// Service cards hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Admin Sidebar interactivity
const adminSidebar = document.getElementById('adminSidebar');
if (adminSidebar) {
    adminSidebar.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) adminSidebar.classList.add('expanded');
    });
    adminSidebar.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) adminSidebar.classList.remove('expanded');
    });
}
