import * as THREE from 'three';
import { scene } from './scene.js';
import { colliders } from './map.js';

const bullets = [];
const paintColor = 0xffff00; // 1Pの色（黄色とする）

export function shoot(position, direction) {
    const geo = new THREE.SphereGeometry(0.3, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: paintColor });
    const sphere = new THREE.Mesh(geo, mat);
    
    sphere.position.copy(position);
    sphere.position.y += 1.2; // 銃の高さから発射
    
    const velocity = direction.clone().multiplyScalar(0.8);
    velocity.y += 0.2; // 少し上向きに飛ばす

    bullets.push({ mesh: sphere, vel: velocity });
    scene.add(sphere);
}

export function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.015; // 重力

        // 地面または壁との衝突
        let hit = false;
        if (b.mesh.position.y <= 0.1) {
            hit = true;
            createPaint(b.mesh.position, new THREE.Vector3(0, 1, 0));
        }

        if (hit || b.mesh.position.y < -5) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}

function createPaint(pos, normal) {
    const geo = new THREE.CircleGeometry(1.5, 8);
    const mat = new THREE.MeshLambertMaterial({ color: paintColor, side: THREE.DoubleSide });
    const paint = new THREE.Mesh(geo, mat);
    
    paint.position.copy(pos);
    paint.position.y += 0.05; // 地面より少し上に
    paint.rotation.x = -Math.PI / 2;
    scene.add(paint);
}
