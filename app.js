// script.js - Polished Gold Animations & Interactions with Auth
class PolishedNotificationSystem {
    constructor() {
        this.container = document.getElementById('polishedNotificationContainer');
    }
    show(message, type = 'info', duration = 3000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i><span>${message}</span>`;
        this.container.appendChild(notif);
        // Force reflow for animation
        notif.offsetHeight;
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, duration);
    }
}
const notify = new PolishedNotificationSystem();

const API_BASE = '/api';

// Auth Functions
async function signup(email, password) {
    try {
        const res = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            notify.show('Account created! Welcome email sent.', 'success');
            showMainContent();
        } else {
            notify.show(data.error || 'Signup failed.', 'error');
        }
    } catch (err) {
        notify.show('Network error. Try again.', 'error');
    }
}

async function login(email, password) {
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            notify.show('Logged in successfully!', 'success');
            showMainContent();
        } else {
            notify.show(data.error || 'Login failed.', 'error');
        }
    } catch (err) {
        notify.show('Network error. Try again.', 'error');
    }
}

function showMainContent() {
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('mainContent').classList.add('fade-in');
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('authOverlay').style.display = 'flex';
    notify.show('Logged out.', 'info');
}

// Check if already logged in
if (localStorage.getItem('token')) {
    showMainContent();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
            document.getElementById(`${btn.dataset.tab}Form`).style.display = 'block';
        });
    });

    // Signup
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        signup(email, password);
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });

    // Test Notification
    document.getElementById('testNotification').addEventListener('click', () => {
        notify.show('Notification test successful! 🔔', 'success');
    });

    // Test Email
    document.getElementById('testEmail').addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/send-email`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject: 'Test Email from Fancy!', message: 'This is a test email sent from your Fancy account.' })
            });
            const data = await res.json();
            if (res.ok) {
                notify.show('Test email sent!', 'success');
            } else {
                notify.show(data.error || 'Failed to send email.', 'error');
            }
        } catch (err) {
            notify.show('Network error.', 'error');
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Polished Stagger on Load
    const compactStaggers = document.querySelectorAll('.compact-stagger-card');
    compactStaggers.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.style.animationPlayState = 'running';
    });

    // Polished Popup Triggers
    document.querySelectorAll('.compact-popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const popupId = trigger.dataset.popup + 'Popup';
            document.getElementById(popupId).style.display = 'flex';
            notify.show(`${trigger.querySelector('h3').textContent} details opened.`, 'info');
        });
    });

    // Close Polished Popups
    document.querySelectorAll('.close-polished-popup').forEach(close => {
        close.addEventListener('click', (e) => {
            e.target.closest('.polished-popup-overlay').style.display = 'none';
        });
    });

    // Contact CTA
    document.getElementById('contactCta').addEventListener('click', () => {
        document.getElementById('contactPopup').style.display = 'flex';
        notify.show('Contact form opened.', 'success');
    });

    // Quick Form Submit
    document.querySelector('.quick-form').addEventListener('submit', (e) => {
        e.preventDefault();
        notify.show('Message sent successfully!', 'success');
        e.target.reset();
        e.target.closest('.polished-popup-overlay').style.display = 'none';
    });
});

// Polished CSS Injections
const polishedStyle = document.createElement('style');
polishedStyle.textContent = `
    .main-content.fade-in { animation: fade-in 0.5s ease-out; }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    .subtle-ripple {
        position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5);
        transform: scale(0); animation: subtle-ripple-effect 0.5s linear;
    }
    @keyframes subtle-ripple-effect {
        to { transform: scale(3); opacity: 0; }
    }
`;
document.head.appendChild(polishedStyle);
