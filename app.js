const particleCount = 50;
const container = document.getElementById("particles");
// get full page height automatically!
const worldHeight = document.documentElement.scrollHeight;
const worldWidth = window.innerWidth;
container.style.height = worldHeight + "px";
const particles = [];
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  const size = Math.random() * 5 + 2;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * worldWidth}px`;
  particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
  particle.style.animationDelay = `-${Math.random() * 10}s`;
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  container.appendChild(particle);
  particles.push(particle);
}
