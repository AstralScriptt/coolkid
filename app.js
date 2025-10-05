// app.js - Updated for Insights.lol, Da Hood Focus, Enhanced Animations, No Updates
// Initialize data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// DOM Elements
const authModal = document.getElementById('authModal');
const gamesModal = document.getElementById('gamesModal');
const communityModal = document.getElementById('communityModal');
const loginBtn = document.getElementById('loginBtn');
const gamesLink = document.getElementById('gamesLink');
const communityLink = document.getElementById('communityLink');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('regForm');
const loginSubmit = document.getElementById('loginSubmit');
const regSubmit = document.getElementById('regSubmit');
const switchToReg = document.getElementById('switchToReg');
const switchToLogin = document.getElementById('switchToLogin');
const closeBtns = document.getElementsByClassName('close');
const modalTitle = document.getElementById('modalTitle');
const mobileToggle = document.getElementById('mobileToggle');
const sidebar = document.getElementById('sidebar');

// Event Listeners
loginBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Log In';
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
    authModal.style.display = 'block';
});
gamesLink.addEventListener('click', (e) => {
    e.preventDefault();
    gamesModal.style.display = 'block';
});
communityLink.addEventListener('click', (e) => {
    e.preventDefault();
    communityModal.style.display = 'block';
});
switchToReg.addEventListener('click', (e) => {
    e.preventDefault();
    modalTitle.textContent = 'Sign Up';
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
});
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    modalTitle.textContent = 'Log In';
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
});
loginSubmit.addEventListener('click', loginUser);
regSubmit.addEventListener('click', registerUser);
document.querySelector('.notification-close').addEventListener('click', hideNotification);
Array.from(closeBtns).forEach(btn => btn.addEventListener('click', closeAllModals));
window.addEventListener('click', (e) => {
    if ([authModal, gamesModal, communityModal].includes(e.target)) closeAllModals();
});
// Mobile Toggle
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    mobileToggle.classList.toggle('active');
});

// Functions
function closeAllModals() {
    authModal.style.display = 'none';
    gamesModal.style.display = 'none';
    communityModal.style.display = 'none';
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
    modalTitle.textContent = 'Log In';
}
function showNotification(message, type = 'info') {
    notificationText.textContent = message;
    notification.style.display = 'block';
    setTimeout(hideNotification, 4000);
}
function hideNotification() {
    notification.style.display = 'none';
}
function registerUser() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if (!username || !password) {
        showNotification('Fill it out, no shortcuts.', 'error');
        return;
    }
    if (users.find(u => u.username === username)) {
        showNotification('Username locked, pick another.', 'error');
        return;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Account created – hit login.');
    closeAllModals();
}
function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) {
        showNotification('Username and pass required.', 'error');
        return;
    }
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        showNotification('Invalid creds – try again.', 'error');
        return;
    }
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loginBtn.textContent = `Yo, ${username}`;
    loginBtn.style.background = '#ff69b4';
    showNotification(`Welcome back, ${username}. Let's run it.`);
    closeAllModals();
}
// Init
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loginBtn.textContent = `Yo, ${currentUser}`;
        loginBtn.style.background = '#ff69b4';
    }
    // Nav active class
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.id !== 'gamesLink' && e.target.id !== 'communityLink') {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                // Close mobile menu
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
    // Enhanced particle animation on load
    setTimeout(() => {
        document.querySelectorAll('.particle').forEach((p, i) => {
            p.style.animationDelay = `${i * 0.2}s`; // Faster delays for crazier effect
        });
    }, 200);
});
