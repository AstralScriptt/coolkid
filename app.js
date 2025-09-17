const particleCount = 150; // Increased for more dynamic effect
const container = document.getElementById("particles");
const worldHeight = document.documentElement.scrollHeight;
const worldWidth = window.innerWidth;
container.style.height = worldHeight + "px";
const particles = [];
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  const size = Math.random() * 8 + 3; // Slightly larger particles
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * worldWidth}px`;
  particle.style.top = `${worldHeight}px`;
  particle.style.animationDuration = `${Math.random() * 6 + 3}s`; // Faster animations
  particle.style.animationDelay = `-${Math.random() * 8}s`;
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  container.appendChild(particle);
  particles.push(particle);
}
function updateParticles() {
  particles.forEach(particle => {
    let top = parseFloat(particle.style.top);
    if (top <= -10) {
      particle.style.top = `${worldHeight}px`;
      particle.style.left = `${Math.random() * worldWidth}px`;
      particle.style.transform = `rotate(${Math.random() * 360}deg)`; // Add rotation in JS for extra flair
    } else {
      particle.style.top = `${top - 1}px`;
    }
  });
  requestAnimationFrame(updateParticles);
}
updateParticles();
