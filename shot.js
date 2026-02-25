import * as THREE from 'three';
import { scene } from './scene.js';
import { paintableBlocks } from './map.js';

const bullets = [];
const paintColor = 0xffff00; // 黄色インク

export function shoot(gunPosition, cameraDirection) {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: paintColor })
    );
    sphere.position.copy(gunPosition).y += 1.6;
    
    // 射程：スピード2.0、上向き補正
    const velocity = cameraDirection.clone().multiplyScalar(2.0);
    velocity.y += 0.15; 

    bullets.push({ mesh: sphere, vel: velocity, life: 120 });
    scene.add(sphere);
}

export function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.008; // ゆるやかな重力
        b.life--;

        let hit = false;
        // ブロック衝突・塗り判定
        for (let block of paintableBlocks) {
            if (b.mesh.position.distanceTo(block.position) < 1.1) {
                block.material.color.set(paintColor);
                hit = true;
                break;
            }
        }

        if (hit || b.mesh.position.y <= 0 || b.life <= 0) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}
