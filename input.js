export const input = {
    move: { x: 0, y: 0 },
    jump: false
};

const joyBase = document.getElementById('joy-base');
const joyStick = document.getElementById('joy-stick');

joyBase.addEventListener('touchmove', (e) => {
    const rect = joyBase.getBoundingClientRect();
    const touch = e.touches[0];
    const dx = touch.clientX - (rect.left + 65);
    const dy = touch.clientY - (rect.top + 65);
    const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 50);
    const angle = Math.atan2(dy, dx);

    joyStick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    input.move.x = (Math.cos(angle) * dist) / 50;
    input.move.y = (Math.sin(angle) * dist) / 50;
}, { passive: false });

joyBase.addEventListener('touchend', () => {
    joyStick.style.transform = `translate(0px, 0px)`;
    input.move.x = 0;
    input.move.y = 0;
});

document.getElementById('jump-btn').addEventListener('touchstart', () => {
    input.jump = true;
});
