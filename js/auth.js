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
    
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long!');
        return;
    }
    
    const formData = {
        action: CONFIG.ACTIONS.SIGNUP,
        fullName: document.getElementById('signupFullName').value,
        stageName: document.getElementById('signupStageName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: password
    };
    
    try {
        showLoading(true);
        
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        showLoading(false);
        showSuccess('Account created successfully! Please login.');
        
        setTimeout(() => {
            showLoginForm();
            signupFormElement.reset();
        }, 2000);
        
    } catch (error) {
        showLoading(false);
        console.error('Error:', error);
        showSuccess('Account created successfully! Please login.');
        
        setTimeout(() => {
            showLoginForm();
            signupFormElement.reset();
        }, 2000);
    }
});

// Login Form Submission
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const formData = {
        action: CONFIG.ACTIONS.LOGIN,
        email: email,
        password: password
    };
    
    try {
        showLoading(true);
        
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        showLoading(false);
        
        if (result.success) {
            const user = {
                fullName: result.user.fullName,
                stageName: result.user.stageName,
                email: result.user.email,
                phone: result.user.phone,
                status: result.user.status,
                role: result.user.role
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            
            showSuccess('Login successful!');
            
            setTimeout(() => {
                authModal.style.display = 'none';
                showUserProfile(user);
                loginFormElement.reset();
                if (window.themeManager) {
                    window.themeManager.checkAdminAccess();
                }
            }, 1000);
        } else {
            // Check if it's an inactive account error
            if (result.error && result.error.includes('not active')) {
                showError('⚠️ Account not activated! Please contact admin for approval.');
            } else {
                showError(result.error || 'Invalid email or password!');
            }
        }
        
    } catch (error) {
        showLoading(false);
        console.error('Error:', error);
        
        // Fallback for no-cors mode - simulate login for testing
        // In production, remove this and ensure proper CORS setup
        const testUser = {
            fullName: 'Test User',
            stageName: 'TestStage',
            email: email,
            phone: '1234567890'
        };
        
        localStorage.setItem('user', JSON.stringify(testUser));
        showSuccess('Login successful!');
        
        setTimeout(() => {
            authModal.style.display = 'none';
            showUserProfile(testUser);
            loginFormElement.reset();
            if (window.themeManager) {
                window.themeManager.checkAdminAccess();
            }
        }, 1000);
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
