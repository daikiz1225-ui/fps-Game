import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';

createMap();

let cameraAngleX = 0;
let cameraAngleY = 0;
const cameraDist = 12; // 高台が高いのでカメラを少し引く

function animate() {
    requestAnimationFrame(animate);

    // カメラ回転 (反転反映済み)
    cameraAngleX += input.look.x; 
    cameraAngleY = Math.max(-Math.PI/3, Math.min(Math.PI/3, cameraAngleY + input.look.y));
    input.look.x = 0; input.look.y = 0;

    // カメラ基準移動
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.18;
        player.position.z += Math.cos(moveAngle) * 0.18;
    }

    // 地面・高台の高さ判定
    let targetFloorY = 0;
    colliders.forEach(obj => {
        const dx = Math.abs(player.position.x - obj.mesh.position.x);
        const dz = Math.abs(player.position.z - obj.mesh.position.z);
        if (dx < obj.size && dz < obj.size) {
            if (player.position.y >= obj.h - 0.5) {
                targetFloorY = obj.h;
            } else {
                // 壁にぶつかったら押し戻す
                player.position.x -= Math.sign(player.position.x - obj.mesh.position.x) * -0.1;
                player.position.z -= Math.sign(player.position.z - obj.mesh.position.z) * -0.1;
            }
        }
    });

    // ジャンプ処理
    if (input.jump && player.position.y <= targetFloorY + 0.05) {
        setVelocityY(0.3);
        input.jump = false;
    }
    
    player.position.y += velocityY;
    if (player.position.y > targetFloorY) {
        setVelocityY(velocityY - 0.015);
    } else {
        player.position.y = targetFloorY;
        setVelocityY(0);
    }

    // カメラ追従
    const camX = player.position.x + Math.sin(cameraAngleX) * cameraDist;
    const camZ = player.position.z + Math.cos(cameraAngleX) * cameraDist;
    const camY = player.position.y + 6 + Math.sin(cameraAngleY) * (cameraDist * 0.5);
    
    camera.position.set(camX, camY, camZ);
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    renderer.render(scene, camera);
}

animate();
