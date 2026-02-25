import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap, colliders } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';

createMap();

let cameraAngleX = 0;
let cameraAngleY = 0;
const cameraDist = 8;

function animate() {
    requestAnimationFrame(animate);

    // 1. カメラ回転の計算
    cameraAngleX -= input.look.x * 2.0; 
    cameraAngleY = Math.max(-Math.PI/3, Math.min(Math.PI/3, cameraAngleY - input.look.y * 2.0));
    input.look.x = 0; input.look.y = 0; // リセット

    // 2. カメラ基準の移動
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.15;
        player.position.z += Math.cos(moveAngle) * 0.15;
    }

    // 3. ジャンプと簡易当たり判定（高台チェック）
    if (input.jump && player.position.y <= 0.05) {
        setVelocityY(0.25);
        input.jump = false;
    }
    
    let nextY = player.position.y + velocityY;
    
    // 高台の上に乗る判定
    let onPlatform = false;
    colliders.forEach(obj => {
        const dx = Math.abs(player.position.x - obj.position.x);
        const dz = Math.abs(player.position.z - obj.position.z);
        if (dx < 5.5 && dz < 5.5) { // 高台の幅(10/2) + プレイヤー半径
            if (player.position.y >= 7.9) { // 高台の高さ
                nextY = Math.max(nextY, 8);
                onPlatform = true;
            } else {
                // 横の壁判定（簡易的に押し戻す）
                player.position.x -= input.move.x * 0.16;
                player.position.z -= input.move.y * 0.16;
            }
        }
    });

    player.position.y = nextY;
    if (player.position.y > (onPlatform ? 8 : 0)) {
        setVelocityY(velocityY - 0.012);
    } else {
        player.position.y = onPlatform ? 8 : 0;
        setVelocityY(0);
    }

    // 4. カメラの追従（プレイヤーの後ろに固定）
    const camX = player.position.x + Math.sin(cameraAngleX) * cameraDist;
    const camZ = player.position.z + Math.cos(cameraAngleX) * cameraDist;
    const camY = player.position.y + 4 + Math.sin(cameraAngleY) * cameraDist;
    
    camera.position.set(camX, camY, camZ);
    camera.lookAt(player.position.x, player.position.y + 1, player.position.z);

    renderer.render(scene, camera);
}

animate();
