// app.js - Updated with Popups, Remove Func, Natural Text

// Initialize data - Updated dates for 2025
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || null;
let changelogs = JSON.parse(localStorage.getItem('changelogs')) || [
    { id: 1, text: 'Kicked off with full Arcade Basketball support – auto-aim feels buttery now.', date: '2025-09-01' },
    { id: 2, text: 'Philly Streetz got a bump: better combo chaining, no more drops.', date: '2025-09-10' },
    { id: 3, text: 'Tha Bronx 3 lockdown mode tuned – spots enemies quicker.', date: '2025-09-20' }
];
let scriptStatus = localStorage.getItem('scriptStatus') || 'active';

// DOM Elements
const authModal = document.getElementById('authModal');
const gamesModal = document.getElementById('gamesModal');
const communityModal = document.getElementById('communityModal');
const scriptModal = document.getElementById('scriptModal');
const loginBtn = document.getElementById('loginBtn');
const scriptInfoBtn = document.getElementById('scriptInfoBtn');
const gamesLink = document.getElementById('gamesLink');
const communityLink = document.getElementById('communityLink');
const exploreGames = document.getElementById('exploreGames');
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
    modalTitle.textContent = 'Log In';
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
    authModal.style.display = 'block';
});

scriptInfoBtn.addEventListener('click', () => {
    if (!currentUser) {
        showNotification('Gotta log in first, chief.', 'error');
        loginBtn.click();
        return;
    }
    loadScriptInfo();
    scriptModal.style.display = 'block';
});

gamesLink.addEventListener('click', (e) => {
    e.preventDefault();
    gamesModal.style.display = 'block';
});

communityLink.addEventListener('click', (e) => {
    e.preventDefault();
    communityModal.style.display = 'block';
});

exploreGames.addEventListener('click', (e) => {
    e.preventDefault();
    gamesModal.style.display = 'block';
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
addChangelogBtn.addEventListener('click', addChangelog);
toggleStatusBtn.addEventListener('click', toggleStatus);
document.querySelector('.notification-close').addEventListener('click', hideNotification);

Array.from(closeBtns).forEach(btn => btn.addEventListener('click', closeAllModals));
window.addEventListener('click', (e) => {
    if ([authModal, gamesModal, communityModal, scriptModal].includes(e.target)) closeAllModals();
});

// Functions
function closeAllModals() {
    authModal.style.display = 'none';
    gamesModal.style.display = 'none';
    communityModal.style.display = 'none';
    scriptModal.style.display = 'none';
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
        showNotification('Fill in the blanks, yeah?', 'error');
        return;
    }
    if (users.find(u => u.username === username)) {
        showNotification('Handle\'s taken, try another.', 'error');
        return;
    }
    const isAdmin = username === 'jeff' && password === 'billy';
    users.push({ username, password, isAdmin });
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('All set – now log in.');
    closeAllModals();
}

function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) {
        showNotification('Missing something there.', 'error');
        return;
    }

    // Admin auto-create
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
        showNotification('Nah, that ain\'t right. Double-check.', 'error');
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loginBtn.textContent = `Hey, ${username}`;
    loginBtn.style.background = '#8a2be2';
    showNotification(`Yo ${username}, good to see ya.`);
    closeAllModals();
}

function loadScriptInfo() {
    scriptStatus = localStorage.getItem('scriptStatus') || 'active';
    statusCircle.className = `status-circle ${scriptStatus === 'active' ? 'green' : 'red'}`;
    statusText.textContent = scriptStatus === 'active' ? 'Working' : 'Non Working';

    changelogList.innerHTML = changelogs.map(log => 
        `<div class="changelog-entry">
            <div class="changelog-text">
                <strong>${log.date}:</strong> ${log.text}
            </div>
            <button class="delete-btn" data-id="${log.id}">&times;</button>
        </div>`
    ).join('');

    // Add delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!currentUser || currentUser !== 'jeff') {
                showNotification('Only the boss can do that.', 'error');
                return;
            }
            const id = parseInt(e.target.dataset.id);
            changelogs = changelogs.filter(log => log.id !== id);
            localStorage.setItem('changelogs', JSON.stringify(changelogs));
            loadScriptInfo();
            showNotification('Wiped that note.');
        });
    });

    const user = users.find(u => u.username === currentUser);
    if (user && user.isAdmin) {
        adminPanel.style.display = 'block';
    } else {
        adminPanel.style.display = 'none';
    }
}

function addChangelog() {
    if (!currentUser || currentUser !== 'jeff') {
        showNotification('Boss moves only.', 'error');
        return;
    }
    const text = editChangelog.value.trim();
    if (!text) {
        showNotification('Can\'t add nothing.', 'error');
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
    showNotification('Note added.');
}

function toggleStatus() {
    if (!currentUser || currentUser !== 'jeff') {
        showNotification('Boss moves only.', 'error');
        return;
    }
    scriptStatus = scriptStatus === 'active' ? 'inactive' : 'active';
    localStorage.setItem('scriptStatus', scriptStatus);
    loadScriptInfo();
    showNotification(`Status flipped to ${scriptStatus === 'active' ? 'Working' : 'Non Working'}.`);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loginBtn.textContent = `Hey, ${currentUser}`;
        loginBtn.style.background = '#8a2be2';
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
            }
        });
    });
});
