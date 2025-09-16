const particleCount = 100;
const container = document.getElementById("particles");
const worldHeight = document.documentElement.scrollHeight;
const worldWidth = window.innerWidth;
container.style.height = worldHeight + "px";
const particles = [];
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  const size = Math.random() * 6 + 3;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * worldWidth}px`;
  particle.style.top = `${worldHeight}px`;
  particle.style.animationDuration = `${Math.random() * 8 + 4}s`;
  particle.style.animationDelay = `-${Math.random() * 8}s`;
  particle.style.opacity = Math.random() * 0.4 + 0.2;
  container.appendChild(particle);
  particles.push(particle);
}
function updateParticles() {
  particles.forEach(particle => {
    let top = parseFloat(particle.style.top);
    if (top <= -10) {
      particle.style.top = `${worldHeight}px`;
      particle.style.left = `${Math.random() * worldWidth}px`;
    } else {
      particle.style.top = `${top - 1}px`;
    }
  });
  requestAnimationFrame(updateParticles);
}
updateParticles();
