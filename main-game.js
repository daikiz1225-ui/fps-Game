import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { createMap } from './map.js';
import { input } from './input.js';
import { player } from './player.js';
import { shoot, updateBullets } from './shot.js';

createMap();

// 射撃ボタンの作成
const shootBtn = document.createElement('div');
shootBtn.innerHTML = "🔥";
Object.assign(shootBtn.style, {
    position: 'fixed', bottom: '40px', right: '40px',
    width: '100px', height: '100px', borderRadius: '50%',
    background: 'rgba(255,0,0,0.6)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '40px',
    touchAction: 'none', zIndex: '1000'
});
document.body.appendChild(shootBtn);

shootBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion);
    shoot(player.position, dir);
});

let cameraAngleX = Math.PI / 2;
let cameraAngleY = 0;

function animate() {
    requestAnimationFrame(animate);

    // カメラと移動の処理（前回と同様のため省略可だが、更新が必要）
    cameraAngleX += input.look.x * 3;
    cameraAngleY = Math.max(-0.8, Math.min(0.8, cameraAngleY + input.look.y * 3));
    input.look.x = 0; input.look.y = 0;

    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * 0.22;
        player.position.z += Math.cos(moveAngle) * 0.22;
        player.rotation.y = moveAngle;
    }

    // 弾の更新
    updateBullets();

    // カメラ位置更新
    const camX = player.position.x + Math.sin(cameraAngleX) * 12;
    const camZ = player.position.z + Math.cos(cameraAngleX) * 12;
    camera.position.set(camX, player.position.y + 6 + Math.sin(cameraAngleY)*8, camZ);
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    renderer.render(scene, camera);
}
animate();
