import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, paintableBlocks, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY, state, updatePlayerMode } from './player.js';
import { shoot, updateBullets } from './shot.js';

createMap();

const shootBtn = document.createElement('div');
shootBtn.innerHTML = "🔫";
Object.assign(shootBtn.style, {
    position: 'fixed', bottom: '160px', right: '60px', width: '90px', height: '90px',
    borderRadius: '50%', background: 'rgba(255,100,0,0.8)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '40px', touchAction: 'none', zIndex: '1000', border: '3px solid #fff'
});
document.body.appendChild(shootBtn);
shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); input.isShooting = true; });
shootBtn.addEventListener('touchend', () => { input.isShooting = false; });

const inkBar = document.getElementById('ink-bar');
let cameraAngleX = Math.PI / 2;
const splashMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

function createSplash() {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.15, 4, 4), splashMaterial);
    s.position.copy(player.position).y += 0.1;
    scene.add(s);
    setTimeout(() => scene.remove(s), 200);
}

function animate() {
    requestAnimationFrame(animate);

    cameraAngleX += input.look.x * 4;
    input.look.x = 0; 

    state.isOnMyInk = false;
    for (let block of paintableBlocks) {
        if (player.position.distanceTo(block.position) < 1.5 && block.material.color.getHex() === 0xffff00) {
            state.isOnMyInk = true;
            break;
        }
    }

    // イカ速度を 0.45 -> 0.27 (60%) に落としたぜ！
    let speed = input.isSquid ? (state.isOnMyInk ? 0.27 : 0.05) : 0.22;
    
    if (input.isSquid && state.isOnMyInk) {
        state.ink = Math.min(100, state.ink + 1.2);
        // 飛沫の出る頻度も調整
        if ((input.move.x !== 0 || input.move.y !== 0) && Math.random() > 0.5) createSplash();
    } else if (!input.isShooting) {
        state.ink = Math.min(100, state.ink + 0.1);
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
        if (Math.random() > 0.75) {
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            shoot(player.position, dir);
        }
    }

    let targetY = 0;
    colliders.forEach(c => {
        const dx = player.position.x - c.pos.x;
        const dz = player.position.z - c.pos.z;
        if (Math.abs(dx) < c.sizeW + 0.6 && Math.abs(dz) < c.sizeD + 0.6) {
            if (player.position.y >= c.h - 0.8) targetY = c.h;
            else {
                if (Math.abs(dx) > Math.abs(dz)) player.position.x = c.pos.x + Math.sign(dx) * (c.sizeW + 0.61);
                else player.position.z = c.pos.z + Math.sign(dz) * (c.sizeD + 0.61);
            }
        }
    });

    if (input.jump && player.position.y <= targetY + 0.1) {
        setVelocityY(0.4);
        input.jump = false;
    }
    player.position.y += velocityY;
    if (player.position.y > targetY) setVelocityY(velocityY - 0.02);
    else { player.position.y = targetY; setVelocityY(0); }

    updateBullets();

    // カメラ位置を調整 (高さ 6 -> 4, 距離 12 -> 14 にして、より上向き視点に)
    camera.position.set(
        player.position.x + Math.sin(cameraAngleX) * 14,
        player.position.y + 4, 
        player.position.z + Math.cos(cameraAngleX) * 14
    );
    // プレイヤーの少し上 (y+3) を見るようにして、カメラを上に向ける
    camera.lookAt(player.position.x, player.position.y + 3, player.position.z);

    renderer.render(scene, camera);
}
animate();
