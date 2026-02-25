import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';

createMap();

let cameraAngleX = 0;
let cameraAngleY = 0;
const cameraDist = 10;

function animate() {
    requestAnimationFrame(animate);

    // カメラ回転 (iPadドラッグに最適化)
    cameraAngleX += input.look.x * 5; 
    cameraAngleY = Math.max(-Math.PI/4, Math.min(Math.PI/4, cameraAngleY + input.look.y * 5));
    input.look.x = 0; input.look.y = 0;

    // カメラ基準の移動
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.2;
        player.position.z += Math.cos(moveAngle) * 0.2;
        // プレイヤーを進行方向に向かせる
        player.rotation.y = moveAngle;
    } else {
        // 移動してない時はカメラの向きに合わせる
        player.rotation.y = cameraAngleX;
    }

    // 当たり判定
    let targetFloorY = 0;
    colliders.forEach(obj => {
        const dx = Math.abs(player.position.x - obj.mesh.position.x);
        const dz = Math.abs(player.position.z - obj.mesh.position.z);
        if (dx < obj.size && dz < obj.size) {
            if (player.position.y >= obj.h - 0.8) targetFloorY = obj.h;
            else {
                player.position.x -= Math.sign(player.position.x - obj.mesh.position.x) * -0.15;
                player.position.z -= Math.sign(player.position.z - obj.mesh.position.z) * -0.15;
            }
        }
    });

    // ジャンプ
    if (input.jump && player.position.y <= targetFloorY + 0.1) {
        setVelocityY(0.35);
        input.jump = false;
    }
    
    player.position.y += velocityY;
    if (player.position.y > targetFloorY) {
        setVelocityY(velocityY - 0.018);
    } else {
        player.position.y = targetFloorY;
        setVelocityY(0);
    }

    // カメラ追従
    const camX = player.position.x + Math.sin(cameraAngleX) * cameraDist;
    const camZ = player.position.z + Math.cos(cameraAngleX) * cameraDist;
    const camY = player.position.y + 5 + Math.sin(cameraAngleY) * 10;
    
    camera.position.set(camX, camY, camZ);
    camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z);

    renderer.render(scene, camera);
}

animate();
