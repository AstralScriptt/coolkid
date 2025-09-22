// script.js - Complex Aura Gold Animations & Interactions with Auth
class ComplexNotificationSystem {
    constructor() {
        this.container = document.getElementById('complexNotificationContainer');
    }
    show(message, type = 'info', duration = 3500) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i><span>${message}</span>`;
        this.container.appendChild(notif);
        // Force reflow for smooth animation
        notif.offsetHeight;
        requestAnimationFrame(() => notif.classList.add('show'));
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 500);
        }, duration);
    }
}
const notify = new ComplexNotificationSystem();

const API_BASE = '/api';

// Auth Functions (Enhanced with Complexity)
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
            localStorage.setItem('userEmail', email); // Store for email sends
            notify.show('Aura account ignited! Welcome email dispatched with +100 starter points.', 'success');
            showMainContent();
        } else {
            notify.show(data.error || 'Aura creation glitch – try a different email.', 'error');
        }
    } catch (err) {
        notify.show('Network aura disrupted. Refresh and retry.', 'error');
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
            localStorage.setItem('userEmail', email);
            notify.show('Aura unlocked! Session boosted.', 'success');
            showMainContent();
        } else {
            notify.show(data.error || 'Invalid aura credentials – double-check and ignite again.', 'error');
        }
    } catch (err) {
        notify.show('Connection aura faded. Check your signal.', 'error');
    }
}

function showMainContent() {
    document.getElementById('authOverlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('authOverlay').style.display = 'none';
        const main = document.getElementById('mainContent');
        main.style.display = 'block';
        main.classList.add('fade-in');
        // Trigger complex stagger for cards
        setTimeout(() => {
            document.querySelectorAll('.complex-stagger-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                card.style.animationPlayState = 'running';
            });
        }, 200);
    }, 300);
}

function logout() {
    localStorage.clear();
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('authOverlay').style.opacity = '1';
    // Reset tabs to signup
    document.querySelector('.tab-btn[data-tab="signup"]').click();
    notify.show('Aura session closed. Come back for more points!', 'info');
}

// Check if already logged in
if (localStorage.getItem('token')) {
    showMainContent();
}

// Event Listeners (Enhanced)
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Tab Switching with Animations
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any form submit
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(f => {
                f.classList.remove('active-form');
                f.style.display = 'none';
            });
            const targetForm = document.getElementById(`${btn.dataset.tab}Form`);
            targetForm.style.display = 'block';
            setTimeout(() => targetForm.classList.add('active-form'), 10); // Trigger morph
            notify.show(`${btn.dataset.tab === 'signup' ? 'Sign up' : 'Log in'} tab activated.`, 'info', 1500);
        });
    });

    // Signup with Validation
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        if (!email || !password || password.length < 6) {
            notify.show('Email required and password must be 6+ chars for full aura power.', 'error');
            return;
        }
        signup(email, password);
    });

    // Login with Validation
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) {
            notify.show('Email and password needed to unlock aura.', 'error');
            return;
        }
        login(email, password);
    });

    // Test Notification
    document.getElementById('testNotification').addEventListener('click', () => {
        notify.show('Aura notification test – vibes incoming! 🔔 +10 points earned.', 'success');
    });

    // Test Email (Enhanced)
    document.getElementById('testEmail').addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (!token || !email) {
            notify.show('Log in first to send aura emails.', 'error');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/send-email`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    subject: 'Aura Point Update from Fancy!', 
                    message: 'Your test email! Earned +25 aura points for testing. Check your dashboard soon.' 
                })
            });
            const data = await res.json();
            if (res.ok) {
                notify.show('Aura email dispatched! +25 points added to your vibe.', 'success');
            } else {
                notify.show(data.error || 'Aura mail glitch – try again.', 'error');
            }
        } catch (err) {
            notify.show('Email aura disrupted by network. Retry soon.', 'error');
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Complex Popup Triggers
    document.querySelectorAll('.complex-popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const popupId = trigger.dataset.popup + 'Popup';
            document.getElementById(popupId).style.display = 'flex';
            notify.show(`Aura details for ${trigger.querySelector('h3').textContent} unlocked. +15 points!`, 'info');
        });
    });

    // Close Complex Popups
    document.querySelectorAll('.close-complex-popup').forEach(close => {
        close.addEventListener('click', (e) => {
            e.target.closest('.complex-popup-overlay').style.display = 'none';
            notify.show('Popup aura sealed.', 'success', 1500);
        });
    });

    // Contact CTA
    document.getElementById('contactCta').addEventListener('click', () => {
        document.getElementById('contactPopup').style.display = 'flex';
        notify.show('Aura contact portal opened. +20 points for outreach!', 'success');
    });

    // Quick Form Submit (Enhanced)
    document.querySelector('.quick-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const idea = e.target.querySelector('input').value.trim();
        if (!idea) {
            notify.show('Share your aura idea to earn points!', 'error');
            return;
        }
        notify.show(`Aura idea "${idea.substring(0, 20)}..." blasted! +50 points incoming.`, 'success');
        e.target.reset();
        e.target.closest('.complex-popup-overlay').style.display = 'none';
    });

    // Initial Aura Load Effect
    if (document.getElementById('mainContent').style.display !== 'none') {
        notify.show('Aura session reloaded – full power restored! 🎉', 'success', 2000);
    }
});

// Complex CSS Injections for Extra Animations
const complexStyle = document.createElement('style');
complexStyle.textContent = `
    .subtle-ripple {
        position: absolute; border-radius: 50%; background: rgba(255,255,255,0.6);
        transform: scale(0); animation: complex-ripple-effect 0.6s linear;
    }
    @keyframes complex-ripple-effect {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(complexStyle);
