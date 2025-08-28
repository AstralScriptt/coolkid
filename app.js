const colors = ["#ffffff", "#f0f0f0", "#e6e6e6", "#d9d9d9"]; // White and off-white shades
const starCount = 10;
const container = document.getElementById("bg");
// Get full page height automatically
const worldHeight = document.documentElement.scrollHeight;
const worldWidth = window.innerWidth;
container.style.height = worldHeight + "px";
const stars = [];
for (let i = 0; i < starCount; i++) {
  const star = document.createElement("div");
  star.className = "star";
  const size = Math.random() * 20 + 10; // Smaller size range (10-30px)
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.background = colors[Math.floor(Math.random() * colors.length)];
  star.style.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"; // Star shape
  container.appendChild(star);
  stars.push({
    el: star,
    x: Math.random() * worldWidth,
    y: Math.random() * worldHeight,
    dx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
    dy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
    size
  });
}
function animate() {
  stars.forEach(s => {
    s.x += s.dx;
    s.y += s.dy;
    if (s.x <= 0 || s.x + s.size >= worldWidth) s.dx *= -1;
    if (s.y <= 0 || s.y + s.size >= worldHeight) s.dy *= -1;
    s.el.style.left = `${s.x}px`;
    s.el.style.top = `${s.y}px`;
  });
  requestAnimationFrame(animate);
}
animate();
