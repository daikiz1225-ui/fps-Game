import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';
import { shoot, updateBullets } from './shot.js';

createMap();

// 射撃ボタン（ジャンプボタンの右上へ）
const shootBtn = document.createElement('div');
shootBtn.innerHTML = "🔫";
Object.assign(shootBtn.style, {
    position: 'fixed', bottom: '160px', right: '40px', // ジャンプボタン(60px)より上
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

    // 1. カメラ回転
    cameraAngleX += input.look.x * 4;
    cameraAngleY = Math.max(-0.6, Math.min(0.6, cameraAngleY + input.look.y * 4));
    input.look.x = 0; input.look.y = 0;

    // 2. 移動と向きの制御
    const isMoving = input.move.x !== 0 || input.move.y !== 0;
    if (isMoving) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.22;
        player.position.z += Math.cos(moveAngle) * 0.22;
        if (!input.isShooting) player.rotation.y = moveAngle;
    }
    
    // 射撃中は常にカメラの向きを向く
    if (input.isShooting) {
        player.rotation.y = cameraAngleX + Math.PI; // 背面を向かないよう調整
        
        // 連射タイマー (約0.1秒間隔)
        shootTimer++;
        if (shootTimer > 6) {
            const camDir = new THREE.Vector3();
            camera.getWorldDirection(camDir);
            shoot(player.position, camDir);
            shootTimer = 0;
        }
    }

    // 3. 当たり判定（壁貫通防止）
    let targetFloorY = 0;
    colliders.forEach(obj => {
        const dx = player.position.x - obj.mesh.position.x;
        const dz = player.position.z - obj.mesh.position.z;
        if (Math.abs(dx) < obj.sizeW + 0.6 && Math.abs(dz) < obj.sizeD + 0.6) {
            if (player.position.y >= obj.h - 0.8) {
                targetFloorY = obj.h;
            } else {
                // 壁押し戻し
                if (Math.abs(dx) > Math.abs(dz)) player.position.x = obj.mesh.position.x + Math.sign(dx) * (obj.sizeW + 0.61);
                else player.position.z = obj.mesh.position.z + Math.sign(dz) * (obj.sizeD + 0.61);
            }
        }
    });

    // 4. 重力・ジャンプ
    if (input.jump && player.position.y <= targetFloorY + 0.1) {
        setVelocityY(0.38);
        input.jump = false;
    }
    player.position.y += velocityY;
    if (player.position.y > targetFloorY) setVelocityY(velocityY - 0.02);
    else { player.position.y = targetFloorY; setVelocityY(0); }

    // 5. 弾とカメラの更新
    updateBullets();
    const camDist = 12;
    camera.position.set(
        player.position.x + Math.sin(cameraAngleX) * camDist,
        player.position.y + 6 + Math.sin(cameraAngleY) * 10,
        player.position.z + Math.cos(cameraAngleX) * camDist
    );
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    renderer.render(scene, camera);
}
animate();
