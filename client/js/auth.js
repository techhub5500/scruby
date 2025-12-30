// ===========================
// AUTH.JS - Sistema de Autenticação
// ===========================

const AUTH_API_URL = 'http://localhost:3000/api/auth';
const TOKEN_KEY = 'scruby_auth_token';
const USER_KEY = 'scruby_user';

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// Save auth data
function saveAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear auth data
function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Verify token with server
async function verifyToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
        const response = await fetch(`${AUTH_API_URL}/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return true;
        } else {
            clearAuthData();
            return false;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}

// Register new user
async function register(name, email, password) {
    try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            saveAuthData(data.token, data.user);
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}

// Login user
async function login(email, password) {
    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            saveAuthData(data.token, data.user);
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}

// Logout user
async function logout() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            await fetch(`${AUTH_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearAuthData();
        window.location.href = '/html/index.html';
    }
}

// Protect page - redirect to login if not authenticated
async function protectPage() {
    const publicPages = ['/html/index.html', '/index.html', '/'];
    const currentPath = window.location.pathname;
    
    // Se está em página pública e está autenticado, redireciona para home
    if (publicPages.some(page => currentPath.endsWith(page) || currentPath === page)) {
        if (isAuthenticated()) {
            const valid = await verifyToken();
            if (valid) {
                window.location.href = '/html/home.html';
                return false;
            }
        }
        return true;
    }
    
    // Se não está autenticado, redireciona para index
    if (!isAuthenticated()) {
        window.location.href = '/html/index.html';
        return false;
    }
    
    // Verifica se o token é válido
    const valid = await verifyToken();
    if (!valid) {
        window.location.href = '/html/index.html';
        return false;
    }
    
    return true;
}

// Initialize auth modals
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (!loginModal || !registerModal) return;
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Entrando...';
            errorDiv.style.display = 'none';
            
            const result = await login(email, password);
            
            if (result.success) {
                window.location.href = '/html/home.html';
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar';
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const errorDiv = document.getElementById('register-error');
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            
            errorDiv.style.display = 'none';
            
            if (password !== confirmPassword) {
                errorDiv.textContent = 'As senhas não coincidem';
                errorDiv.style.display = 'block';
                return;
            }
            
            if (password.length < 6) {
                errorDiv.textContent = 'A senha deve ter no mínimo 6 caracteres';
                errorDiv.style.display = 'block';
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Cadastrando...';
            
            const result = await register(name, email, password);
            
            if (result.success) {
                window.location.href = '/html/home.html';
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Cadastrar';
            }
        });
    }
    
    // Show/hide modals
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
            registerModal.style.display = 'none';
        });
    }
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            registerModal.style.display = 'flex';
            loginModal.style.display = 'none';
        });
    }
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    
    // Close modals on overlay click
    [loginModal, registerModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
});

// Update user display
function updateUserDisplay() {
    const user = getCurrentUser();
    if (user) {
        const userNameElements = document.querySelectorAll('.user-display-name');
        userNameElements.forEach(el => {
            el.textContent = user.name;
        });
    }
}

// Show user profile modal
function showUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update modal content
    document.getElementById('user-profile-name').textContent = user.name;
    document.getElementById('user-profile-username').textContent = `@${user.username || 'username'}`;
    document.getElementById('user-profile-id').textContent = user.id;
    document.getElementById('user-profile-email').textContent = user.email;
    
    // Show modal
    const modal = document.getElementById('user-profile-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Hide user profile modal
function hideUserProfile() {
    const modal = document.getElementById('user-profile-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Add logout button listener
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // User icon click handler
    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', showUserProfile);
    }
    
    // Close modal when clicking outside
    const profileModal = document.getElementById('user-profile-modal');
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                hideUserProfile();
            }
        });
    }
});

// Call on page load for protected pages
if (window.location.pathname !== '/html/index.html' && !window.location.pathname.endsWith('/index.html')) {
    protectPage().then(isAllowed => {
        if (isAllowed) {
            updateUserDisplay();
        }
    });
}
