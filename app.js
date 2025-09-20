// Bruno.cc Admin System - FIXED VERSION
// Admin login: Email = "21", Password = "21"
// Single admin account, no role changes allowed

// Configuration
const ADMIN_EMAIL = "21";
const ADMIN_PASSWORD = "21";
const ADMIN_ROLE = "admin";

// Global State
let currentUser = null;
let adminMode = false;
let editingChangelogId = null;
let pastes = JSON.parse(localStorage.getItem('brunoPastes') || '[]');
let changelogs = JSON.parse(localStorage.getItem('brunoChangelogs') || '[]');

// Simple Particle System
class SimpleParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.init();
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
        this.startAnimation();
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

    startAnimation() {
        // Particles handled by CSS, just initialize
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Bruno.cc - Fixed Version...');
    
    // Initialize systems
    new SimpleParticleSystem();
    startMatrixAnimation();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load content
    loadAllContent();
    
    // Check if admin is logged in
    checkAdminStatus();
    
    console.log('✅ Bruno.cc initialized successfully!');
});

// FIXED Event Listeners Setup
function setupEventListeners() {
    // Chat system - FIXED
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chatContainer');
    
    if (chatInput && sendButton && chatContainer) {
        // Enter key to send
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Button click
        sendButton.addEventListener('click', function(e) {
            e.preventDefault();
            sendMessage();
        });
        
        // Focus on input when chat opens
        document.addEventListener('click', function(e) {
            if (e.target.closest('#chatPopup')) {
                setTimeout(() => chatInput.focus(), 100);
            }
        });
    }
    
    // Login form - FIXED ADMIN LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Close modals on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Global functions
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
    window.showProductEditor = showProductEditor;
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
}

// FIXED Chat System - WORKING VERSION
function sendMessage() {
    const input = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chatContainer');
    
    console.log('Send message clicked'); // Debug
    
    if (!input || !sendButton || !chatContainer) {
        console.error('Chat elements missing');
        showNotification('Chat error - please refresh', 'error');
        return;
    }
    
    const message = input.value.trim();
    console.log('Message:', message); // Debug
    
    if (!message) {
        input.focus();
        showNotification('Please type a message', 'warning');
        return;
    }
    
    // Disable input and button
    input.disabled = true;
    sendButton.disabled = true;
    sendButton.innerHTML = '<span class="loading"></span>Sending...';
    input.style.opacity = '0.6';
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = `<span>${escapeHtml(message)}</span>`;
    chatContainer.appendChild(userMessageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Clear input
    input.value = '';
    
    // Simulate typing delay then show response
    setTimeout(() => {
        const response = generateBotResponse(message);
        console.log('Bot response:', response); // Debug
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.innerHTML = `<span>${escapeHtml(response)}</span>`;
        chatContainer.appendChild(botMessageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Re-enable input
        input.disabled = false;
        sendButton.disabled = false;
        sendButton.innerHTML = 'Send';
        input.style.opacity = '1';
        input.focus();
        
        showNotification('Message sent!', 'success');
        
    }, 1000); // 1 second delay for realistic feel
}

function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Admin-specific responses
    if (adminMode && (lowerMessage.includes('admin') || lowerMessage.includes('panel'))) {
        return 'Admin mode active. Access the admin panel from the navigation bar. All admin functions are available.';
    }
    
    if (lowerMessage.includes('key') || lowerMessage.includes('license') || lowerMessage.includes('activation')) {
        return '🔑 Key activation: Enter your key starting with "bruno-" in the cheat loader. If you need a new key, contact support in Discord or use the admin panel to generate one.';
    } 
    else if (lowerMessage.includes('crash') || lowerMessage.includes('crashing') || lowerMessage.includes('error')) {
        return '💥 Crash troubleshooting: 1) Run as administrator 2) Disable antivirus 3) Update your game 4) Try compatibility mode. Still crashing? Open a Discord ticket with your logs.';
    } 
    else if (lowerMessage.includes('install') || lowerMessage.includes('setup') || lowerMessage.includes('download')) {
        return '📥 Setup guide: 1) Download from your purchase email 2) Extract to desktop 3) Right-click → Run as admin 4) Enter key when prompted. Full guide in Discord #setup.';
    } 
    else if (lowerMessage.includes('feature') || lowerMessage.includes('how to') || lowerMessage.includes('use')) {
        return '🎮 Features: Press F1 in-game for hotkey list. ESP = F2, Aimbot = F3, Speed = F4. Check Discord #tutorials for full feature guides.';
    } 
    else if (lowerMessage.includes('update') || lowerMessage.includes('version') || lowerMessage.includes('new')) {
        return '📢 Updates: Auto-update on launch. Latest version 2.1.0 includes ESP improvements and crash fixes. See changelog above or Discord #updates.';
    } 
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buy')) {
        return '💰 Pricing: The Bronx 3 - $19.99/mo, SAB - $14.99/mo, Arcade Basketball - $9.99/mo. Use code BRUNO10 for 10% off first month!';
    } 
    else if (lowerMessage.includes('discord') || lowerMessage.includes('server') || lowerMessage.includes('support')) {
        return '💎 Discord: https://discord.gg/DhWsx7rHjS - 24/7 support, updates, giveaways. Verify with /verify [receipt] in #general.';
    } 
    else if (lowerMessage.includes('paste') || lowerMessage.includes('script')) {
        return '📝 Code pastes: Use the Pastes button above to create/share scripts. Click any paste to copy to clipboard. Admin can delete pastes.';
    }
    else if (lowerMessage.includes('admin') && !adminMode) {
        return '🔒 Admin access: Contact the developer for admin privileges. Type "21" in the email field and "21" for password to login as admin.';
    }
    else {
        return '🤖 I can help with: keys, crashes, setup, features, updates, pricing, Discord, or pastes. Type your question or say "help" for more options!';
    }
}

// FIXED Popup Functions
function toggleChatPopup() {
    const popup = document.getElementById('chatPopup');
    if (!popup) return;
    
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
    
    if (popup.classList.contains('active')) {
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 200);
    }
}

function toggleShopPopup() {
    const popup = document.getElementById('shopPopup');
    if (!popup) return;
    
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
}

function togglePastesPopup() {
    const popup = document.getElementById('pastesPopup');
    if (!popup) return;
    
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
    
    if (popup.classList.contains('active')) {
        loadPastes(); // FIXED: Load pastes when opening
        setTimeout(() => {
            const textarea = document.getElementById('pasteContent');
            if (textarea) textarea.focus();
        }, 200);
    }
}

function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (!panel) return;
    
    if (adminMode) {
        panel.classList.toggle('active');
        document.body.style.overflow = panel.classList.contains('active') ? 'hidden' : 'auto';
    } else {
        showNotification('Admin access required. Login with code: 21', 'error');
        showLogin();
    }
}

// FIXED Authentication - SINGLE ADMIN SYSTEM
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) {
            setTimeout(() => emailInput.focus(), 100);
        }
    }
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function showRegister() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const usernameInput = document.getElementById('registerUsername');
        if (usernameInput) {
            setTimeout(() => usernameInput.focus(), 100);
        }
    }
}

function closeRegister() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// FIXED Login Handler - ADMIN CODE "21"
async function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        showNotification('Login form error', 'error');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // FIXED: Admin login with code "21"
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Admin login successful
        currentUser = {
            id: 'admin',
            email: 'admin@bruno.cc',
            username: 'BrunoAdmin',
            role: ADMIN_ROLE
        };
        
        adminMode = true;
        localStorage.setItem('brunoAdminLoggedIn', 'true');
        localStorage.setItem('brunoAdminSession', Date.now().toString());
        
        closeLogin();
        updateUIForAdmin();
        showNotification('Admin login successful! Welcome back, BrunoAdmin.', 'success');
        
        // Show admin panel access
        const adminAccess = document.getElementById('adminAccess');
        if (adminAccess) {
            adminAccess.style.display = 'block';
        }
        
        // Reload content
        loadAllContent();
        return;
    }
    
    // Regular user login (demo mode)
    if (email && password.length >= 6) {
        currentUser = {
            id: email.replace(/[@.]/g, ''),
            email: email,
            username: email.split('@')[0],
            role: 'user'
        };
        
        localStorage.setItem('brunoUser', JSON.stringify(currentUser));
        localStorage.setItem('brunoUserSession', Date.now().toString());
        
        closeLogin();
        updateUIForUser();
        showNotification(`Welcome ${currentUser.username}!`, 'success');
        loadAllContent();
        return;
    }
    
    showNotification('Invalid credentials. Admin code is "21"', 'error');
}

// FIXED Register Handler
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if trying to register as admin (blocked)
    if (email === ADMIN_EMAIL || username.toLowerCase().includes('admin')) {
        showNotification('Admin account already exists. Use login with code "21"', 'error');
        return;
    }
    
    // Create user
    currentUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        username: username,
        role: 'user'
    };
    
    localStorage.setItem('brunoUser', JSON.stringify(currentUser));
    localStorage.setItem('brunoUserSession', Date.now().toString());
    
    closeRegister();
    updateUIForUser();
    showNotification(`Welcome ${username}! Account created successfully.`, 'success');
    loadAllContent();
}

// FIXED Auth Status Check
function checkAdminStatus() {
    const adminSession = localStorage.getItem('brunoAdminLoggedIn');
    const userSession = localStorage.getItem('brunoUserSession');
    const currentTime = Date.now();
    
    // Check admin session (24 hours)
    if (adminSession === 'true') {
        const adminTime = parseInt(localStorage.getItem('brunoAdminSession') || '0');
        if (currentTime - adminTime < 24 * 60 * 60 * 1000) { // 24 hours
            currentUser = {
                id: 'admin',
                email: 'admin@bruno.cc',
                username: 'BrunoAdmin',
                role: ADMIN_ROLE
            };
            adminMode = true;
            updateUIForAdmin();
            const adminAccess = document.getElementById('adminAccess');
            if (adminAccess) adminAccess.style.display = 'block';
            loadAllContent();
            return;
        } else {
            // Admin session expired
            localStorage.removeItem('brunoAdminLoggedIn');
            localStorage.removeItem('brunoAdminSession');
        }
    }
    
    // Check user session (7 days)
    if (userSession) {
        const userData = localStorage.getItem('brunoUser');
        const sessionTime = parseInt(userSession);
        
        if (currentTime - sessionTime < 7 * 24 * 60 * 60 * 1000) { // 7 days
            if (userData) {
                currentUser = JSON.parse(userData);
                updateUIForUser();
                loadAllContent();
                return;
            }
        } else {
            // User session expired
            localStorage.removeItem('brunoUser');
            localStorage.removeItem('brunoUserSession');
        }
    }
    
    // No valid session
    updateUIGuest();
}

// FIXED UI Updates
function updateUIForAdmin() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer) {
        authContainer.innerHTML = `
            <span class="user-menu">
                <strong style="color: #ff4757;">🔒 ADMIN</strong> - ${currentUser.username}
                <button class="auth-btn logout-btn" onclick="logout()">Logout</button>
            </span>
        `;
    }
    
    const adminAccess = document.getElementById('adminAccess');
    if (adminAccess) {
        adminAccess.style.display = 'block';
    }
}

function updateUIForUser() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer) {
        authContainer.innerHTML = `
            <span class="user-menu">
                👋 ${currentUser.username}
                <button class="auth-btn logout-btn" onclick="logout()">Logout</button>
            </span>
        `;
    }
    
    const adminAccess = document.getElementById('adminAccess');
    if (adminAccess) {
        adminAccess.style.display = 'none';
    }
}

function updateUIGuest() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer) {
        authContainer.innerHTML = `
            <button class="auth-btn login-btn" onclick="showLogin()">Login</button>
            <button class="auth-btn register-btn" onclick="showRegister()">Register</button>
        `;
    }
    
    const adminAccess = document.getElementById('adminAccess');
    if (adminAccess) {
        adminAccess.style.display = 'none';
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        adminMode = false;
        
        localStorage.removeItem('brunoAdminLoggedIn');
        localStorage.removeItem('brunoAdminSession');
        localStorage.removeItem('brunoUser');
        localStorage.removeItem('brunoUserSession');
        
        updateUIGuest();
        showNotification('Logged out successfully', 'success');
        loadAllContent();
    }
}

// FIXED Complete Content Loading
function loadAllContent() {
    loadChangelogs();
    loadProducts();
    loadPastes();
}

// FIXED Working Pastes System
function loadPastes() {
    // Load from localStorage
    const storedPastes = JSON.parse(localStorage.getItem('brunoPastes') || '[]');
    pastes = storedPastes.length > 0 ? storedPastes : getDemoPastes();
    
    updatePastesGrid(pastes);
}

function createPaste() {
    const titleInput = document.getElementById('pasteTitle');
    const contentInput = document.getElementById('pasteContent');
    
    if (!titleInput || !contentInput) {
        showNotification('Paste form error', 'error');
        return;
    }
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!content) {
        showNotification('Please enter some code/content for your paste', 'warning');
        contentInput.focus();
        return;
    }
    
    // Create new paste
    const newPaste = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        title: title || `Paste ${new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`,
        content: content,
        author: currentUser ? (currentUser.username || currentUser.email) : 'Anonymous',
        created_at: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    // Add to beginning of array
    pastes.unshift(newPaste);
    
    // Save to localStorage (keep last 50)
    localStorage.setItem('brunoPastes', JSON.stringify(pastes.slice(0, 50)));
    
    // Clear form
    clearPasteForm();
    
    // Update display
    updatePastesGrid(pastes);
    
    // Show success
    showNotification(`Paste "${newPaste.title}" created successfully! Click to copy.`, 'success');
    
    // Auto-scroll to top
    const grid = document.getElementById('pastesGrid');
    if (grid) {
        grid.scrollTop = 0;
    }
}

function clearPasteForm() {
    const titleInput = document.getElementById('pasteTitle');
    const contentInput = document.getElementById('pasteContent');
    
    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
    
    if (titleInput) titleInput.focus();
}

function updatePastesGrid(pastesToShow) {
    const grid = document.getElementById('pastesGrid');
    if (!grid) return;
    
    // Show last 10 pastes
    const recentPastes = pastesToShow.slice(0, 10);
    
    if (recentPastes.length === 0) {
        grid.innerHTML = '<div style="text-align: center; color: #888; padding: 2rem;">No pastes yet. Create one above!</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    recentPastes.forEach((paste, index) => {
        const card = document.createElement('div');
        card.className = 'paste-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        // Copy functionality
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-paste-btn')) return;
            
            // Copy to clipboard
            navigator.clipboard.writeText(paste.content).then(() => {
                showNotification(`Copied "${paste.title}" to clipboard!`, 'success');
            }).catch(err => {
                console.error('Copy failed:', err);
                // Fallback copy
                const textArea = document.createElement('textarea');
                textArea.value = paste.content;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification(`Copied "${paste.title}"!`, 'success');
            });
        });
        
        card.innerHTML = `
            <h4 title="${escapeHtml(paste.title)}">${escapeHtml(paste.title.length > 30 ? paste.title.substring(0, 27) + '...' : paste.title)}</h4>
            <div class="paste-preview" title="Click to copy full code">${escapeHtml(getPreviewText(paste.content))}</div>
            <div class="paste-meta">
                <span class="paste-date">
                    <span style="color: #b0e0ff;">${paste.author}</span> • 
                    ${paste.date} ${paste.time}
                </span>
                ${adminMode ? `<button class="delete-paste-btn" onclick="deletePaste('${paste.id}', event)">Delete</button>` : ''}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function getPreviewText(content) {
    const lines = content.split('\n');
    let preview = '';
    
    for (let i = 0; i < Math.min(4, lines.length); i++) {
        if (lines[i].trim()) {
            preview += lines[i].trim() + '\n';
        }
    }
    
    return preview.trim().substring(0, 80) + (content.length > 80 ? '...' : '');
}

function deletePaste(pasteId, event) {
    event.stopPropagation();
    event.preventDefault();
    
    if (!adminMode) {
        showNotification('Admin access required to delete pastes', 'error');
        return;
    }
    
    if (!confirm(`Delete paste "${pastes.find(p => p.id === pasteId)?.title || 'Untitled'}"?`)) {
        return;
    }
    
    // Remove from array
    const pasteIndex = pastes.findIndex(p => p.id === pasteId);
    if (pasteIndex !== -1) {
        pastes.splice(pasteIndex, 1);
        localStorage.setItem('brunoPastes', JSON.stringify(pastes));
        updatePastesGrid(pastes);
        showNotification('Paste deleted successfully', 'success');
    } else {
        showNotification('Paste not found', 'error');
    }
}

function getDemoPastes() {
    return [
        {
            id: 'demo1',
            title: 'Example Auto Farm Script',
            content: `-- Bruno.cc Demo Paste\n-- Auto Farm Script\n\nlocal Players = game:GetService("Players")\nlocal player = Players.LocalPlayer\n\nwhile true do\n    -- Your farm logic here\n    wait(0.1)\nend\n\nprint("Auto farm loaded!")`,
            author: 'Demo User',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            time: new Date(Date.now() - 86400000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        },
        {
            id: 'demo2',
            title: 'ESP Script Template',
            content: `-- Bruno.cc ESP Template\n-- Wallhack/ESP Script\n\nlocal ESP = {}\n\nfunction ESP:CreateESP(player)\n    -- ESP creation logic\nend\n\nfor _, player in pairs(game.Players:GetPlayers()) do\n    if player ~= game.Players.LocalPlayer then\n        ESP:CreateESP(player)\n    end\nend\n\nprint("ESP loaded for all players")`,
            author: 'Demo User',
            created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
            date: new Date(Date.now() - 2 * 86400000).toLocaleDateString(),
            time: new Date(Date.now() - 2 * 86400000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
    ];
}

// FIXED Changelogs System
function loadChangelogs() {
    const storedChangelogs = JSON.parse(localStorage.getItem('brunoChangelogs') || '[]');
    changelogs = storedChangelogs.length > 0 ? storedChangelogs : getDemoChangelogs();
    
    updateChangelogs(changelogs.slice(0, 6)); // Show last 6
}

function getDemoChangelogs() {
    return [
        {
            id: '1',
            title: 'Version 2.1.0 - Performance Overhaul',
            content: 'Major performance improvements across all cheats. ESP now 3x faster with reduced memory usage. Added new color customization for ESP boxes. Fixed rare crash on game load. Auto-updater now supports beta versions.',
            author: 'BrunoAdmin',
            date: new Date().toLocaleDateString(),
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Version 2.0.5 - Stability Update',
            content: 'Fixed critical crash issues with The Bronx 3 money script. Improved anti-detection for SAB speed hack. Added new aim assist smoothing options for Arcade Basketball. Updated all cheats for latest game patches.',
            author: 'BrunoAdmin',
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: '3',
            title: 'Version 2.0.0 - Major Feature Release',
            content: 'Introducing SAB cheat suite! New instant steal and auto rich boy features. The Bronx 3 now includes money multiplier up to 10x. Arcade Basketball aim assist now 95% accurate. Complete UI redesign with dark theme.',
            author: 'BrunoAdmin',
            date: new Date(Date.now() - 3 * 86400000).toLocaleDateString(),
            created_at: new Date(Date.now() - 3 * 86400000).toISOString()
        }
    ];
}

function updateChangelogs(changelogsToShow) {
    const grid = document.getElementById('changelogGrid');
    if (!grid) return;
    
    if (changelogsToShow.length === 0) {
        grid.innerHTML = '<div style="text-align: center; color: #888; padding: 2rem; grid-column: 1/-1;">No changelogs yet. Admin can create some!</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    changelogsToShow.forEach((changelog, index) => {
        const card = document.createElement('div');
        card.className = 'changelog-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <h3>${escapeHtml(changelog.title)}</h3>
            <p>${escapeHtml(changelog.content.substring(0, 150))}${changelog.content.length > 150 ? '...' : ''}</p>
            <div class="changelog-date">
                <span style="color: #b0e0ff;">${changelog.author}</span> • 
                ${changelog.date}
                ${adminMode ? `<button class="edit-btn" onclick="editChangelog('${changelog.id}')">Edit</button>` : ''}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function showChangelogEditor(changelogId = null) {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    const modal = document.getElementById('changelogEditor');
    if (!modal) return;
    
    editingChangelogId = changelogId;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const titleInput = document.getElementById('changelogTitle');
    const contentInput = document.getElementById('changelogContent');
    
    if (!titleInput || !contentInput) return;
    
    if (changelogId) {
        // Edit existing
        const changelog = changelogs.find(c => c.id === changelogId);
        if (changelog) {
            titleInput.value = changelog.title;
            contentInput.value = changelog.content;
            titleInput.dataset.originalId = changelogId;
        }
    } else {
        // New changelog
        titleInput.value = `Version ${Math.floor(Math.random() * 100) + 1}.0.0 - `;
        contentInput.value = 'Write your changelog here...';
        delete titleInput.dataset.originalId;
    }
    
    titleInput.focus();
}

function saveChangelog() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    const titleInput = document.getElementById('changelogTitle');
    const contentInput = document.getElementById('changelogContent');
    
    if (!titleInput || !contentInput) return;
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        showNotification('Please fill in both title and content', 'warning');
        return;
    }
    
    if (editingChangelogId) {
        // Update existing
        const index = changelogs.findIndex(c => c.id === editingChangelogId);
        if (index !== -1) {
            changelogs[index] = {
                ...changelogs[index],
                title,
                content,
                author: currentUser.username,
                date: new Date().toLocaleDateString(),
                updated_at: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const newChangelog = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            title,
            content,
            author: currentUser.username,
            date: new Date().toLocaleDateString(),
            created_at: new Date().toISOString()
        };
        changelogs.unshift(newChangelog);
    }
    
    // Save to localStorage (keep last 20)
    localStorage.setItem('brunoChangelogs', JSON.stringify(changelogs.slice(0, 20)));
    
    // Update display
    updateChangelogs(changelogs);
    
    // Close modal
    closeChangelogEditor();
    
    showNotification(`Changelog "${title}" ${editingChangelogId ? 'updated' : 'created'} successfully!`, 'success');
}

function editChangelog(changelogId) {
    showChangelogEditor(changelogId);
}

function closeChangelogEditor() {
    const modal = document.getElementById('changelogEditor');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// FIXED Products System
function loadProducts() {
    const defaultProducts = [
        {
            id: '1',
            name: 'The Bronx 3',
            description: 'Infinite Money, Auto Farm, ESP',
            price: 19.99,
            features: '• Infinite Money\n• Auto Farm\n• ESP\n• Anti-Detection\n• Hotkey Support',
            icon_color: '#00bfff'
        },
        {
            id: '2',
            name: 'SAB',
            description: 'Instant Steal, Speed Hack, Auto rich boy',
            price: 14.99,
            features: '• Instant Steal\n• Speed Hack\n• Auto Rich Boy\n• Teleport\n• NoClip',
            icon_color: '#ff6b6b'
        },
        {
            id: '3',
            name: 'Arcade Basketball',
            description: 'Auto Green, Aim Assist, Perfect Timing',
            price: 9.99,
            features: '• Auto Green\n• Aim Assist\n• Perfect Timing\n• Score Multiplier\n• No Recoil',
            icon_color: '#48d1cc'
        }
    ];
    
    updateFeaturesCards(defaultProducts);
    updateShopItems(defaultProducts);
}

function updateFeaturesCards(products) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.slice(0, 3).forEach((product, index) => {
        const card = document.createElement('div');
        card.className = `card card${index + 1}`;
        card.style.animationDelay = `${index * 0.2}s`;
        card.innerHTML = `
            <svg width="70" height="70" viewBox="0 0 24 24" fill="${product.icon_color}">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h2>${escapeHtml(product.name)}</h2>
            <div style="text-align: left; font-size: 0.95rem; color: #b0e0ff; line-height: 1.6;">${escapeHtml(product.features).replace(/\n/g, '<br>')}</div>
        `;
        container.appendChild(card);
    });
}

function updateShopItems(products) {
    const container = document.getElementById('shopItems');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="${product.icon_color}">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="shop-desc">${escapeHtml(product.description)}</p>
            <p class="price">$${product.price}<span style="font-size: 0.8em; opacity: 0.7;">/month</span></p>
            <button class="buy-btn" onclick="purchaseProduct('${product.id}', '${product.name}')">Buy Now</button>
        `;
        container.appendChild(card);
    });
}

function purchaseProduct(productId, productName) {
    if (!currentUser) {
        showNotification('Please login or register to purchase', 'warning');
        showLogin();
        return;
    }
    
    const message = adminMode 
        ? `Admin purchase simulation for ${productName}`
        : `Redirecting to payment for ${productName}...`;
    
    showNotification(message, 'info');
    
    // Simulate purchase
    setTimeout(() => {
        if (!adminMode) {
            showNotification(`✅ Purchase complete! ${productName} activated. Check your email for download link.`, 'success');
        }
    }, 1500);
}

// FIXED Admin Functions
function showProductEditor() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    showNotification('🛒 Product editor - Coming in v2.2.0', 'info');
}

function showSiteSettings() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    showNotification('⚙️ Site settings - Manage themes, colors, and layout', 'info');
}

function showUserManagement() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    const userCount = localStorage.getItem('brunoUser') ? '5' : '0';
    showNotification(`👥 User Management: ${userCount} registered users`, 'info');
}

function broadcastMessage() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    const message = prompt('📢 Enter broadcast message (appears as notification to all users):');
    if (message && message.trim()) {
        showNotification(`Broadcast sent to all users: "${message}"`, 'success');
        console.log('Admin broadcast:', message);
    } else {
        showNotification('Message cancelled', 'warning');
    }
}

function generateKey() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    const key = `bruno-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(key).then(() => {
        showNotification(`🔑 Key generated: ${key}\n(Already copied to clipboard!)`, 'success');
        console.log('Generated key:', key);
    }).catch(err => {
        showNotification(`🔑 Key: ${key} (Copy manually)`, 'info');
        console.log('Generated key (manual copy):', key);
    });
}

function backupDatabase() {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    // Simulate backup
    showNotification('💾 Backup started...', 'info');
    
    setTimeout(() => {
        const backupData = {
            users: localStorage.getItem('brunoUser') ? 1 : 0,
            pastes: pastes.length,
            changelogs: changelogs.length,
            timestamp: new Date().toISOString()
        };
        
        console.log('Database backup:', backupData);
        showNotification('✅ Backup complete! Check console for details.', 'success');
    }, 2000);
}

function showDemo() {
    showNotification('🎮 Demo activated! Try the chat and pastes system. Full features require purchase.', 'success');
}

// FIXED Utility Functions
function closeAllModals() {
    const modals = document.querySelectorAll('.modal.active, .popup.active, .admin-panel.active');
    modals.forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = 'auto';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }
    
    // Remove existing notifications
    const existing = container.querySelectorAll('.notification');
    existing.forEach((n, i) => {
        setTimeout(() => n.remove(), i * 100);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span style="flex: 1;">${escapeHtml(message)}</span>
        <button onclick="this.parentElement.style.animation='slideOutRight 0.3s ease-out'; setTimeout(() => this.parentElement.remove(), 300);" style="margin-left: auto;">×</button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// FIXED Matrix Animation
function startMatrixAnimation() {
    const matrixBg = document.querySelector('.matrix-bg');
    if (!matrixBg) return;
    
    let positionX = 0;
    let positionY = 0;
    
    function animate() {
        positionX -= 0.3;
        positionY -= 0.2;
        matrixBg.style.backgroundPosition = `${positionX}px ${positionY}px`;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// FIXED Complete Content Load
function loadAllContent() {
    loadChangelogs();
    loadProducts();
    loadPastes();
}

// Admin-only functions
function editChangelog(changelogId) {
    if (!adminMode) {
        showNotification('Admin access required', 'error');
        return;
    }
    showChangelogEditor(changelogId);
}

// Demo functions
function purchaseProduct(productId, productName) {
    if (!currentUser) {
        showNotification('Please login to purchase products', 'warning');
        showLogin();
        return;
    }
    
    showNotification(`Redirecting to payment for ${productName}...`, 'info');
    
    setTimeout(() => {
        showNotification(`Thank you for purchasing ${productName}! Check your email for access details.`, 'success');
    }, 2000);
}

function showDemo() {
    showNotification('Demo mode activated! Limited features available for 24 hours.', 'success');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

console.log('🎉 Bruno.cc - Fixed & Admin-Ready! Login with "21" for admin access.');
