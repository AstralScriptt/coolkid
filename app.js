// script.js - Nuclear Gold Insanity Animations & Interactions
class NuclearNotificationSystem {
    constructor() {
        this.container = document.getElementById('nuclearNotificationContainer');
    }
    show(message, type = 'info', duration = 4000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'crown' : type === 'error' ? 'fire' : 'diamond'}"></i><span>${message}</span>`;
        this.container.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 600);
        }, duration);
        // Nuclear confetti gold explosion
        this.triggerGoldConfetti();
    }
    triggerGoldConfetti() {
        for (let i = 0; i < 100; i++) {
            const conf = document.createElement('div');
            conf.className = 'gold-confetti';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.background = `hsl(${40 + Math.random() * 20}, 100%, ${50 + Math.random() * 50}%)`; // Gold tones
            conf.style.animationDuration = (Math.random() * 4 + 2) + 's';
            conf.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 5000);
        }
    }
}
const notify = new NuclearNotificationSystem();

// Nuclear Stagger on Load
document.addEventListener('DOMContentLoaded', () => {
    const nuclearStaggers = document.querySelectorAll('.nuclear-stagger-card');
    nuclearStaggers.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.style.animationPlayState = 'running';
    });

    // Hero CTA Nuclear
    document.getElementById('heroCta').addEventListener('click', (e) => {
        e.target.classList.add('gold-explode-btn-active');
        setTimeout(() => e.target.classList.remove('gold-explode-btn-active'), 800);
        notify.show('Blasting off to GOLD GLORY! 💥👑', 'success');
    });

    // Nuclear Popup Triggers
    document.querySelectorAll('.nuclear-popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const popupId = trigger.dataset.popup + 'Popup';
            document.getElementById(popupId).style.display = 'flex';
            notify.show(`NUCLEAR EXPLOSION: ${trigger.querySelector('h3').textContent}! 🌟`, 'info');
        });
    });

    // Close Nuclear Popups
    document.querySelectorAll('.close-nuclear-popup').forEach(close => {
        close.addEventListener('click', (e) => {
            e.target.closest('.nuclear-popup-overlay').style.display = 'none';
            notify.show('Popup nuked – Back to gold action! ⚡', 'success');
        });
    });

    // Contact CTA Nuclear
    document.getElementById('contactCta').addEventListener('click', () => {
        document.getElementById('contactPopup').style.display = 'flex';
        notify.show('GOLD CONTACT PORTAL OPENED – EMPIRE BUILDING TIME! 🏰', 'success');
    });

    // Gold Ripple Nuclear
    document.querySelectorAll('.gold-ripple-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'gold-ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
            notify.show('GOLD RIPPLE NUCLEAR ACTIVATED – WAVES OF WEALTH! 🌊💰', 'info');
        });
    });

    // Quick Gold Form Nuclear Submit
    document.querySelector('.quick-gold-form').addEventListener('submit', (e) => {
        e.preventDefault();
        notify.show('GOLD MESSAGE BLASTED TO FANCY HQ! EMPIRE RESPONSE INCOMING... 📡👑', 'success');
        e.target.reset();
        e.target.closest('.nuclear-popup-overlay').style.display = 'none';
    });

    // Continuous Warp Chaos
    setInterval(() => {
        document.querySelectorAll('.warp-shape').forEach(shape => {
            shape.style.animationDuration = (Math.random() * 3 + 3) + 's';
            shape.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
        });
    }, 3000);

    // Initial Nuclear Load
    notify.show('WELCOME TO FANCY GOLD – PREPARE FOR NUCLEAR DIGITAL INSANITY! 🎉💥', 'success');
    // Trigger initial confetti
    setTimeout(() => notify.triggerGoldConfetti(), 1000);
});

// Nuclear CSS Injections for Explosions
const nuclearStyle = document.createElement('style');
nuclearStyle.textContent = `
    .gold-explode-btn-active {
        animation: gold-explode 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    @keyframes gold-explode {
        0% { transform: scale(1) rotate(0deg); }
        30% { transform: scale(2) rotate(180deg); }
        60% { transform: scale(1.3) rotate(360deg); }
        100% { transform: scale(1) rotate(720deg); }
    }
    .gold-confetti {
        position: fixed; width: 12px; height: 12px; pointer-events: none; z-index: 1500;
        animation: gold-confetti-fall 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    @keyframes gold-confetti-fall {
        to { transform: translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(1440deg); opacity: 0; }
    }
    .gold-ripple {
        position: absolute; border-radius: 50%; background: rgba(255,255,255,0.8);
        transform: scale(0); animation: gold-ripple-effect 0.8s linear;
    }
    @keyframes gold-ripple-effect {
        to { transform: scale(5); opacity: 0; }
    }
`;
document.head.appendChild(nuclearStyle);
