// script.js - Hyper Animations & Simplified Token Access with Popup Menu Notification (Click Fixed + Debug)
class HyperNotificationSystem {
    constructor() {
        this.menu = document.getElementById('notificationMenu');
        this.title = document.getElementById('notificationTitle');
        this.message = document.getElementById('notificationMessage');
    }
    show(title, message, type = 'info', duration = 5000) {
        console.log('Showing notification:', title, message); // Debug
        this.title.textContent = title;
        this.message.textContent = message;
        this.menu.style.display = 'flex';
        // Auto close after duration
        setTimeout(() => {
            this.hide();
        }, duration);
    }
    hide() {
        console.log('Hiding notification'); // Debug
        this.menu.style.display = 'none';
    }
}
const notify = new HyperNotificationSystem();

// Simplified Token Access Function
function unlockWithToken(token) {
    console.log('unlockWithToken called with:', token); // Debug
    if (!token || token.trim().length === 0) {
        notify.show('Error', 'Enter a token to unlock access.', 'error');
        return false;
    }
    // Accept any non-empty token
    localStorage.setItem('token', token);
    notify.show('Access Unlocked!', `Welcome aboard with your token!`, 'success');
    // Delay main content show until after notification is visible
    setTimeout(() => {
        showMainContent();
    }, 1000); // Give time for popup to show
    return false;
}

function showMainContent() {
    console.log('Showing main content'); // Debug
    const authOverlay = document.getElementById('authOverlay');
    authOverlay.style.opacity = '0'; // Fade out first
    setTimeout(() => {
        authOverlay.style.display = 'none';
    }, 300); // Match fade timing
    
    const main = document.getElementById('mainContent');
    main.style.display = 'block';
    main.classList.add('fade-in');
    // Trigger stagger for cards
    setTimeout(() => {
        document.querySelectorAll('.ultra-stagger-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.style.animationPlayState = 'running';
        });
    }, 200);
    notify.hide(); // Close the notification menu now
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('authOverlay').style.opacity = '1';
    document.getElementById('tokenInput').value = ''; // Clear input
    notify.show('Session Closed', 'Enter a new token to return.', 'info');
}

// Check if already unlocked
if (localStorage.getItem('token')) {
    showMainContent();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - attaching events'); // Debug log
    
    // Handle Unlock Button Click
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        console.log('Unlock button found, adding listener'); // Debug
        unlockBtn.addEventListener('click', (e) => {
            console.log('Unlock button clicked - handling token'); // Debug log
            e.preventDefault();
            e.stopPropagation();
            const token = document.getElementById('tokenInput').value.trim();
            unlockWithToken(token);
        });
    } else {
        console.error('Unlock button (#unlockBtn) not found! Check HTML ID.'); // Debug
    }

    // Handle Enter Key in Input - Call Unlock Directly
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) {
        console.log('Token input found, adding keypress listener'); // Debug
        tokenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter pressed in input - handling token'); // Debug log
                e.preventDefault();
                e.stopPropagation();
                const token = tokenInput.value.trim();
                unlockWithToken(token);
            }
        });
    } else {
        console.error('Token input (#tokenInput) not found!'); // Debug
    }

    // Backup: Block any form submit
    const tokenForm = document.getElementById('tokenForm');
    if (tokenForm) {
        tokenForm.addEventListener('submit', (e) => {
            console.log('Form submit intercepted - blocking'); // Debug log
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    // Close Notification Menu
    const closeBtn = document.getElementById('closeNotificationMenu');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notify.hide();
        });
    }

    // Test Notification (now uses popup menu)
    const testBtn = document.getElementById('testNotification');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            notify.show('Test Alert', 'Notification test successful! Vibes activated.', 'success');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any link behavior
            logout();
        });
    }

    // Popup Triggers
    document.querySelectorAll('.ultra-popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const popupId = trigger.dataset.popup + 'Popup';
            document.getElementById(popupId).style.display = 'flex';
            notify.show('Details Unlocked', `${trigger.querySelector('h3').textContent} info opened.`, 'info');
        });
    });

    // Close Popups
    document.querySelectorAll('.close-hyper-popup').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.target.closest('.hyper-popup-overlay').style.display = 'none';
            notify.show('Closed', 'Details sealed.', 'success');
        });
    });

    // Contact CTA
    const contactCta = document.getElementById('contactCta');
    if (contactCta) {
        contactCta.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('contactPopup').style.display = 'flex';
            notify.show('Contact Opened', 'Portal activated.', 'success');
        });
    }

    // Quick Form Submit
    const quickForm = document.querySelector('.quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const idea = e.target.querySelector('input').value.trim();
            if (!idea) {
                notify.show('Error', 'Share your idea to proceed!', 'error');
                return;
            }
            notify.show('Sent!', `Idea "${idea.substring(0, 20)}..." sent! Thanks.`, 'success');
            e.target.reset();
            e.target.closest('.hyper-popup-overlay').style.display = 'none';
        });
    }

    // Initial Load Effect
    if (document.getElementById('mainContent').style.display !== 'none') {
        notify.show('Reloaded', 'Session ready to go!', 'success');
    }

    console.log('All events attached successfully'); // Debug log
});

// Enhanced Ripple Effect for Buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.hyper-cta, .auth-btn, .gold-submit-btn')) {
        const btn = e.target.closest('button, a');
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
            transform: scale(0); animation: hyper-ripple-vortex 0.7s linear; left: ${e.clientX - btn.getBoundingClientRect().left}px; top: ${e.clientY - btn.getBoundingClientRect().top}px; pointer-events: none;
        `;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    }
});
