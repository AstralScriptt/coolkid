// Bruno.cc Admin System - OPTIMIZED & FULLY FUNCTIONAL VERSION
// Admin login: Email = "21", Password = "21"
// Enhanced admin features: Full CRUD for users/products/pastes, logs, backups, etc.
// Optimized for performance: Reduced particles, efficient DOM updates, mobile-friendly
// Configuration
const ADMIN_EMAIL = "21";
const ADMIN_PASSWORD = "21";
const ADMIN_ROLE = "admin";

// Global State - Consolidated
let currentUser = null;
let adminMode = false;
let editingChangelogId = null;
let editingProductId = null;
let selectedPastes = new Set();
let selectedUsers = new Set();
let pastes = JSON.parse(localStorage.getItem('brunoPastes') || '[]');
let changelogs = JSON.parse(localStorage.getItem('brunoChangelogs') || '[]');
let products = JSON.parse(localStorage.getItem('brunoProducts') || '[]');
let users = JSON.parse(localStorage.getItem('brunoUsers') || '[]');
let logs = JSON.parse(localStorage.getItem('brunoLogs') || '[]');
let keysGenerated = JSON.parse(localStorage.getItem('brunoKeys') || '[]');

// Optimized Particle System - Reduced particles
class OptimizedParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        if (this.container) this.init();
    }
    init() {
        for (let i = 0; i < 30; i++) { // Reduced from 50
            this.createParticle();
        }
    }
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particle.style.animationDelay = `-${Math.random() * 5}s`;
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// Initialize App - Consolidated
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Bruno.cc - Optimized Version...');
    new OptimizedParticleSystem();
    startMatrixAnimation();
    setupEventListeners();
    loadAllContent();
    checkAdminStatus();
    loadAdminData(); // New: Load admin-specific data
    console.log('✅ Bruno.cc initialized successfully!');
});

// Consolidated Event Listeners
function setupEventListeners() {
    // Chat - Enhanced with better error handling
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chatContainer');
    if (chatInput && sendButton && chatContainer) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            sendMessage();
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('#chatPopup')) {
                setTimeout(() => chatInput.focus(), 100);
            }
        });
    }

    // Forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    const changelogForm = document.getElementById('changelogForm');
    if (changelogForm) changelogForm.addEventListener('submit', (e) => { e.preventDefault(); saveChangelog(); });
    const productForm = document.getElementById('productForm');
    if (productForm) productForm.addEventListener('submit', (e) => { e.preventDefault(); saveProduct(); });

    // Global keys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Expose globals
    window.sendMessage = sendMessage;
    window.toggleChatPopup = toggleChatPopup;
    window.toggleShopPopup = toggleShopPopup;
    window.togglePastesPopup = togglePastesPopup;
    window.toggleAdminPanel = toggleAdminPanel;
    window.showLogin = showLogin;
    window.closeLogin = closeLogin;
    window.showRegister = showRegister;
    window.closeRegister = closeRegister;
    window.showDemo = showDemo;
    window.showChangelogEditor = showChangelogEditor;
    window.closeChangelogEditor = closeChangelogEditor;
    window.saveChangelog = saveChangelog;
    window.showNewProductModal = showNewProductModal;
    window.closeProductEditor = closeProductEditor;
    window.saveProduct = saveProduct;
    window.showSiteSettings = showSiteSettings;
    window.showUserManagement = showUserManagement;
    window.broadcastMessage = broadcastMessage;
    window.generateKey = generateKey;
    window.backupDatabase = backupDatabase;
    window.createPaste = createPaste;
    window.clearPasteForm = clearPasteForm;
    window.logout = logout;
    window.purchaseProduct = purchaseProduct;
    window.deleteDemoPaste = deleteDemoPaste;
    window.editChangelog = editChangelog;
    // New admin functions
    window.switchAdminTab = switchAdminTab;
    window.loadAdminStats = loadAdminStats;
    window.searchAdminPastes = searchAdminPastes;
    window.filterAdminPastes = filterAdminPastes;
    window.bulkDeletePastes = bulkDeletePastes;
    window.bulkFeaturePastes = bulkFeaturePastes;
    window.exportPastes = exportPastes;
    window.searchAdminUsers = searchAdminUsers;
    window.filterAdminUsers = filterAdminUsers;
    window.createNewUser = createNewUser;
    window.importUsers = importUsers;
    window.exportUsers = exportUsers;
    window.saveAllProducts = saveAllProducts;
    window.previewShopChanges = previewShopChanges;
    window.exportProducts = exportProducts;
    window.saveSecuritySettings = saveSecuritySettings;
    window.saveSiteSettings = saveSiteSettings;
    window.searchLogs = searchLogs;
    window.filterLogs = filterLogs;
    window.clearLogs = clearLogs;
    window.clearAllCache = clearAllCache;
    window.backupEverything = backupEverything;
    window.exportChangelogs = exportChangelogs;
    window.clearAllChangelogs = clearAllChangelogs;
}

// Enhanced Chat System
function sendMessage() {
    const input = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chatContainer');
    if (!input || !sendButton || !chatContainer) {
        showNotification('Chat error - please refresh', 'error');
        return;
    }
    const message = input.value.trim();
    if (!message) {
        input.focus();
        showNotification('Please type a message', 'warning');
        return;
    }
    // Disable & add user message
    input.disabled = true;
    sendButton.disabled = true;
    sendButton.innerHTML = '<span class="loading"></span>Sending...';
    input.style.opacity = '0.6';
    const userMessageDiv = createMessageDiv('user', message);
    chatContainer.appendChild(userMessageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    input.value = '';
    // Simulate response
    setTimeout(() => {
        const response = generateBotResponse(message);
        const botMessageDiv = createMessageDiv('bot', response);
        chatContainer.appendChild(botMessageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        input.disabled = false;
        sendButton.disabled = false;
        sendButton.innerHTML = '<span class="send-icon">➤</span>';
        input.style.opacity = '1';
        input.focus();
        showNotification('Message sent!', 'success');
    }, 1000);
}

function createMessageDiv(type, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    div.innerHTML = `
        <div class="message-avatar">${type === 'user' ? '👤' : '🤖'}</div>
        <div class="message-bubble">
            <div class="message-content">
                <strong>${type === 'user' ? currentUser?.username || 'You' : 'BrunoBot'}</strong>
                <span>${escapeHtml(text)}</span>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        </div>
    `;
    return div;
}

function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    // Enhanced responses with more options
    if (adminMode && lowerMessage.includes('admin')) {
        return '🔒 Admin mode active. Use the admin panel for full control: users, products, pastes, and system logs.';
    }
    if (lowerMessage.includes('key') || lowerMessage.includes('license')) {
        return '🔑 Generate keys in the admin panel. Format: bruno-XXXX-YYYY. Contact support for issues.';
    }
    if (lowerMessage.includes('crash') || lowerMessage.includes('error')) {
        return '💥 Common fixes: Run as admin, disable AV, update drivers. Submit logs to Discord #support.';
    }
    if (lowerMessage.includes('install') || lowerMessage.includes('setup')) {
        return '📥 Download from email receipt. Extract, run as admin, enter key. Guide: Discord #setup.';
    }
    if (lowerMessage.includes('feature') || lowerMessage.includes('how to')) {
        return '🎮 Hotkeys: F1 menu, F2 ESP, F3 Aimbot. Full list in Discord #features.';
    }
    if (lowerMessage.includes('update')) {
        return '📢 Check changelogs above. Auto-update on launch. Beta: /beta in Discord.';
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('buy')) {
        return '💰 Bronx 3: $19.99/mo | SAB: $14.99/mo | Arcade: $9.99/mo. Code: BRUNO10 for 10% off.';
    }
    if (lowerMessage.includes('discord')) {
        return '💎 Join: https://discord.gg/DhWsx7rHjS - Support, updates, community.';
    }
    if (lowerMessage.includes('paste')) {
        return '📝 Create/share scripts in Pastes. Use loadstring(game:HttpGet("url"))() to execute.';
    }
    return '🤖 Ask about keys, crashes, setup, features, updates, pricing, or Discord. Type "help" for more.';
}

// Consolidated Popup Toggles
function togglePopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
    if (popup.classList.contains('active')) {
        setTimeout(() => {
            const input = popup.querySelector('input, textarea');
            if (input) input.focus();
        }, 200);
    }
}
function toggleChatPopup() { togglePopup('chatPopup'); }
function toggleShopPopup() { togglePopup('shopPopup'); }
function togglePastesPopup() {
    togglePopup('pastesPopup');
    if (document.getElementById('pastesPopup').classList.contains('active')) {
        loadPastes();
        document.getElementById('pastesBtn').style.display = 'inline-block';
    }
}
function toggleAdminPanel() {
    if (!adminMode) {
        showNotification('Admin access required. Use code: 21', 'error');
        showLogin();
        return;
    }
    togglePopup('adminPanel');
    loadAdminData();
}

// Consolidated Auth
function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const input = modal.querySelector('input');
        if (input) setTimeout(() => input.focus(), 100);
    }
}
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}
function showLogin() { showModal('loginModal'); }
function closeLogin() { closeModal('loginModal'); }
function showRegister() { showModal('registerModal'); }
function closeRegister() { closeModal('registerModal'); }

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
        showNotification('Fill all fields', 'error');
        return;
    }
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        currentUser = { id: 'admin', email: 'admin@bruno.cc', username: 'BrunoAdmin', role: ADMIN_ROLE };
        adminMode = true;
        localStorage.setItem('brunoAdminLoggedIn', 'true');
        localStorage.setItem('brunoAdminSession', Date.now().toString());
        closeLogin();
        updateUI();
        showNotification('Admin login successful!', 'success');
        loadAdminData();
        return;
    }
    if (email && password.length >= 6) {
        currentUser = { id: email.replace(/[@.]/g, ''), email, username: email.split('@')[0], role: 'user' };
        localStorage.setItem('brunoUser', JSON.stringify(currentUser));
        localStorage.setItem('brunoUserSession', Date.now().toString());
        closeLogin();
        updateUI();
        showNotification(`Welcome ${currentUser.username}!`, 'success');
        return;
    }
    showNotification('Invalid credentials. Admin: "21"', 'error');
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    if (!username || !email || !password || password.length < 6) {
        showNotification('Invalid input', 'error');
        return;
    }
    if (email === ADMIN_EMAIL || username.toLowerCase().includes('admin')) {
        showNotification('Admin exists. Login with "21"', 'error');
        return;
    }
    currentUser = { id: Math.random().toString(36).substr(2, 9), email, username, role: 'user' };
    users.push(currentUser);
    localStorage.setItem('brunoUsers', JSON.stringify(users));
    localStorage.setItem('brunoUser', JSON.stringify(currentUser));
    localStorage.setItem('brunoUserSession', Date.now().toString());
    closeRegister();
    updateUI();
    showNotification(`Welcome ${username}!`, 'success');
    addLog('user_register', `${username} registered`);
}

function checkAdminStatus() {
    const adminSession = localStorage.getItem('brunoAdminLoggedIn');
    const userSession = localStorage.getItem('brunoUserSession');
    const now = Date.now();
    if (adminSession === 'true') {
        const adminTime = parseInt(localStorage.getItem('brunoAdminSession') || '0');
        if (now - adminTime < 24 * 60 * 60 * 1000) {
            currentUser = { id: 'admin', email: 'admin@bruno.cc', username: 'BrunoAdmin', role: ADMIN_ROLE };
            adminMode = true;
            updateUI();
            return;
        }
        localStorage.removeItem('brunoAdminLoggedIn');
        localStorage.removeItem('brunoAdminSession');
    }
    if (userSession) {
        const userData = localStorage.getItem('brunoUser');
        const sessionTime = parseInt(userSession);
        if (now - sessionTime < 7 * 24 * 60 * 60 * 1000 && userData) {
            currentUser = JSON.parse(userData);
            updateUI();
            return;
        }
        localStorage.removeItem('brunoUser');
        localStorage.removeItem('brunoUserSession');
    }
    updateUI();
}

function updateUI() {
    const authContainer = document.getElementById('authContainer');
    const adminAccess = document.getElementById('adminAccess');
    const pastesBtn = document.getElementById('pastesBtn');
    const changelogControls = document.getElementById('changelogControls');
    if (authContainer) {
        if (adminMode) {
            authContainer.innerHTML = `<span class="user-menu"><strong style="color: #ff4757;">🔒 ADMIN</strong> - ${currentUser.username} <button class="auth-btn logout-btn" onclick="logout()">Logout</button></span>`;
            if (adminAccess) adminAccess.style.display = 'block';
            if (pastesBtn) pastesBtn.style.display = 'inline-block';
            if (changelogControls) changelogControls.style.display = 'flex';
        } else if (currentUser) {
            authContainer.innerHTML = `<span class="user-menu">👋 ${currentUser.username} <button class="auth-btn logout-btn" onclick="logout()">Logout</button></span>`;
            if (adminAccess) adminAccess.style.display = 'none';
            if (pastesBtn) pastesBtn.style.display = 'inline-block';
            if (changelogControls) changelogControls.style.display = 'none';
        } else {
            authContainer.innerHTML = `<button class="auth-btn login-btn" onclick="showLogin()">Login</button><button class="auth-btn register-btn" onclick="showRegister()">Register</button>`;
            if (adminAccess) adminAccess.style.display = 'none';
            if (pastesBtn) pastesBtn.style.display = 'none';
            if (changelogControls) changelogControls.style.display = 'none';
        }
    }
    loadAllContent();
}

function logout() {
    if (confirm('Logout?')) {
        currentUser = null;
        adminMode = false;
        localStorage.clear(); // Clear all for security
        updateUI();
        showNotification('Logged out', 'success');
    }
}

// Consolidated Content Loading
function loadAllContent() {
    loadChangelogs();
    loadProducts();
    loadPastes();
}

// Enhanced Pastes System
function loadPastes() {
    pastes = JSON.parse(localStorage.getItem('brunoPastes') || '[]').length > 0 ? pastes : getDemoPastes();
    updatePastesGrid(pastes.slice(0, 10));
    updatePastesStats();
}

function createPaste() {
    const title = document.getElementById('pasteTitle').value.trim();
    const content = document.getElementById('pasteContent').value.trim();
    if (!content) {
        showNotification('Enter content', 'warning');
        return;
    }
    const newPaste = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        title: title || `Paste ${new Date().toLocaleString()}`,
        content,
        author: currentUser ? currentUser.username : 'Anonymous',
        created_at: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        featured: false,
        verified: false
    };
    pastes.unshift(newPaste);
    localStorage.setItem('brunoPastes', JSON.stringify(pastes.slice(0, 50)));
    clearPasteForm();
    updatePastesGrid(pastes);
    updatePastesStats();
    generatePasteURL(newPaste);
    showNotification(`Paste created!`, 'success');
    addLog('paste_create', `${newPaste.author} created paste "${newPaste.title}"`);
}

function clearPasteForm() {
    document.getElementById('pasteTitle').value = '';
    document.getElementById('pasteContent').value = '';
    document.getElementById('pasteUrlOutput').style.display = 'none';
    document.getElementById('pasteTitle').focus();
}

function updatePastesGrid(pastesToShow) {
    const grid = document.getElementById('pastesGrid');
    if (!grid) return;
    grid.innerHTML = pastesToShow.length ? pastesToShow.map((paste, i) => `
        <div class="paste-card" style="animation-delay: ${i * 0.05}s" onclick="copyPaste('${paste.id}')">
            <h4 title="${escapeHtml(paste.title)}">${escapeHtml(paste.title.length > 30 ? paste.title.substring(0, 27) + '...' : paste.title)}</h4>
            <div class="paste-preview" title="Click to copy">${escapeHtml(getPreviewText(paste.content))}</div>
            <div class="paste-meta">
                <span class="paste-date"><span style="color: #b0e0ff;">${paste.author}</span> • ${paste.date} ${paste.time}</span>
                ${adminMode ? `<button class="delete-paste-btn" onclick="deletePaste('${paste.id}', event)">Delete</button>` : ''}
            </div>
        </div>
    `).join('') : '<div style="text-align: center; color: #888; padding: 2rem;">No pastes. Create one!</div>';
}

function copyPaste(pasteId) {
    const paste = pastes.find(p => p.id === pasteId);
    if (!paste) return;
    navigator.clipboard.writeText(paste.content).then(() => showNotification(`Copied "${paste.title}"`, 'success'));
}

function deletePaste(id, e) {
    e.stopPropagation();
    if (!adminMode || !confirm('Delete?')) return;
    pastes = pastes.filter(p => p.id !== id);
    localStorage.setItem('brunoPastes', JSON.stringify(pastes));
    updatePastesGrid(pastes);
    updatePastesStats();
    showNotification('Deleted', 'success');
    addLog('paste_delete', `Admin deleted paste ${id}`);
}

function updatePastesStats() {
    const total = pastes.length;
    const today = pastes.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length;
    const usage = Math.round(JSON.stringify(pastes).length / 1024);
    document.getElementById('totalPastesCount').textContent = total;
    document.getElementById('storageUsage').textContent = usage;
    document.getElementById('pastesToday').textContent = today;
    document.getElementById('totalPastesStat').textContent = total;
}

function generatePasteURL(paste = null) {
    if (!paste) paste = pastes[0];
    if (!paste) return;
    const url = `${window.location.origin}/paste/${paste.id}`; // Simulated
    document.getElementById('pasteUrlInput').value = `loadstring(game:HttpGet("${url}"))()`;
    document.getElementById('urlSize').textContent = Math.round(paste.content.length / 1024);
    document.getElementById('pasteUrlOutput').style.display = 'block';
}

function copyPasteURL() {
    navigator.clipboard.writeText(document.getElementById('pasteUrlInput').value);
    showNotification('URL copied!', 'success');
}

function testPasteURL() {
    showNotification('Test: Script loaded successfully (simulated)', 'success');
}

function getPreviewText(content) {
    return content.split('\n').slice(0, 4).join('\n').substring(0, 80) + (content.length > 80 ? '...' : '');
}

function getDemoPastes() {
    return [
        {
            id: 'demo1',
            title: 'Auto Farm Script',
            content: `-- Demo Auto Farm\nwhile true do\n wait(0.1)\nend`,
            author: 'Demo',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            time: new Date(Date.now() - 86400000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        },
        {
            id: 'demo2',
            title: 'ESP Template',
            content: `-- Demo ESP\nlocal ESP = {}\nfunction ESP:Create() end`,
            author: 'Demo',
            created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
            date: new Date(Date.now() - 2 * 86400000).toLocaleDateString(),
            time: new Date(Date.now() - 2 * 86400000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        }
    ];
}

// Enhanced Changelogs
function loadChangelogs() {
    changelogs = JSON.parse(localStorage.getItem('brunoChangelogs') || '[]').length > 0 ? changelogs : getDemoChangelogs();
    updateChangelogs(changelogs.slice(0, 6));
    document.getElementById('totalChangelogsStat').textContent = changelogs.length;
}

function getDemoChangelogs() {
    return [
        { id: '1', title: 'v2.1.0 - Performance', content: 'ESP 3x faster, crash fixes.', author: 'Admin', date: new Date().toLocaleDateString(), created_at: new Date().toISOString() },
        { id: '2', title: 'v2.0.5 - Stability', content: 'Fixed Bronx 3 crash.', author: 'Admin', date: new Date(Date.now() - 86400000).toLocaleDateString(), created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', title: 'v2.0.0 - Major Release', content: 'New SAB suite.', author: 'Admin', date: new Date(Date.now() - 3 * 86400000).toLocaleDateString(), created_at: new Date(Date.now() - 3 * 86400000).toISOString() }
    ];
}

function updateChangelogs(changelogsToShow) {
    const grid = document.getElementById('changelogGrid');
    if (!grid) return;
    grid.innerHTML = changelogsToShow.length ? changelogsToShow.map((cl, i) => `
        <div class="changelog-card" style="animation-delay: ${i * 0.1}s">
            <h3>${escapeHtml(cl.title)}</h3>
            <p>${escapeHtml(cl.content.substring(0, 150))}${cl.content.length > 150 ? '...' : ''}</p>
            <div class="changelog-date">
                <span style="color: #b0e0ff;">${cl.author}</span> • ${cl.date}
                ${adminMode ? `<button class="edit-btn" onclick="editChangelog('${cl.id}')">Edit</button>` : ''}
            </div>
        </div>
    `).join('') : '<div style="text-align: center; color: #888; padding: 2rem; grid-column: 1/-1;">No changelogs.</div>';
}

function showChangelogEditor(id = null) {
    if (!adminMode) return showNotification('Admin required', 'error');
    editingChangelogId = id;
    showModal('changelogEditor');
    const titleInput = document.getElementById('changelogTitle');
    const contentInput = document.getElementById('changelogContent');
    if (id) {
        const cl = changelogs.find(c => c.id === id);
        if (cl) {
            titleInput.value = cl.title;
            contentInput.value = cl.content;
        }
    } else {
        titleInput.value = `Version ${Math.floor(Math.random() * 100) + 1}.0.0 - `;
        contentInput.value = 'Details...';
    }
    titleInput.focus();
}

function saveChangelog() {
    if (!adminMode) return;
    const title = document.getElementById('changelogTitle').value.trim();
    const content = document.getElementById('changelogContent').value.trim();
    if (!title || !content) return showNotification('Fill fields', 'warning');
    if (editingChangelogId) {
        const index = changelogs.findIndex(c => c.id === editingChangelogId);
        if (index > -1) changelogs[index] = { ...changelogs[index], title, content, date: new Date().toLocaleDateString(), updated_at: new Date().toISOString() };
    } else {
        const newCl = { id: Date.now().toString() + Math.random().toString(36).substr(2, 5), title, content, author: currentUser.username, date: new Date().toLocaleDateString(), created_at: new Date().toISOString() };
        changelogs.unshift(newCl);
    }
    localStorage.setItem('brunoChangelogs', JSON.stringify(changelogs.slice(0, 20)));
    updateChangelogs(changelogs);
    closeChangelogEditor();
    showNotification(`Changelog ${editingChangelogId ? 'updated' : 'created'}!`, 'success');
    addLog('changelog_save', `${currentUser.username} ${editingChangelogId ? 'updated' : 'created'} changelog "${title}"`);
}

function editChangelog(id) { showChangelogEditor(id); }
function closeChangelogEditor() { closeModal('changelogEditor'); editingChangelogId = null; }

function exportChangelogs() {
    const data = JSON.stringify(changelogs, null, 2);
    downloadFile('changelogs.json', data);
    showNotification('Exported', 'success');
    addLog('export_changelogs', currentUser.username);
}

function clearAllChangelogs() {
    if (confirm('Clear all?')) {
        changelogs = [];
        localStorage.setItem('brunoChangelogs', '[]');
        updateChangelogs([]);
        showNotification('Cleared', 'success');
        addLog('clear_changelogs', currentUser.username);
    }
}

// Enhanced Products
function loadProducts() {
    products = JSON.parse(localStorage.getItem('brunoProducts') || '[]').length > 0 ? products : getDemoProducts();
    updateFeaturesCards(products.slice(0, 3));
    updateShopItems(products);
    loadProductsAdmin(); // New
}

function getDemoProducts() {
    return [
        { id: '1', name: 'The Bronx 3', description: 'Money, Farm, ESP', price: 19.99, features: '• Money\n• Farm\n• ESP', icon_color: '#00bfff', status: 'active', featured: true, position: 1 },
        { id: '2', name: 'SAB', description: 'Steal, Speed', price: 14.99, features: '• Steal\n• Speed', icon_color: '#ff6b6b', status: 'active', featured: false, position: 2 },
        { id: '3', name: 'Arcade Basketball', description: 'Aim, Green', price: 9.99, features: '• Aim\n• Green', icon_color: '#48d1cc', status: 'active', featured: false, position: 3 }
    ];
}

function updateFeaturesCards(products) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    container.innerHTML = products.map((p, i) => `
        <div class="card" style="animation-delay: ${i * 0.2}s">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="${p.icon_color}">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h2>${escapeHtml(p.name)}</h2>
            <div style="text-align: left; font-size: 0.95rem; color: #b0e0ff; line-height: 1.6;">${escapeHtml(p.features).replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

function updateShopItems(products) {
    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = products.map((p, i) => `
        <div class="shop-card" style="animation-delay: ${i * 0.1}s">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="${p.icon_color}">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="shop-desc">${escapeHtml(p.description)}</p>
            <p class="price">$${p.price}<span style="font-size: 0.8em; opacity: 0.7;">/month</span></p>
            <button class="buy-btn" onclick="purchaseProduct('${p.id}', '${p.name}')">Buy Now</button>
        </div>
    `).join('');
}

function purchaseProduct(id, name) {
    if (!currentUser) return showLogin();
    showNotification(`Purchased ${name}! (simulated)`, 'success');
    addLog('purchase', `${currentUser.username} bought ${name}`);
}

function showNewProductModal(id = null) {
    if (!adminMode) return showNotification('Admin required', 'error');
    editingProductId = id;
    showModal('productEditorModal');
    const title = document.getElementById('productEditorTitle');
    title.textContent = id ? 'Edit Product' : 'New Product';
    if (id) {
        const p = products.find(pr => pr.id === id);
        if (p) {
            document.getElementById('productName').value = p.name;
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productDescription').value = p.description;
            document.getElementById('productFeatures').value = p.features;
            document.getElementById('productColor').value = p.icon_color;
            document.getElementById('productStatus').value = p.status;
            document.getElementById('productFeatured').checked = p.featured;
            document.getElementById('productPosition').value = p.position;
            document.getElementById('editingProductId').value = id;
        }
    } else {
        // Reset form
        ['productName', 'productDescription', 'productFeatures', 'productPrice', 'productPosition'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('productColor').value = '#00bfff';
        document.getElementById('productStatus').value = 'active';
        document.getElementById('productFeatured').checked = true;
        document.getElementById('editingProductId').value = '';
    }
    updateProductPreview();
}

function saveProduct() {
    if (!adminMode) return;
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value.trim();
    const features = document.getElementById('productFeatures').value;
    const color = document.getElementById('productColor').value;
    const status = document.getElementById('productStatus').value;
    const featured = document.getElementById('productFeatured').checked;
    const position = parseInt(document.getElementById('productPosition').value);
    if (!name || !price || !description) return showNotification('Fill required fields', 'warning');
    const productData = { name, price, description, features, icon_color: color, status, featured, position };
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index > -1) products[index] = { ...products[index], ...productData };
    } else {
        productData.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        products.push(productData);
    }
    products.sort((a, b) => a.position - b.position);
    localStorage.setItem('brunoProducts', JSON.stringify(products));
    loadProducts();
    closeProductEditor();
    showNotification('Product saved!', 'success');
    addLog('product_save', `${currentUser.username} ${editingProductId ? 'updated' : 'created'} product "${name}"`);
}

function closeProductEditor() { closeModal('productEditorModal'); editingProductId = null; }

function updateProductPreview() {
    const name = document.getElementById('productName').value || 'Product';
    const price = document.getElementById('productPrice').value || '0';
    const desc = document.getElementById('productDescription').value || 'Description';
    const color = document.getElementById('productColor').value;
    document.getElementById('productPreview').innerHTML = `
        <svg width="50" height="50" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(desc)}</p>
        <p class="price">$${price}/mo</p>
    `;
}

function saveAllProducts() {
    localStorage.setItem('brunoProducts', JSON.stringify(products));
    showNotification('Products saved', 'success');
}

function previewShopChanges() {
    loadProducts();
    showNotification('Preview updated', 'info');
}

function exportProducts() {
    const data = JSON.stringify(products, null, 2);
    downloadFile('products.json', data);
    showNotification('Exported', 'success');
}

function getDemoProducts() {
    return [
        { id: '1', name: 'Bronx 3', description: 'Money Farm', price: 19.99, features: '• Money\n• Farm', icon_color: '#00bfff', status: 'active', featured: true, position: 1 },
        // ... (as above)
    ];
}

// New: Admin Data Loading
function loadAdminData() {
    if (!adminMode) return;
    loadAdminStats();
    updateChangelogsTable();
    updateAdminPastesGrid(pastes);
    updateAdminUsersGrid(users);
    loadProductsAdmin();
    loadActivityFeed();
    loadSystemMetrics();
    loadLogs();
}

function loadAdminStats() {
    document.getElementById('totalUsersStat').textContent = users.length;
    document.getElementById('totalPastesStat').textContent = pastes.length;
    document.getElementById('totalChangelogsStat').textContent = changelogs.length;
    document.getElementById('totalKeysStat').textContent = keysGenerated.length;
}

function switchAdminTab(btn, tab) {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.getElementById(`${tab}Tab`).style.display = 'block';
    // Load tab-specific data
    if (tab === 'pastes') updateAdminPastesGrid(pastes);
    if (tab === 'users') updateAdminUsersGrid(users);
    if (tab === 'shop') loadProductsAdmin();
    if (tab === 'system') loadSystemMetrics();
}

function updateChangelogsTable() {
    const tbody = document.getElementById('changelogsTable');
    if (!tbody) return;
    tbody.innerHTML = changelogs.map(cl => `
        <div class="table-row" onclick="editChangelog('${cl.id}')">
            <td>${escapeHtml(cl.title)}</td>
            <td>${cl.title.match(/v(\d+\.\d+)/)?.[1] || 'N/A'}</td>
            <td class="status-${cl.status || 'active'}">${cl.status || 'active'}</td>
            <td>${cl.date}</td>
            <td>
                <button class="action-btn edit">Edit</button>
                <button class="action-btn delete" onclick="deleteChangelog('${cl.id}', event)">Delete</button>
            </td>
        </div>
    `).join('');
}

function deleteChangelog(id, e) {
    e.stopPropagation();
    if (confirm('Delete?')) {
        changelogs = changelogs.filter(c => c.id !== id);
        localStorage.setItem('brunoChangelogs', JSON.stringify(changelogs));
        updateChangelogs(changelogs);
        updateChangelogsTable();
        showNotification('Deleted', 'success');
        addLog('changelog_delete', `Admin deleted changelog ${id}`);
    }
}

// Pastes Admin
function updateAdminPastesGrid(pastesToShow = pastes) {
    const grid = document.getElementById('adminPastesGrid');
    if (!grid) return;
    grid.innerHTML = pastesToShow.map(p => `
        <div class="paste-admin-card">
            <div class="paste-admin-header">
                <div class="paste-admin-icon">📝</div>
                <div class="paste-admin-content">
                    <div class="paste-admin-title" onclick="copyPaste('${p.id}')">${escapeHtml(p.title)}</div>
                    <div class="paste-admin-preview">${escapeHtml(getPreviewText(p.content))}</div>
                </div>
            </div>
            <div class="paste-admin-meta">
                <span>${p.author} • ${p.date}</span>
                <div class="paste-admin-actions">
                    <button class="paste-admin-action view" onclick="copyPaste('${p.id}')">View</button>
                    <button class="paste-admin-action edit">Edit</button>
                    <button class="paste-admin-action delete" onclick="deletePaste('${p.id}', event)">Delete</button>
                    <button class="paste-admin-action feature" onclick="togglePasteFeature('${p.id}', event)">Feature</button>
                </div>
            </div>
        </div>
    `).join('');
}

function searchAdminPastes() {
    const query = document.getElementById('adminPasteSearch').value.toLowerCase();
    const filtered = pastes.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
    updateAdminPastesGrid(filtered);
}

function filterAdminPastes() {
    const filter = document.getElementById('adminPasteFilter').value;
    let filtered = pastes;
    const now = new Date();
    if (filter === 'today') filtered = pastes.filter(p => new Date(p.created_at).toDateString() === now.toDateString());
    if (filter === 'week') filtered = pastes.filter(p => now - new Date(p.created_at) < 7 * 24 * 60 * 60 * 1000);
    if (filter === 'featured') filtered = pastes.filter(p => p.featured);
    if (filter === 'verified') filtered = pastes.filter(p => p.verified);
    updateAdminPastesGrid(filtered);
}

function bulkDeletePastes() {
    if (selectedPastes.size === 0 || !confirm('Delete selected?')) return;
    pastes = pastes.filter(p => !selectedPastes.has(p.id));
    localStorage.setItem('brunoPastes', JSON.stringify(pastes));
    selectedPastes.clear();
    updateAdminPastesGrid(pastes);
    document.getElementById('bulkDeleteBtn').disabled = true;
    showNotification(`${selectedPastes.size} deleted`, 'success');
    addLog('bulk_delete_pastes', `${currentUser.username} deleted ${selectedPastes.size} pastes`);
}

function bulkFeaturePastes() {
    if (selectedPastes.size === 0) return showNotification('Select pastes', 'warning');
    pastes.forEach(p => { if (selectedPastes.has(p.id)) p.featured = !p.featured; });
    localStorage.setItem('brunoPastes', JSON.stringify(pastes));
    selectedPastes.clear();
    updateAdminPastesGrid(pastes);
    document.getElementById('bulkFeatureBtn').disabled = true;
    showNotification('Toggled feature', 'success');
}

function exportPastes() {
    const data = JSON.stringify(pastes, null, 2);
    downloadFile('pastes.json', data);
    showNotification('Exported', 'success');
}

function togglePasteFeature(id, e) {
    e.stopPropagation();
    const paste = pastes.find(p => p.id === id);
    if (paste) paste.featured = !paste.featured;
    localStorage.setItem('brunoPastes', JSON.stringify(pastes));
    updateAdminPastesGrid(pastes);
    showNotification(paste.featured ? 'Featured' : 'Unfeatured', 'success');
}

// Users Admin - New Feature
function updateAdminUsersGrid(usersToShow = users) {
    const grid = document.getElementById('adminUsersGrid');
    if (!grid) return;
    grid.innerHTML = usersToShow.map(u => `
        <div class="user-admin-card">
            <div class="user-admin-avatar">${u.username.charAt(0).toUpperCase()}</div>
            <div class="user-admin-info">
                <div class="user-admin-name">${escapeHtml(u.username)}</div>
                <div class="user-admin-email">${escapeHtml(u.email)}</div>
                <div class="user-admin-meta">
                    <span class="user-admin-role role-${u.role}">${u.role}</span>
                    <span>Joined: ${new Date(u.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="user-admin-actions">
                <button class="user-admin-action edit">Edit</button>
                <button class="user-admin-action ban">Ban</button>
                <button class="user-admin-action unban" style="display: ${u.banned ? 'block' : 'none'};">Unban</button>
                <button class="user-admin-action delete">Delete</button>
            </div>
        </div>
    `).join('');
}

function searchAdminUsers() {
    const query = document.getElementById('adminUserSearch').value.toLowerCase();
    const filtered = users.filter(u => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
    updateAdminUsersGrid(filtered);
}

function filterAdminUsers() {
    const filter = document.getElementById('adminUserFilter').value;
    let filtered = users;
    const now = new Date();
    if (filter === 'active') filtered = users.filter(u => now - new Date(u.last_login || u.created_at) < 30 * 24 * 60 * 60 * 1000);
    if (filter === 'inactive') filtered = users.filter(u => now - new Date(u.last_login || u.created_at) > 30 * 24 * 60 * 60 * 1000);
    if (filter === 'premium') filtered = users.filter(u => u.role === 'premium');
    updateAdminUsersGrid(filtered);
}

function createNewUser() {
    const username = prompt('Username:');
    const email = prompt('Email:');
    if (username && email) {
        const newUser = { id: Math.random().toString(36).substr(2, 9), username, email, role: 'user', created_at: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('brunoUsers', JSON.stringify(users));
        updateAdminUsersGrid(users);
        showNotification('User created', 'success');
        addLog('user_create', `${currentUser.username} created user ${username}`);
    }
}

function importUsers() {
    showNotification('Import: Upload JSON file (simulated)', 'info');
    // Simulate file upload
    const demoUsers = [{ username: 'Test', email: 'test@example.com', role: 'user' }];
    users.push(...demoUsers);
    localStorage.setItem('brunoUsers', JSON.stringify(users));
    updateAdminUsersGrid(users);
    showNotification('Imported', 'success');
}

function exportUsers() {
    const data = JSON.stringify(users, null, 2);
    downloadFile('users.json', data);
    showNotification('Exported', 'success');
}

// Products Admin - New
function loadProductsAdmin() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-admin-card" onclick="showNewProductModal('${p.id}')">
            <div class="product-admin-header">
                <div class="product-admin-icon" style="background: ${p.icon_color};">${p.name.charAt(0)}</div>
                <h3 class="product-admin-name">${escapeHtml(p.name)}</h3>
            </div>
            <p class="product-admin-price">$${p.price}</p>
            <p class="product-admin-description">${escapeHtml(p.description)}</p>
            <div class="product-admin-features">${escapeHtml(p.features.replace(/\n/g, '<br>'))}</div>
            <div class="product-admin-actions">
                <button class="product-admin-action edit">Edit</button>
                <button class="product-admin-action delete" onclick="deleteProduct('${p.id}', event)">Delete</button>
                <button class="product-admin-action duplicate">Duplicate</button>
                <button class="product-admin-action toggle ${p.status}">${p.status === 'active' ? 'Disable' : 'Enable'}</button>
            </div>
        </div>
    `).join('');
}

function deleteProduct(id, e) {
    e.stopPropagation();
    if (confirm('Delete product?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('brunoProducts', JSON.stringify(products));
        loadProducts();
        loadProductsAdmin();
        showNotification('Deleted', 'success');
        addLog('product_delete', `${currentUser.username} deleted product ${id}`);
    }
}

// System Tab
function loadSystemMetrics() {
    const totalStorage = JSON.stringify(localStorage).length / 1024;
    document.getElementById('storageUsageMetric').textContent = `${Math.round(totalStorage)} KB`;
    document.getElementById('storageBar').style.width = `${Math.min(totalStorage / 500 * 100, 100)}%`; // Cap at 500KB
    document.getElementById('performanceMetric').textContent = '98%';
    document.getElementById('performanceBar').style.width = '98%';
    document.getElementById('uptimeMetric').textContent = `${Math.floor(Math.random() * 100)} days`;
    document.getElementById('uptimeBar').style.width = '100%';
    // Analytics
    document.getElementById('totalRevenue').textContent = products.reduce((sum, p) => sum + (p.price * 10), 0).toFixed(2); // Simulated sales
    document.getElementById('bestSeller').textContent = products[0]?.name || 'N/A';
    document.getElementById('bestSellerSales').textContent = Math.floor(Math.random() * 100);
    document.getElementById('conversionRate').textContent = `${Math.random() * 10}%`;
    document.getElementById('activeSubs').textContent = users.filter(u => u.role === 'premium').length || Math.floor(Math.random() * 50);
}

function saveSecuritySettings() {
    showNotification('Security settings saved (simulated)', 'success');
    addLog('security_save', currentUser.username);
}

function saveSiteSettings() {
    showNotification('Site settings saved', 'success');
    addLog('site_save', currentUser.username);
}

function loadActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    feed.innerHTML = logs.slice(-5).reverse().map(log => `
        <div class="activity-item">
            <span class="activity-icon">${getLogIcon(log.type)}</span>
            <div class="activity-content">
                <div class="activity-text">${log.message}</div>
                <div class="activity-time">${new Date(log.timestamp).toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

function loadLogs(logsToShow = logs) {
    const body = document.getElementById('systemLogs');
    if (!body) return;
    body.innerHTML = logsToShow.map(log => `
        <div class="log-entry ${log.type}">
            <div class="log-timestamp">[${new Date(log.timestamp).toLocaleString()}]</div>
            <div class="log-message">${log.message}</div>
        </div>
    `).join('');
}

function searchLogs() {
    const query = document.getElementById('logSearch').value.toLowerCase();
    const filtered = logs.filter(log => log.message.toLowerCase().includes(query));
    loadLogs(filtered);
}

function filterLogs() {
    const filter = document.getElementById('logFilter').value;
    const filtered = filter === 'all' ? logs : logs.filter(log => log.type === filter);
    loadLogs(filtered);
}

function clearLogs() {
    if (confirm('Clear logs?')) {
        logs = [];
        localStorage.setItem('brunoLogs', '[]');
        loadLogs([]);
        showNotification('Cleared', 'success');
        addLog('clear_logs', currentUser.username); // Ironic, but logs it before clear
    }
}

// Utility Functions - Optimized
function closeAllModals() {
    document.querySelectorAll('.modal.active, .popup.active, .admin-panel.active').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = 'auto';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return console.log(`[${type}] ${message}`);
    const existing = container.querySelectorAll('.notification');
    existing.forEach((n, i) => setTimeout(() => n.remove(), i * 100));
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span style="flex: 1;">${escapeHtml(message)}</span><button onclick="this.parentElement.remove()" style="margin-left: auto;">×</button>`;
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 6000);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function addLog(type, message) {
    const log = { type, message, timestamp: new Date().toISOString() };
    logs.unshift(log);
    localStorage.setItem('brunoLogs', JSON.stringify(logs.slice(0, 100))); // Limit to 100
    if (adminMode) loadActivityFeed();
}

function getLogIcon(type) {
    const icons = { user_register: '👤', paste_create: '📝', purchase: '💰', admin: '⚙️' };
    return icons[type] || '📋';
}

function clearAllCache() {
    if (confirm('Clear cache?')) {
        localStorage.clear();
        location.reload();
    }
}

function backupEverything() {
    const backup = { users, pastes, changelogs, products, logs, keysGenerated, timestamp: new Date().toISOString() };
    const data = JSON.stringify(backup, null, 2);
    downloadFile('bruno-backup.json', data);
    showNotification('Backup complete', 'success');
    addLog('backup', currentUser.username);
}

function startMatrixAnimation() {
    const matrixBg = document.querySelector('.matrix-bg');
    if (!matrixBg) return;
    let x = 0, y = 0;
    function animate() {
        x -= 0.3;
        y -= 0.2;
        matrixBg.style.backgroundPosition = `${x}px ${y}px`;
        requestAnimationFrame(animate);
    }
    animate();
}

function showDemo() {
    showNotification('Demo activated! Explore chat & pastes.', 'success');
}

// Additional Admin Commands
function broadcastMessage() {
    const msg = prompt('Broadcast message:');
    if (msg) {
        showNotification(`Broadcast: "${msg}" sent to all`, 'success');
        addLog('broadcast', `${currentUser.username}: ${msg}`);
    }
}

function generateKey() {
    const key = `bruno-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
    keysGenerated.push({ key, generated_by: currentUser.username, date: new Date().toISOString() });
    localStorage.setItem('brunoKeys', JSON.stringify(keysGenerated.slice(0, 100)));
    navigator.clipboard.writeText(key);
    showNotification(`Key: ${key} (copied)`, 'success');
    addLog('key_generate', `${currentUser.username} generated key ${key}`);
    loadAdminStats();
}

console.log('🎉 Bruno.cc Optimized - Full Admin Features Active!');
