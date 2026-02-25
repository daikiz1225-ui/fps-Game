import { scene, camera, renderer } from './scene.js';
import { createMap } from './map.js';
import { input } from './input.js';
import { player, velocityY, setVelocityY } from './player.js';

createMap();

function animate() {
    requestAnimationFrame(animate);

    // 移動処理
    player.position.x += input.move.x * 0.15;
    player.position.z += input.move.y * 0.15;

    // ジャンプ・重力
    if (input.jump && player.position.y <= 0.05) {
        setVelocityY(0.25);
        input.jump = false;
    }
    
    player.position.y += velocityY;
    if (player.position.y > 0) {
        setVelocityY(velocityY - 0.012);
    } else {
        player.position.y = 0;
        setVelocityY(0);
    }

    // 3人称カメラ追従
    camera.position.set(player.position.x, player.position.y + 6, player.position.z + 10);
    camera.lookAt(player.position);

    renderer.render(scene, camera);
}

animate();
