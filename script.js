const card = document.getElementById("card");
const shine = document.querySelector(".shine");
const innerShine = document.querySelector(".inner-shine");
const texture = document.querySelector(".card-texture");

let isFlipped = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function startDrag(x, y) {
  isDragging = true;
  startX = x;
  startY = y;
  shine.style.opacity = 1;
  innerShine.style.opacity = 0.9;
}

function moveDrag(x, y) {
  if (!isDragging) return;

  const dx = x - startX;
  const dy = y - startY;

  currentY = clamp(dx * 0.15, -25, 25);
  currentX = clamp(-dy * 0.15, -25, 25);

  card.style.transform = `
    rotateX(${currentX + (isFlipped ? 180 : 0)}deg)
    rotateY(${currentY}deg)
  `;

  texture.style.transform = `translate(${currentY * 0.3}px, ${currentX * 0.3}px) translateZ(0.5px)`;

  const shineX = 50 + currentY * 1.4;
  const shineY = 50 + currentX * 1.4;
  const intensity = Math.min(Math.abs(currentX) + Math.abs(currentY), 40) / 40;
  shine.style.opacity = intensity;
  shine.style.background = `
    radial-gradient(
      circle at ${shineX}% ${shineY}%,
      rgba(0,191,255,0.65),
      rgba(0,191,255,0.35) 25%,
      rgba(0,191,255,0.15) 40%,
      transparent 65%
    )
  `;

  const innerX = 50 + currentY * 1.8;
  const innerY = 50 + currentX * 1.8;
  innerShine.style.background = `
    linear-gradient(${120 + currentY}deg, transparent 20%, rgba(0,191,255,0.35), transparent 60%),
    radial-gradient(circle at ${innerX}% ${innerY}%, rgba(0,191,255,0.25), transparent 55%)
  `;
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  shine.style.opacity = 0;
  innerShine.style.opacity = 0.5;

  card.style.transition = "transform 0.6s ease";
  card.style.transform = `rotateX(${isFlipped ? 180 : 0}deg) rotateY(0deg)`;
  setTimeout(() => {
    card.style.transition = "";
  }, 600);
}

card.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
window.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
window.addEventListener("mouseup", endDrag);

card.addEventListener("mousemove", e => {
  if (isDragging) return;
  const x = (e.offsetX / card.clientWidth) * 20;
  const y = (e.offsetY / card.clientHeight) * 20;
  texture.style.backgroundPosition = `${x}px ${y}px`;
});

card.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startDrag(t.clientX, t.clientY);
});
window.addEventListener("touchmove", e => {
  const t = e.touches[0];
  moveDrag(t.clientX, t.clientY);
});
window.addEventListener("touchend", endDrag);

card.addEventListener("click", () => {
  if (isDragging) return;
  isFlipped = !isFlipped;
  card.style.transition = "transform 0.8s ease";
  card.style.transform = `rotateX(${isFlipped ? 180 : 0}deg) rotateY(0deg)`;
});
