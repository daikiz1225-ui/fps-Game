import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';

createMap();

let cameraAngleX = Math.PI / 2; // 1P側を向くように初期化
let cameraAngleY = 0;
const cameraDist = 12;

function animate() {
    requestAnimationFrame(animate);

    // カメラ回転調整 (iPad用：指を動かした方向に視点が動く)
    // 前回の設定で逆だったら、ここを += に変えるだけでOK
    cameraAngleX += input.look.x * 3; 
    cameraAngleY = Math.max(-0.8, Math.min(0.8, cameraAngleY + input.look.y * 3));
    input.look.x = 0; input.look.y = 0;

    // 移動
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.22;
        player.position.z += Math.cos(moveAngle) * 0.22;
        player.rotation.y = moveAngle;
    } else {
        player.rotation.y = cameraAngleX;
    }

    // 当たり判定 (矩形サイズ対応版)
    let targetFloorY = 0;
    colliders.forEach(obj => {
        const dx = Math.abs(player.position.x - obj.mesh.position.x);
        const dz = Math.abs(player.position.z - obj.mesh.position.z);
        if (dx < obj.sizeW + 0.5 && dz < obj.sizeD + 0.5) {
            if (player.position.y >= obj.h - 0.8) targetFloorY = obj.h;
            else {
                // 壁押し戻し
                player.position.x -= Math.sign(player.position.x - obj.mesh.position.x) * -0.15;
                player.position.z -= Math.sign(player.position.z - obj.mesh.position.z) * -0.15;
            }
        }
    });

    // 重力とジャンプ
    if (input.jump && player.position.y <= targetFloorY + 0.1) {
        setVelocityY(0.4);
        input.jump = false;
    }
    player.position.y += velocityY;
    if (player.position.y > targetFloorY) {
        setVelocityY(velocityY - 0.02);
    } else {
        player.position.y = targetFloorY;
        setVelocityY(0);
    }

    // カメラ
    const camX = player.position.x + Math.sin(cameraAngleX) * cameraDist;
    const camZ = player.position.z + Math.cos(cameraAngleX) * cameraDist;
    const camY = player.position.y + 6 + Math.sin(cameraAngleY) * 10;
    
    camera.position.set(camX, camY, camZ);
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    renderer.render(scene, camera);
}
animate();
