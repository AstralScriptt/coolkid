// script.js - Crazy Animations & Interactions
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
    }
    show(message, type = 'info', duration = 3000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'star'}"></i><span>${message}</span>`;
        this.container.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 500);
        }, duration);
        // Add confetti explosion
        this.triggerConfetti();
    }
    triggerConfetti() {
        for (let i = 0; i < 50; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            conf.style.animationDuration = (Math.random() * 3 + 1) + 's';
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 4000);
        }
    }
}
const notify = new NotificationSystem();

// Stagger Animations on Load
document.addEventListener('DOMContentLoaded', () => {
    const staggers = document.querySelectorAll('.stagger-card');
    staggers.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animationPlayState = 'running';
    });

    // Hero CTA
    document.getElementById('heroCta').addEventListener('click', (e) => {
        e.target.classList.add('explode-btn-active');
        setTimeout(() => e.target.classList.remove('explode-btn-active'), 600);
        notify.show('Blasting off to glory! 🚀', 'success');
    });

    // Popup Triggers
    document.querySelectorAll('.popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const popupId = trigger.dataset.popup + 'Popup';
            document.getElementById(popupId).style.display = 'flex';
            notify.show(`Popup exploded: ${trigger.querySelector('h3').textContent}! 💥`, 'info');
        });
    });

    // Close Popups
    document.querySelectorAll('.close-popup').forEach(close => {
        close.addEventListener('click', (e) => {
            e.target.closest('.popup-overlay').style.display = 'none';
        });
    });

    // Contact CTA
    document.getElementById('contactCta').addEventListener('click', () => {
        document.getElementById('contactPopup').style.display = 'flex';
        notify.show('Contact portal opened – Let's make magic! ✨', 'success');
    });

    // Placeholder Button Ripples
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            notify.show('Ripple activated – Feeling the waves! 🌊', 'info');
        });
    });

    // Quick Form Submit
    document.querySelector('.quick-form').addEventListener('submit', (e) => {
        e.preventDefault();
        notify.show('Message blasted to Fancy HQ! Response incoming... 📡', 'success');
        e.target.reset();
        e.target.closest('.popup-overlay').style.display = 'none';
    });

    // Continuous Morphing
    setInterval(() => {
        document.querySelectorAll('.morph-shape').forEach(shape => {
            shape.style.animationDuration = (Math.random() * 2 + 2) + 's';
        });
    }, 5000);

    // Initial Load Explosion
    notify.show('Welcome to Fancy – Prepare for digital insanity! 🎉', 'success');
});

// CSS Classes for Explosions (add to JS-triggered elements)
const style = document.createElement('style');
style.textContent = `
    .explode-btn-active {
        animation: explode 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    @keyframes explode {
        0% { transform: scale(1); }
        50% { transform: scale(1.5) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
    }
    .confetti {
        position: fixed; width: 10px; height: 10px; pointer-events: none; z-index: 1500;
        animation: confetti-fall 3s linear forwards;
    }
    @keyframes confetti-fall {
        to { transform: translateY(100vh) rotate(1080deg); opacity: 0; }
    }
    .ripple {
        position: absolute; border-radius: 50%; background: rgba(255,255,255,0.6);
        transform: scale(0); animation: ripple-effect 0.6s linear;
    }
    @keyframes ripple-effect {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);
