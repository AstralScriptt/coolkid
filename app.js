// script.js - Hyper Animations & Simplified Token Access
class HyperNotificationSystem {
    constructor() {
        this.container = document.getElementById('hyperNotificationContainer');
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
const notify = new HyperNotificationSystem();

// Simplified Token Access Function
function unlockWithToken(token) {
    if (!token || token.trim().length === 0) {
        notify.show('Enter a token to unlock access.', 'error');
        return;
    }
    // Accept any non-empty token
    localStorage.setItem('token', token);
    notify.show(`Access unlocked with token! Welcome aboard.`, 'success');
    showMainContent();
}

function showMainContent() {
    document.getElementById('authOverlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('authOverlay').style.display = 'none';
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
    }, 300);
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('authOverlay').style.opacity = '1';
    document.getElementById('tokenInput').value = ''; // Clear input
    notify.show('Session closed. Enter a new token to return.', 'info');
}

// Check if already unlocked
if (localStorage.getItem('token')) {
    showMainContent();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Token Form Submit
    document.getElementById('tokenForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const token = document.getElementById('tokenInput').value.trim();
        unlockWithToken(token);
    });

    // Test Notification
    document.getElementById('testNotification').addEventListener('click', () => {
        notify.show('Notification test successful! Vibes activated.', 'success');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Popup Triggers
    document.querySelectorAll('.ultra-popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const popupId = trigger.dataset.popup + 'Popup';
            document.getElementById(popupId).style.display = 'flex';
            notify.show(`${trigger.querySelector('h3').textContent} details unlocked.`, 'info', 2000);
        });
    });

    // Close Popups
    document.querySelectorAll('.close-hyper-popup').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.hyper-popup-overlay').style.display = 'none';
            notify.show('Details sealed.', 'success', 1500);
        });
    });

    // Contact CTA
    document.getElementById('contactCta').addEventListener('click', () => {
        document.getElementById('contactPopup').style.display = 'flex';
        notify.show('Contact portal opened.', 'success', 2000);
    });

    // Quick Form Submit
    document.querySelector('.quick-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const idea = e.target.querySelector('input').value.trim();
        if (!idea) {
            notify.show('Share your idea to proceed!', 'error');
            return;
        }
        notify.show(`Idea "${idea.substring(0, 20)}..." sent! Thanks.`, 'success');
        e.target.reset();
        e.target.closest('.hyper-popup-overlay').style.display = 'none';
    });

    // Initial Load Effect
    if (document.getElementById('mainContent').style.display !== 'none') {
        notify.show('Session reloaded – ready to go!', 'success', 2000);
    }
});

// Enhanced Ripple Effect for Buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.hyper-cta, .auth-btn, .gold-submit-btn')) {
        const btn = e.target.closest('button, a');
        const ripple = document.createElement('span');
        ripple.className = 'gold-subtle-btn::after'; // Trigger CSS pseudo via class
        ripple.style.left = `${e.clientX - btn.getBoundingClientRect().left}px`;
        ripple.style.top = `${e.clientY - btn.getBoundingClientRect().top}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    }
});
