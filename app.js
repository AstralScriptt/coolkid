// Advanced Particle System
class AdvancedParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.particleCount = 200;
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        const speed = Math.random() * 3 + 1;
        const hue = Math.random() * 60 + 180; // Cyan to blue range
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.background = `hsl(${hue}, 70%, 50%)`;
        particle.style.animationDuration = `${speed}s`;
        particle.style.animationDelay = `-${Math.random() * speed}s`;
        particle.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px hsl(${hue}, 70%, 50%)`;
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            speed: speed,
            resetTime: Date.now() + (speed * 1000)
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.particles.forEach((particleData, index) => {
            const now = Date.now();
            if (now > particleData.resetTime) {
                const size = Math.random() * 6 + 2;
                const speed = Math.random() * 3 + 1;
                const hue = Math.random() * 60 + 180;
                
                particleData.element.style.width = `${size}px`;
                particleData.element.style.height = `${size}px`;
                particleData.element.style.left = `${Math.random() * 100}vw`;
                particleData.element.style.background = `hsl(${hue}, 70%, 50%)`;
                particleData.element.style.animationDuration = `${speed}s`;
                particleData.element.style.animationDelay = `0s`;
                particleData.element.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px hsl(${hue}, 70%, 50%)`;
                
                particleData.speed = speed;
                particleData.resetTime = now + (speed * 1000);
            }
        });
    }
}

// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Global State
let currentUser = null;
let adminMode = false;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    new AdvancedParticleSystem();
    await initApp();
    loadDynamicContent();
    setupEventListeners();
    checkAuthStatus();
});

// App Initialization
async function initApp() {
    console.log('🚀 Initializing Bruno.cc Ultra Advanced System...');
    
    // Create database tables if they don't exist
    await setupDatabase();
    
    // Load initial content
    await loadChangelogs();
    await loadProducts();
    await loadPastes();
    
    // Start matrix animation
    startMatrixAnimation();
}

async function setupDatabase() {
    // Users table
    const { error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(0);
    
    if (usersError && usersError.code === '42P01') {
        await supabase.rpc('create_users_table');
    }
    
    // Products table
    const { error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(0);
    
    if (productsError && productsError.code === '42P01') {
        await supabase.rpc('create_products_table');
    }
    
    // Changelogs table
    const { error: changelogsError } = await supabase
        .from('changelogs')
        .select('*')
        .limit(0);
    
    if (changelogsError && changelogsError.code === '42P01') {
        await supabase.rpc('create_changelogs_table');
    }
    
    // Pastes table
    const { error: pastesError } = await supabase
        .from('pastes')
        .select('*')
        .limit(0);
    
    if (pastesError && pastesError.code === '42P01') {
        await supabase.rpc('create_pastes_table');
    }
}

// Authentication System
async function setupAuthListeners() {
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        handleAuthChange(event, session);
    });
}

async function handleAuthChange(event, session) {
    currentUser = session?.user || null;
    
    if (event === 'SIGNED_IN') {
        await loadUserData();
        updateUIForUser();
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateUIForGuest();
    }
}

async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user || null;
    await setupAuthListeners();
    
    if (currentUser) {
        await loadUserData();
        updateUIForUser();
    } else {
        updateUIForGuest();
    }
}

async function loadUserData() {
    if (!currentUser) return;
    
    const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();
    
    if (error && error.code === 'PGRST116') {
        // User not in custom users table, create it
        await supabase.from('users').insert({
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.user_metadata?.username || currentUser.email.split('@')[0],
            role: 'user',
            credits: 0,
            subscription: null,
            created_at: new Date().toISOString()
        });
        
        await loadUserData(); // Retry
    } else if (userData) {
        adminMode = userData.role === 'admin';
        document.getElementById('adminAccess').style.display = adminMode ? 'block' : 'none';
    }
}

function updateUIForUser() {
    const authContainer = document.getElementById('authContainer');
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <span>Welcome, ${currentUser.email.split('@')[0]}!</span>
        <button onclick="logout()" class="logout-btn">Logout</button>
    `;
    authContainer.innerHTML = '';
    authContainer.appendChild(userMenu);
}

function updateUIForGuest() {
    const authContainer = document.getElementById('authContainer');
    authContainer.innerHTML = `
        <button class="auth-btn login-btn" onclick="showLogin()">Login</button>
        <button class="auth-btn register-btn" onclick="showRegister()">Register</button>
    `;
}

// Auth Functions
async function showLogin() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function showRegister() {
    document.getElementById('registerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function closeRegister() {
    document.getElementById('registerModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) {
        showNotification(`Login failed: ${error.message}`, 'error');
    } else {
        closeLogin();
        showNotification('Login successful! Welcome back.', 'success');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    // Only allow admin role for first user or specific email
    const isFirstUser = await supabase.from('users').select('id').limit(1).then(({ data }) => !data?.length);
    const isAdminEmail = email === 'admin@bruno.cc'; // Change this to your admin email
    
    if (role === 'admin' && !isFirstUser && !isAdminEmail) {
        showNotification('Admin role can only be assigned to first user or admin email.', 'error');
        return;
    }
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
    
    if (error) {
        showNotification(`Registration failed: ${error.message}`, 'error');
    } else {
        // Insert into custom users table
        await supabase.from('users').insert({
            id: data.user.id,
            email,
            username,
            role: isFirstUser || isAdminEmail ? 'admin' : 'user',
            credits: 0,
            subscription: null,
            created_at: new Date().toISOString()
        });
        
        closeRegister();
        showNotification('Registration successful! Please check your email to verify.', 'success');
    }
});

async function logout() {
    await supabase.auth.signOut();
    showNotification('Logged out successfully.', 'success');
    location.reload();
}

// Dynamic Content Loading
async function loadChangelogs() {
    const { data: changelogs, error } = await supabase
        .from('changelogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
    
    if (error) {
        console.error('Error loading changelogs:', error);
        return;
    }
    
    const grid = document.getElementById('changelogGrid');
    grid.innerHTML = '';
    
    changelogs.forEach((changelog, index) => {
        const card = document.createElement('div');
        card.className = 'changelog-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <h3>${changelog.title}</h3>
            <p>${changelog.content.substring(0, 150)}...</p>
            <div class="changelog-date">${new Date(changelog.created_at).toLocaleDateString()}</div>
            ${adminMode ? `<button class="edit-btn" onclick="editChangelog('${changelog.id}')">Edit</button>` : ''}
        `;
        grid.appendChild(card);
    });
}

async function loadProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: true });
    
    if (error) {
        console.error('Error loading products:', error);
        // Create default products if none exist
        await createDefaultProducts();
        await loadProducts();
        return;
    }
    
    // Update features cards
    await updateFeaturesCards(products);
    
    // Update shop items
    const shopContainer = document.getElementById('shopItems');
    shopContainer.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <svg width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" fill="${product.icon_color || '#00bfff'}" d="M3.05492878,11 C3.5160776,6.82838339 6.82838339,3.5160776 11,3.05492878 L11,1 L13,1 L13,3.05492878 C17.1716166,3.5160776 20.4839224,6.82838339 20.9450712,11 L23,11 L23,13 L20.9450712,13 C20.4839224,17.1716166 17.1716166,20.4839224 13,20.9450712 L13,23 L11,23 L11,20.9450712 C6.82838339,20.4839224 3.5160776,17.1716166 3.05492878,13 L1,13 L1,11 L3.05492878,11 Z M5.07088886,11 L7,11 L7,13 L5.07088886,13 C5.50940162,16.0656912 7.93430884,18.4905984 11,18.9291111 L11,17 L13,17 L13,18.9291111 C16.0656912,18.4905984 18.4905984,16.0656912 18.9291111,13 L17,13 L17,11 L18.9291111,11 C18.4905984,7.93430884 16.0656912,5.50940162 13,5.07088886 L13,7 L11,7 L11,5.07088886 C7.93430884,5.50940162 5.50940162,7.93430884 5.07088886,11 Z M12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 Z"/>
            </svg>
            <h3>${product.name}</h3>
            <p class="shop-desc">${product.description}</p>
            <p class="price">$${product.price} / month</p>
            <button class="buy-btn" onclick="purchaseProduct('${product.id}')">Buy Now 🚀</button>
        `;
        shopContainer.appendChild(card);
    });
}

async function updateFeaturesCards(products) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    
    products.slice(0, 3).forEach((product, index) => {
        const card = document.createElement('div');
        card.className = `card card${index + 1}`;
        card.style.animationDelay = `${index * 0.2}s`;
        card.innerHTML = `
            <svg width="100px" height="100px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" fill="${product.icon_color || '#00bfff'}" d="M3.05492878,11 C3.5160776,6.82838339 6.82838339,3.5160776 11,3.05492878 L11,1 L13,1 L13,3.05492878 C17.1716166,3.5160776 20.4839224,6.82838339 20.9450712,11 L23,11 L23,13 L20.9450712,13 C20.4839224,17.1716166 17.1716166,20.4839224 13,20.9450712 L13,23 L11,23 L11,20.9450712 C6.82838339,20.4839224 3.5160776,17.1716166 3.05492878,13 L1,13 L1,11 L3.05492878,11 Z M5.07088886,11 L7,11 L7,13 L5.07088886,13 C5.50940162,16.0656912 7.93430884,18.4905984 11,18.9291111 L11,17 L13,17 L13,18.9291111 C16.0656912,18.4905984 18.4905984,16.0656912 18.9291111,13 L17,13 L17,11 L18.9291111,11 C18.4905984,7.93430884 16.0656912,5.50940162 13,5.07088886 L13,7 L11,7 L11,5.07088886 C7.93430884,5.50940162 5.50940162,7.93430884 5.07088886,11 Z M12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 Z"/>
            </svg>
            <h2>${product.name}</h2>
            <p>${product.features || product.description}</p>
        `;
        cardsContainer.appendChild(card);
    });
}

async function createDefaultProducts() {
    const defaultProducts = [
        {
            name: 'The Bronx 3',
            description: 'Infinite Money, Auto Farm, ESP',
            price: 19.99,
            features: 'Infinite Money\nAuto Farm\nESP',
            icon_color: '#00bfff'
        },
        {
            name: 'SAB',
            description: 'Instant Steal, Speed Hack, Auto rich boy',
            price: 14.99,
            features: 'Instant Steal\nSpeed Hack\nAuto rich boy',
            icon_color: '#00bfff'
        },
        {
            name: 'Arcade Basketball',
            description: 'Auto Green, Aim Assist, Perfect Timing',
            price: 9.99,
            features: 'Auto Green\nAim Assist\nPerfect Timing',
            icon_color: '#00bfff'
        }
    ];
    
    const { error } = await supabase
        .from('products')
        .insert(defaultProducts);
    
    if (error) console.error('Error creating default products:', error);
}

// Event Listeners
function setupEventListeners() {
    // Chat system
    window.sendMessage = sendAdvancedMessage;
    window.toggleChatPopup = toggleChatPopup;
    
    // Shop system
    window.toggleShopPopup = toggleShopPopup;
    window.purchaseProduct = purchaseProduct;
    
    // Pastes system
    window.togglePastesPopup = togglePastesPopup;
    window.createPaste = createPaste;
    
    // Admin system
    window.toggleAdminPanel = toggleAdminPanel;
    window.showChangelogEditor = showChangelogEditor;
    window.closeChangelogEditor = closeChangelogEditor;
    window.saveChangelog = saveChangelog;
    window.deleteChangelog = deleteChangelog;
    window.editChangelog = editChangelog;
    window.showProductEditor = showProductEditor;
    window.showSiteSettings = showSiteSettings;
    window.showUserManagement = showUserManagement;
    window.broadcastMessage = broadcastMessage;
    window.generateKey = generateKey;
    window.backupDatabase = backupDatabase;
    
    // Demo
    window.showDemo = showDemo;
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('popup') || e.target.classList.contains('admin-panel')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Advanced Chat System
async function sendAdvancedMessage() {
    const input = document.getElementById('chatInput');
    const chatContainer = document.getElementById('chatContainer');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `<span>${escapeHtml(message)}</span>`;
    chatContainer.appendChild(userMessage);
    
    input.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot typing-animation';
    typingIndicator.innerHTML = `<span class="typing-dots">BrunoBot is typing<span>.</span><span>.</span><span>.</span></span>`;
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Generate AI response
    const response = await generateAIResponse(message);
    
    // Remove typing indicator
    chatContainer.removeChild(typingIndicator);
    
    // Add bot response with typing animation
    const botResponse = document.createElement('div');
    botResponse.className = 'chat-message bot';
    botResponse.innerHTML = `<span>${escapeHtml(response)}</span>`;
    
    // Add typing animation
    botResponse.style.opacity = '0';
    chatContainer.appendChild(botResponse);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    setTimeout(() => {
        botResponse.style.transition = 'opacity 0.5s ease';
        botResponse.style.opacity = '1';
    }, 100);
    
    // Save chat history
    if (currentUser) {
        await saveChatMessage(message, response);
    }
}

async function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Advanced AI responses
    if (lowerMessage.includes('key') || lowerMessage.includes('license') || lowerMessage.includes('activation')) {
        return "🔑 For key issues: Make sure your key starts with 'bruno-' and is entered correctly. If issues persist, open a ticket in our Discord with your purchase receipt.";
    } else if (lowerMessage.includes('crash') || lowerMessage.includes('crashing') || lowerMessage.includes('error')) {
        return "💥 Crash issues: Try these troubleshooting steps - 1) Update your game, 2) Run as administrator, 3) Disable antivirus temporarily. Still having issues? Join Discord and open a ticket with crash logs.";
    } else if (lowerMessage.includes('install') || lowerMessage.includes('setup')) {
        return "📥 Installation guide: 1) Download from your purchase page, 2) Extract to a new folder, 3) Run as administrator, 4) Enter your key when prompted. Need video guide? Check #guides in Discord!";
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('how to')) {
        return "🎮 Feature help: All features have hotkeys listed in the GUI. Press F1 for help menu or check our Discord #tutorials channel for detailed guides on each cheat.";
    } else if (lowerMessage.includes('update') || lowerMessage.includes('new version')) {
        const { data: latestUpdate } = await supabase
            .from('changelogs')
            .select('title, content')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (latestUpdate) {
            return `📢 Latest Update: "${latestUpdate.title}" - ${latestUpdate.content.substring(0, 100)}... Check full changelog in our Discord #updates channel!`;
        }
        return "📢 Updates are pushed automatically. Check your Discord #updates channel for the latest patch notes and new features!";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buy')) {
        return "💰 Pricing info: Check our shop page for current pricing. We offer monthly subscriptions with instant access. Use code 'WELCOME10' for 10% off your first month! 🚀";
    } else if (lowerMessage.includes('discord') || lowerMessage.includes('server')) {
        return "💎 Discord: Join our community at https://discord.gg/DhWsx7rHjS - Get support, updates, and exclusive giveaways! Don't forget to verify with your purchase receipt.";
    } else {
        return "🤖 I'm here to help with Bruno cheats! Try asking about keys, crashes, installation, features, updates, or pricing. For other issues, join our Discord support server!";
    }
}

async function saveChatMessage(userMessage, botResponse) {
    if (!currentUser) return;
    
    await supabase.from('chat_history').upsert({
        user_id: currentUser.id,
        user_message,
        bot_response: botResponse,
        timestamp: new Date().toISOString(),
        session_id: generateSessionId()
    });
}

function generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Popup Functions
function toggleChatPopup() {
    const popup = document.getElementById('chatPopup');
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
}

function toggleShopPopup() {
    const popup = document.getElementById('shopPopup');
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
}

function togglePastesPopup() {
    const popup = document.getElementById('pastesPopup');
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : 'auto';
    if (popup.classList.contains('active')) {
        loadPastes();
    }
}

function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('active');
    document.body.style.overflow = panel.classList.contains('active') ? 'hidden' : 'auto';
}

// Shop Functions
async function purchaseProduct(productId) {
    if (!currentUser) {
        showNotification('Please login to purchase products', 'warning');
        showLogin();
        return;
    }
    
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
    
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Simulate Stripe integration
    showNotification(`Redirecting to payment for ${product.name}...`, 'info');
    
    // In real implementation, integrate with Stripe
    setTimeout(() => {
        showNotification(`Thank you for purchasing ${product.name}! Check your email for access details.`, 'success');
        
        // Update user subscription
        supabase.from('users')
            .update({ 
                subscription: productId,
                subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', currentUser.id);
    }, 2000);
}

// Pastes System
async function loadPastes() {
    const { data: pastes, error } = await supabase
        .from('pastes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);
    
    if (error) {
        console.error('Error loading pastes:', error);
        return;
    }
    
    const grid = document.getElementById('pastesGrid');
    grid.innerHTML = '';
    
    pastes.forEach((paste, index) => {
        const card = document.createElement('div');
        card.className = 'paste-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.onclick = () => copyPaste(paste.content);
        card.innerHTML = `
            <h4>${escapeHtml(paste.title || 'Untitled Paste')}</h4>
            <div class="paste-preview">${escapeHtml(paste.content.substring(0, 100))}...</div>
            <div class="paste-meta">
                <span class="paste-date">${new Date(paste.created_at).toLocaleDateString()}</span>
                ${adminMode ? `<button class="delete-paste-btn" onclick="deletePaste('${paste.id}', event)">🗑️</button>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

async function createPaste() {
    const title = document.getElementById('pasteTitle').value.trim();
    const content = document.getElementById('pasteContent').value.trim();
    
    if (!content) {
        showNotification('Please enter some content for your paste', 'warning');
        return;
    }
    
    const { error } = await supabase.from('pastes').insert({
        title: title || `Paste ${new Date().toLocaleDateString()}`,
        content,
        user_id: currentUser?.id || null,
        created_at: new Date().toISOString()
    });
    
    if (error) {
        showNotification(`Error creating paste: ${error.message}`, 'error');
    } else {
        showNotification('Paste created successfully!', 'success');
        document.getElementById('pasteTitle').value = '';
        document.getElementById('pasteContent').value = '';
        loadPastes();
    }
}

function copyPaste(content) {
    navigator.clipboard.writeText(content).then(() => {
        showNotification('Paste copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy paste', 'error');
    });
}

async function deletePaste(pasteId, event) {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this paste?')) return;
    
    const { error } = await supabase
        .from('pastes')
        .delete()
        .eq('id', pasteId);
    
    if (error) {
        showNotification(`Error deleting paste: ${error.message}`, 'error');
    } else {
        showNotification('Paste deleted successfully', 'success');
        loadPastes();
    }
}

// Admin Functions
function showChangelogEditor(changelogId = null) {
    document.getElementById('changelogEditor').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (changelogId) {
        // Load existing changelog
        supabase.from('changelogs')
            .select('*')
            .eq('id', changelogId)
            .single()
            .then(({ data }) => {
                if (data) {
                    document.getElementById('changelogTitle').value = data.title;
                    document.getElementById('changelogContent').value = data.content;
                }
            });
    } else {
        // Clear form for new changelog
        document.getElementById('changelogTitle').value = '';
        document.getElementById('changelogContent').value = '';
    }
}

function closeChangelogEditor() {
    document.getElementById('changelogEditor').classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function saveChangelog() {
    const title = document.getElementById('changelogTitle').value.trim();
    const content = document.getElementById('changelogContent').value.trim();
    
    if (!title || !content) {
        showNotification('Please fill in both title and content', 'warning');
        return;
    }
    
    const changelogData = {
        title,
        content,
        author_id: currentUser.id,
        updated_at: new Date().toISOString()
    };
    
    // Check if editing existing
    const currentTitle = document.getElementById('changelogTitle').dataset.originalTitle;
    if (currentTitle) {
        const { error } = await supabase
            .from('changelogs')
            .update(changelogData)
            .eq('title', currentTitle);
        
        if (error) {
            showNotification(`Error updating changelog: ${error.message}`, 'error');
        } else {
            showNotification('Changelog updated successfully!', 'success');
            closeChangelogEditor();
            loadChangelogs();
        }
    } else {
        // Create new changelog
        const { error } = await supabase.from('changelogs').insert(changelogData);
        
        if (error) {
            showNotification(`Error creating changelog: ${error.message}`, 'error');
        } else {
            showNotification('Changelog created successfully!', 'success');
            closeChangelogEditor();
            loadChangelogs();
        }
    }
}

async function deleteChangelog(changelogId) {
    if (!confirm('Are you sure you want to delete this changelog? This action cannot be undone.')) return;
    
    const { error } = await supabase
        .from('changelogs')
        .delete()
        .eq('id', changelogId);
    
    if (error) {
        showNotification(`Error deleting changelog: ${error.message}`, 'error');
    } else {
        showNotification('Changelog deleted successfully', 'success');
        loadChangelogs();
    }
}

async function editChangelog(changelogId) {
    showChangelogEditor(changelogId);
}

function showProductEditor() {
    showNotification('Product editor coming soon in next update!', 'info');
    // Implement product editor modal
}

function showSiteSettings() {
    showNotification('Site settings panel under development', 'info');
    // Implement site settings
}

function showUserManagement() {
    showNotification('User management dashboard coming soon', 'info');
    // Implement user management
}

async function broadcastMessage() {
    const message = prompt('Enter broadcast message:');
    if (!message) return;
    
    // In real implementation, send to all users via push notifications
    showNotification(`Broadcast sent: "${message}"`, 'success');
    
    // Log broadcast
    await supabase.from('broadcasts').insert({
        message,
        sent_by: currentUser.id,
        sent_at: new Date().toISOString()
    });
}

function generateKey() {
    const key = `bruno-${Math.random().toString(36).substring(2, 15).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    showNotification(`Generated key: ${key}`, 'success');
    
    // Copy to clipboard
    navigator.clipboard.writeText(key);
    
    // Save to database
    supabase.from('keys').insert({
        key,
        used: false,
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
}

async function backupDatabase() {
    showNotification('Starting database backup...', 'info');
    
    // In real implementation, create backup via Supabase API
    setTimeout(() => {
        showNotification('Database backup completed! Check your email for download link.', 'success');
    }, 3000);
}

// Demo Function
function showDemo() {
    showNotification('Demo mode activated! Limited features available for 24 hours.', 'success');
    // Implement demo mode with limited functionality
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#ffa502'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 5000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Matrix Animation
function startMatrixAnimation() {
    const matrixBg = document.querySelector('.matrix-bg');
    let position = 0;
    
    function animateMatrix() {
        position -= 0.5;
        matrixBg.style.backgroundPosition = `${position}px 0`;
        requestAnimationFrame(animateMatrix);
    }
    
    animateMatrix();
}

// Load dynamic content on startup
async function loadDynamicContent() {
    // Load any additional dynamic content here
    console.log('🔥 Dynamic content loaded');
}

// Additional CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(notificationStyles);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW registration failed'));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Check console for details.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('A promise was rejected. Check console for details.', 'error');
});

// Performance monitoring
if (performance && performance.mark) {
    performance.mark('app-start');
}

// Export functions for global access
window.BrunoApp = {
    showNotification,
    loadChangelogs,
    loadProducts,
    logout,
    showLogin,
    showRegister
};

console.log('🌟 Bruno.cc Ultra Advanced System Loaded Successfully! 🚀');
