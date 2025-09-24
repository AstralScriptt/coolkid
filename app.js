// app.js - Advanced Registration/Login and Script Info System

// Initialize data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || null;
let changelogs = JSON.parse(localStorage.getItem('changelogs')) || [
    { id: 1, text: 'Initial script release - Full support for Arcade Basketball.', date: new Date().toISOString().split('T')[0] },
    { id: 2, text: 'Added Philly Streetz integration with enhanced aiming.', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
];
let scriptStatus = localStorage.getItem('scriptStatus') || 'active'; // 'active' or 'inactive'

// DOM Elements
const authModal = document.getElementById('authModal');
const scriptModal = document.getElementById('scriptModal');
const loginBtn = document.getElementById('loginBtn');
const scriptInfoBtn = document.getElementById('scriptInfoBtn');
const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('regForm');
const loginSubmit = document.getElementById('loginSubmit');
const regSubmit = document.getElementById('regSubmit');
const switchToReg = document.getElementById('switchToReg');
const switchToLogin = document.getElementById('switchToLogin');
const closeBtns = document.getElementsByClassName('close');
const changelogList = document.getElementById('changelogList');
const adminEdit = document.getElementById('adminEdit');
const editChangelog = document.getElementById('editChangelog');
const addChangelogBtn = document.getElementById('addChangelog');
const toggleStatusBtn = document.getElementById('toggleStatus');
const statusCircle = document.querySelector('.status-circle');
const statusText = document.getElementById('statusText');

// Event Listeners
loginBtn.addEventListener('click', () => authModal.style.display = 'block');
scriptInfoBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login to view script info.');
        authModal.style.display = 'block';
        return;
    }
    loadScriptInfo();
    scriptModal.style.display = 'block';
});

switchToReg.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
});

loginSubmit.addEventListener('click', loginUser);
regSubmit.addEventListener('click', registerUser);
addChangelogBtn.addEventListener('click', addChangelog);
toggleStatusBtn.addEventListener('click', toggleStatus);

Array.from(closeBtns).forEach(btn => btn.addEventListener('click', closeModals));
window.addEventListener('click', (e) => {
    if (e.target === authModal) closeModals();
    if (e.target === scriptModal) closeModals();
});

// Functions
function closeModals() {
    authModal.style.display = 'none';
    scriptModal.style.display = 'none';
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
}

function registerUser() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if (!username || !password) return alert('Please fill all fields.');
    if (users.find(u => u.username === username)) return alert('Username taken.');
    users.push({ username, password, isAdmin: username === 'jeff' && password === 'billy' });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registered! Please login.');
    closeModals();
}

function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return alert('Invalid credentials.');
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loginBtn.textContent = `Welcome, ${username}!`;
    closeModals();
    if (user.isAdmin) {
        adminEdit.style.display = 'block';
    }
}

function loadScriptInfo() {
    // Update status
    scriptStatus = localStorage.getItem('scriptStatus') || 'active';
    statusCircle.className = `status-circle ${scriptStatus === 'active' ? 'green' : 'red'}`;
    statusText.textContent = scriptStatus === 'active' ? 'Active & Updated' : 'Inactive - Maintenance';

    // Load changelogs
    changelogList.innerHTML = changelogs.map(log => 
        `<div class="changelog-entry">
            <strong>${log.date}:</strong> ${log.text}
        </div>`
    ).join('');
}

function addChangelog() {
    if (!currentUser || currentUser !== 'jeff') return;
    const text = editChangelog.value.trim();
    if (!text) return;
    const newLog = {
        id: Date.now(),
        text,
        date: new Date().toISOString().split('T')[0]
    };
    changelogs.unshift(newLog);
    localStorage.setItem('changelogs', JSON.stringify(changelogs));
    editChangelog.value = '';
    loadScriptInfo();
}

function toggleStatus() {
    if (!currentUser || currentUser !== 'jeff') return;
    scriptStatus = scriptStatus === 'active' ? 'inactive' : 'active';
    localStorage.setItem('scriptStatus', scriptStatus);
    loadScriptInfo();
}

// Init
if (currentUser) {
    loginBtn.textContent = `Welcome, ${currentUser}!`;
    const user = users.find(u => u.username === currentUser);
    if (user && user.isAdmin) {
        adminEdit.style.display = 'block';
    }
}
