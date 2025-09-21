// script.js - Polished Gold Animations & Interactions
class PolishedNotificationSystem {
    constructor() {
        this.container = document.getElementById('polishedNotificationContainer');
    }
    show(message, type = 'info', duration = 3000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i><span>${message}</span>`;
        this.container.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, duration);
    }
}
const notify = new PolishedNotificationSystem();

// Polished Stagger on Load
document.addEventListener('DOMContentLoaded', () => {
    const compactStaggers = document.querySelectorAll('.compact-stagger-card');
    compactStaggers.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.style.animationPlayState = 'running';
    });

    // Test Notification Button
    document.getElementById('testNotification').addEventListener('click', () => {
        notify.show('Notification test successful! 🔔', 'success');
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

    // Subtle Ripple Buttons
    document.querySelectorAll('.gold-subtle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'subtle-ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
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
    .subtle-ripple {
        position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5);
        transform: scale(0); animation: subtle-ripple-effect 0.5s linear;
    }
    @keyframes subtle-ripple-effect {
        to { transform: scale(3); opacity: 0; }
    }
`;
document.head.appendChild(polishedStyle);
