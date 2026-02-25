import * as THREE from 'three';
import { scene } from './scene.js';
import { paintableBlocks } from './map.js';
import { state } from './player.js';

const bullets = [];
const paintColor = 0xffff00;

export function shoot(gunPosition, cameraDirection) {
    if (state.ink < 2) return;
    state.ink -= 1.5;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: paintColor })
    );
    sphere.position.copy(gunPosition).y += 1.6;
    
    const velocity = cameraDirection.clone().multiplyScalar(2.2);
    velocity.y += 0.1; 

    bullets.push({ mesh: sphere, vel: velocity, life: 80 });
    scene.add(sphere);
}

export function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.015;

        let hit = false;
        // 近いブロックを検索して塗る
        for (let block of paintableBlocks) {
            if (b.mesh.position.distanceTo(block.position) < 1.3) {
                block.material.color.set(paintColor);
                hit = true;
                break;
            }
        }

        if (hit || b.mesh.position.y < -1 || b.life-- < 0) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}
