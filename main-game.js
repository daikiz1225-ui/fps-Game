import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';
import { shoot, updateBullets } from './shot.js';

createMap();

// 射撃ボタンUI
const shootBtn = document.createElement('div');
shootBtn.innerHTML = "🔫";
Object.assign(shootBtn.style, {
    position: 'fixed', bottom: '160px', right: '40px',
    width: '100px', height: '100px', borderRadius: '50%',
    background: 'rgba(255,100,0,0.8)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '40px',
    touchAction: 'none', zIndex: '1000', border: '4px solid white'
});
document.body.appendChild(shootBtn);

shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); input.isShooting = true; });
shootBtn.addEventListener('touchend', () => { input.isShooting = false; });

let shootTimer = 0;
let cameraAngleX = Math.PI / 2;
let cameraAngleY = 0;

function animate() {
    requestAnimationFrame(animate);

    cameraAngleX += input.look.x * 4;
    cameraAngleY = Math.max(-0.6, Math.min(0.6, cameraAngleY + input.look.y * 4));
    input.look.x = 0; input.look.y = 0;

    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.22;
        player.position.z += Math.cos(moveAngle) * 0.22;
        if (!input.isShooting) player.rotation.y = moveAngle;
    }
    
    if (input.isShooting) {
        player.rotation.y = cameraAngleX + Math.PI;
        shootTimer++;
        if (shootTimer > 4) {
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            shoot(player.position, dir);
            shootTimer = 0;
        }
    }

    // 壁判定（簡易）
    let targetY = 0;
    colliders.forEach(obj => {
        const dx = player.position.x - obj.mesh.position.x;
        const dz = player.position.z - obj.mesh.position.z;
        if (Math.abs(dx) < obj.sizeW + 0.6 && Math.abs(dz) < obj.sizeD + 0.6) {
            if (player.position.y >= obj.h - 0.8) targetY = obj.h;
            else {
                if (Math.abs(dx) > Math.abs(dz)) player.position.x = obj.mesh.position.x + Math.sign(dx) * (obj.sizeW + 0.61);
                else player.position.z = obj.mesh.position.z + Math.sign(dz) * (obj.sizeD + 0.61);
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

    camera.position.set(
        player.position.x + Math.sin(cameraAngleX) * 12,
        player.position.y + 6 + Math.sin(cameraAngleY) * 10,
        player.position.z + Math.cos(cameraAngleX) * 12
    );
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    renderer.render(scene, camera);
}
animate();
