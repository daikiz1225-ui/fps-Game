import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, paintableBlocks, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY, state, updatePlayerMode } from './player.js';
import { shoot, updateBullets } from './shot.js';

createMap();

// 射撃ボタンをHTMLに追加
if (!document.getElementById('shoot-btn')) {
    const btn = document.createElement('div');
    btn.id = 'shoot-btn';
    btn.innerHTML = "🔫";
    Object.assign(btn.style, {
        position: 'fixed', bottom: '160px', right: '60px', width: '90px', height: '90px',
        borderRadius: '50%', background: 'rgba(255,100,0,0.8)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '40px', touchAction: 'none', zIndex: '1000', border: '3px solid #fff'
    });
    document.body.appendChild(btn);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); input.isShooting = true; });
    btn.addEventListener('touchend', () => { input.isShooting = false; });
}

let cameraAngleX = Math.PI / 2;

function animate() {
    requestAnimationFrame(animate);

    cameraAngleX += input.look.x * 4;
    input.look.x = 0; 

    // 速度調整 (イカ時: 0.27)
    let speed = input.isSquid ? (state.isOnMyInk ? 0.27 : 0.05) : 0.22;
    
    // 移動
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * speed;
        player.position.z += Math.cos(moveAngle) * speed;
        player.rotation.y = moveAngle;
    }

    // 射撃
    if (input.isShooting && !input.isSquid) {
        player.rotation.y = cameraAngleX + Math.PI;
        if (Math.random() > 0.75) {
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            shoot(player.position, dir);
        }
    }

    updateBullets();
    updatePlayerMode(input.isSquid);

    // カメラ固定（上向き）
    camera.position.set(
        player.position.x + Math.sin(cameraAngleX) * 14,
        player.position.y + 4, 
        player.position.z + Math.cos(cameraAngleX) * 14
    );
    camera.lookAt(player.position.x, player.position.y + 3, player.position.z);

    renderer.render(scene, camera);
}
animate();
