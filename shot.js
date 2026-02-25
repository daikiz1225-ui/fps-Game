import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, paintableBlocks, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY, state, updatePlayerMode } from './player.js';
import { shoot, updateBullets } from './shot.js';

createMap();

// 射撃ボタン
const shootBtn = document.createElement('div');
shootBtn.innerHTML = "🔫";
Object.assign(shootBtn.style, {
    position: 'fixed', bottom: '160px', right: '40px', width: '100px', height: '100px',
    borderRadius: '50%', background: 'rgba(255,100,0,0.8)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '40px', touchAction: 'none', zIndex: '1000'
});
document.body.appendChild(shootBtn);
shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); input.isShooting = true; });
shootBtn.addEventListener('touchend', () => { input.isShooting = false; });

const inkBar = document.getElementById('ink-bar');
let cameraAngleX = Math.PI / 2;

function createSplash(pos) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 4), new THREE.MeshBasicMaterial({color: 0xffff00}));
    s.position.copy(pos);
    scene.add(s);
    setTimeout(() => scene.remove(s), 200);
}

function animate() {
    requestAnimationFrame(animate);

    cameraAngleX += input.look.x * 4;
    input.look.x = 0; // 上下(Y)は固定なので処理しない

    // 自分のインクの上にいるかチェック
    state.isOnMyInk = false;
    for (let block of paintableBlocks) {
        if (player.position.distanceTo(block.position) < 1.5 && block.material.color.getHex() === 0xffff00) {
            state.isOnMyInk = true; break;
        }
    }

    // 移動速度とインク回復
    let speed = input.isSquid ? (state.isOnMyInk ? 0.4 : 0.05) : 0.22;
    if (input.isSquid && state.isOnMyInk) {
        state.ink = Math.min(100, state.ink + 1.0); // 潜ると回復
        if (input.move.x !== 0 || input.move.y !== 0) createSplash(player.position); // 飛沫
    } else if (!input.isShooting) {
        state.ink = Math.min(100, state.ink + 0.1); // ヒト状態は微回復
    }

    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * speed;
        player.position.z += Math.cos(moveAngle) * speed;
        player.rotation.y = moveAngle;
    }

    updatePlayerMode(input.isSquid);
    inkBar.style.width = state.ink + "%";

    if (input.isShooting && !input.isSquid) {
        player.rotation.y = cameraAngleX + Math.PI;
        if (Math.random() > 0.8) {
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            shoot(player.position, dir);
        }
    }

    // 重力など
    player.position.y += velocityY;
    if (player.position.y > 0) setVelocityY(velocityY - 0.02);
    else { player.position.y = 0; setVelocityY(0); }

    updateBullets();
    camera.position.set(player.position.x + Math.sin(cameraAngleX) * 12, player.position.y + 6, player.position.z + Math.cos(cameraAngleX) * 12);
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);
    renderer.render(scene, camera);
}
animate();
