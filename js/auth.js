// Modal functionality
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const logoutBtn = document.getElementById('logoutBtn');

// Open modal
loginBtn.addEventListener('click', () => {
    authModal.style.display = 'block';
    showLoginForm();
});

// Close modal
closeModal.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Switch between login and signup
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

function showLoginForm() {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
}

function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
}

// Make authModal and showLoginForm globally accessible for mobile login
window.authModal = authModal;
window.showLoginForm = showLoginForm;

// Signup Form Submission
signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password        = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) { showError('Passwords do not match!'); return; }
    if (password.length < 6)          { showError('Password must be at least 6 characters!'); return; }

    const formData = {
        action:    CONFIG.ACTIONS.SIGNUP,
        fullName:  document.getElementById('signupFullName').value,
        stageName: document.getElementById('signupStageName').value,
        email:     document.getElementById('signupEmail').value,
        phone:     document.getElementById('signupPhone').value,
        password
    };

    try {
        showLoading(true);
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(formData)
        });
        const text = await response.text();
        let result;
        try { result = JSON.parse(text); }
        catch(pe) { throw new Error('Bad response'); }
        showLoading(false);

        if (result.success) {
            await showSuccess('Account created! Please wait for admin approval before logging in.');
            showLoginForm();
            signupFormElement.reset();
        } else {
            showError(result.error || 'Signup failed. Please try again.');
        }
    } catch (error) {
        showLoading(false);
        console.error('Signup error:', error);
        showError('Signup failed. Please try again.');
    }
});

// Login Form Submission
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Trim + normalize — handles autofill spaces, case issues
    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showError('Please enter your email and password.');
        return;
    }

    try {
        showLoading(true);

        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: CONFIG.ACTIONS.LOGIN, email, password })
        });

        const text = await response.text();
        let result;
        try { result = JSON.parse(text); }
        catch(pe) { throw new Error('Bad response: ' + text.substring(0, 100)); }
        showLoading(false);

        if (result.success) {
            const user = {
                fullName:  result.user.fullName,
                stageName: result.user.stageName,
                email:     result.user.email,
                phone:     result.user.phone,
                status:    result.user.status,
                role:      result.user.role
            };
            localStorage.setItem('user', JSON.stringify(user));
            authModal.style.display = 'none';
            showUserProfile(user);
            loginFormElement.reset();
            if (window.themeManager) window.themeManager.checkAdminAccess();
        } else {
            if (result.error && result.error.toLowerCase().includes('not active')) {
                showError('Account not activated. Please contact admin for approval.');
            } else {
                showError(result.error || 'Invalid email or password.');
            }
        }

    } catch (error) {
        showLoading(false);
        console.error('Login error:', error);
        showError('Something went wrong. Please check your connection and try again.');
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    localStorage.removeItem('user');
    hideUserProfile();
    if (window.themeManager) {
        window.themeManager.checkAdminAccess();
    }
    await customAlert('Logged out successfully!', 'Success', '✓');
});

// Helper functions
async function showError(message) {
    await customAlert(message, 'Error', '✕');
}

async function showSuccess(message) {
    await customAlert(message, 'Success', '✓');
}

function showLoading(show) {
    const activeForm = loginForm.style.display === 'block' ? loginFormElement : signupFormElement;
    const submitBtn = activeForm.querySelector('.auth-submit-btn');
    
    if (show) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner show"></div>';
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = loginForm.style.display === 'block' ? 'Login' : 'Sign Up';
    }
}
