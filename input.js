export const input = {
    move: { x: 0, y: 0 },
    look: { x: 0, y: 0 },
    jump: false,
    isShooting: false,
    isSquid: false
};

const SENSITIVITY = 0.005;
const joyBase = document.getElementById('joy-base');
const joyStick = document.getElementById('joy-stick');
let lastTouchX = 0;

joyBase.addEventListener('touchmove', (e) => {
    const rect = joyBase.getBoundingClientRect();
    const touch = [...e.touches].find(t => t.clientX < window.innerWidth / 2);
    if (!touch) return;
    const dx = touch.clientX - (rect.left + 65);
    const dy = touch.clientY - (rect.top + 65);
    const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 50);
    const angle = Math.atan2(dy, dx);
    joyStick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    input.move.x = (Math.cos(angle) * dist) / 50;
    input.move.y = (Math.sin(angle) * dist) / 50;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    const touch = [...e.touches].find(t => t.clientX > window.innerWidth / 2);
    if (!touch) return;
    if (lastTouchX !== 0) {
        input.look.x = (touch.clientX - lastTouchX) * -SENSITIVITY;
        // input.look.y は無視（上下移動を固定）
    }
    lastTouchX = touch.clientX;
}, { passive: false });

window.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        lastTouchX = 0;
        input.move.x = 0; input.move.y = 0;
        joyStick.style.transform = `translate(0px, 0px)`;
    }
});

document.getElementById('jump-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    input.jump = true;
});

// イカモード切り替え
const squidBtn = document.getElementById('squid-btn');
squidBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    input.isSquid = true;
    squidBtn.style.background = "rgba(0,255,0,0.9)";
});
squidBtn.addEventListener('touchend', () => {
    input.isSquid = false;
    squidBtn.style.background = "rgba(0,255,0,0.5)";
});
