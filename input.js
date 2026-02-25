export const input = {
    move: { x: 0, y: 0 },
    look: { x: 0, y: 0 },
    jump: false,
    shoot: false
};

const joyBase = document.getElementById('joy-base');
const joyStick = document.getElementById('joy-stick');
let lastTouchX = 0;
let lastTouchY = 0;

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
        // 感度と反転の調整：ここをマイナスに
        input.look.x = (touch.clientX - lastTouchX) * -0.008; 
        input.look.y = (touch.clientY - lastTouchY) * -0.008;
    }
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}, { passive: false });

window.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        lastTouchX = 0; lastTouchY = 0;
        input.move.x = 0; input.move.y = 0;
        joyStick.style.transform = `translate(0px, 0px)`;
        input.shoot = false;
    }
});

// ジャンプボタン
document.getElementById('jump-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    input.jump = true;
});

// 画面右側タップで射撃フラグ
window.addEventListener('touchstart', (e) => {
    if (e.touches[0].clientX > window.innerWidth / 2) {
        input.shoot = true;
    }
});
