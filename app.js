// app.js - Enhanced System with Custom Notifications and Fixed Admin Login

// Initialize data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || null;
let changelogs = JSON.parse(localStorage.getItem('changelogs')) || [
    { id: 1, text: 'Nexus initialized: Full integration for Arcade Basketball with quantum aiming.', date: new Date().toISOString().split('T')[0] },
    { id: 2, text: 'Evolution v2.1: Philly Streetz now features adaptive street AI.', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { id: 3, text: 'Bronx Protocol activated: Enhanced urban combat modules deployed.', date: new Date(Date.now() - 172800000).toISOString().split('T')[0] }
];
let scriptStatus = localStorage.getItem('scriptStatus') || 'active';

// DOM Elements
const authModal = document.getElementById('authModal');
const scriptModal = document.getElementById('scriptModal');
const loginBtn = document.getElementById('loginBtn');
const scriptInfoBtn = document.getElementById('scriptInfoBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('regForm');
const loginSubmit = document.getElementById('loginSubmit');
const regSubmit = document.getElementById('regSubmit');
const switchToReg = document.getElementById('switchToReg');
const switchToLogin = document.getElementById('switchToLogin');
const closeBtns = document.getElementsByClassName('close');
const changelogList = document.getElementById('changelogList');
const adminPanel = document.getElementById('adminPanel');
const editChangelog = document.getElementById('editChangelog');
const addChangelogBtn = document.getElementById('addChangelog');
const toggleStatusBtn = document.getElementById('toggleStatus');
const statusCircle = document.getElementById('statusCircle');
const statusText = document.getElementById('statusText');
const modalTitle = document.getElementById('modalTitle');

// Event Listeners
loginBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Secure Login';
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
    authModal.style.display = 'block';
});

scriptInfoBtn.addEventListener('click', () => {
    if (!currentUser) {
        showNotification('Access denied. Secure your identity first.', 'error');
        loginBtn.click();
        return;
    }
    loadScriptInfo();
    scriptModal.style.display = 'block';
});

switchToReg.addEventListener('click', (e) => {
    e.preventDefault();
    modalTitle.textContent = 'Account Forging';
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    modalTitle.textContent = 'Secure Login';
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
});

loginSubmit.addEventListener('click', loginUser);
regSubmit.addEventListener('click', registerUser);
addChangelogBtn.addEventListener('click', addChangelog);
toggleStatusBtn.addEventListener('click', toggleStatus);
document.querySelector('.notification-close').addEventListener('click', hideNotification);

Array.from(closeBtns).forEach(btn => btn.addEventListener('click', closeModals));
window.addEventListener('click', (e) => {
    if (e.target === authModal || e.target === scriptModal) closeModals();
});

// Functions
function closeModals() {
    authModal.style.display = 'none';
    scriptModal.style.display = 'none';
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
    modalTitle.textContent = 'Secure Login';
}

function showNotification(message, type = 'info') {
    notificationText.textContent = message;
    notification.classList.add('error'); // Style based on type if needed
    notification.style.display = 'block';
    setTimeout(hideNotification, 4000);
}

function hideNotification() {
    notification.style.display = 'none';
    notification.classList.remove('error');
}

function registerUser() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if (!username || !password) {
        showNotification('All fields must be forged.', 'error');
        return;
    }
    if (users.find(u => u.username === username)) {
        showNotification('Identity already claimed.', 'error');
        return;
    }
    const isAdmin = username === 'jeff' && password === 'billy';
    users.push({ username, password, isAdmin });
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Account forged. Enter the realm.');
    closeModals();
}

function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) {
        showNotification('Credentials incomplete.', 'error');
        return;
    }

    // Special handling for admin: create if not exists
    if (username === 'jeff' && password === 'billy') {
        let adminUser = users.find(u => u.username === 'jeff');
        if (!adminUser) {
            adminUser = { username: 'jeff', password: 'billy', isAdmin: true };
            users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        showNotification('Invalid credentials. Try again.', 'error');
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loginBtn.textContent = `Welcome, ${username}`;
    loginBtn.style.background = '#8a2be2';
    showNotification(`Welcome back, ${username}!`, 'success');
    closeModals();
}

function loadScriptInfo() {
    scriptStatus = localStorage.getItem('scriptStatus') || 'active';
    statusCircle.className = `status-circle ${scriptStatus === 'active' ? 'green' : 'red'}`;
    statusText.textContent = scriptStatus === 'active' ? 'Operational' : 'In Eclipse';

    changelogList.innerHTML = changelogs.map(log => 
        `<div class="changelog-entry">
            <strong>${log.date}:</strong> ${log.text}
        </div>`
    ).join('');

    const user = users.find(u => u.username === currentUser);
    if (user && user.isAdmin) {
        adminPanel.style.display = 'block';
    } else {
        adminPanel.style.display = 'none';
    }
}

function addChangelog() {
    if (!currentUser || currentUser !== 'jeff') {
        showNotification('Admin access required.', 'error');
        return;
    }
    const text = editChangelog.value.trim();
    if (!text) {
        showNotification('Entry cannot be void.', 'error');
        return;
    }
    const newLog = {
        id: Date.now(),
        text,
        date: new Date().toISOString().split('T')[0]
    };
    changelogs.unshift(newLog);
    localStorage.setItem('changelogs', JSON.stringify(changelogs));
    editChangelog.value = '';
    loadScriptInfo();
    showNotification('Evolution inscribed.', 'success');
}

function toggleStatus() {
    if (!currentUser || currentUser !== 'jeff') {
        showNotification('Admin access required.', 'error');
        return;
    }
    scriptStatus = scriptStatus === 'active' ? 'inactive' : 'active';
    localStorage.setItem('scriptStatus', scriptStatus);
    loadScriptInfo();
    showNotification(`Core toggled to ${scriptStatus === 'active' ? 'Operational' : 'In Eclipse'}.`, 'success');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loginBtn.textContent = `Welcome, ${currentUser}`;
        loginBtn.style.background = '#8a2be2';
        const user = users.find(u => u.username === currentUser);
        if (user && user.isAdmin) {
            // Admin panel will show when modal opens
        }
    }

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
