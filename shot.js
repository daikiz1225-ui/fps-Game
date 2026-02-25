import * as THREE from 'three';
import { scene } from './scene.js';
import { colliders } from './map.js';

const bullets = [];
const paintColor = 0xffff00;

export function shoot(gunPosition, cameraDirection) {
    const geo = new THREE.SphereGeometry(0.3, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: paintColor });
    const sphere = new THREE.Mesh(geo, mat);
    
    // 銃口の高さ付近から発射
    sphere.position.copy(gunPosition);
    sphere.position.y += 1.2;
    
    // カメラの向いている方向に飛ばす
    const velocity = cameraDirection.clone().multiplyScalar(1.2);

    bullets.push({ mesh: sphere, vel: velocity });
    scene.add(sphere);
}

export function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.01; // ゆるやかな重力

        let hit = false;

        // 床判定
        if (b.mesh.position.y <= 0.1) {
            hit = true;
            createPaint(b.mesh.position);
        }

        // 壁（高台）判定
        colliders.forEach(obj => {
            const dx = Math.abs(b.mesh.position.x - obj.mesh.position.x);
            const dz = Math.abs(b.mesh.position.z - obj.mesh.position.z);
            const dy = b.mesh.position.y - obj.h;
            
            // 壁の範囲内に入ったら
            if (dx < obj.sizeW && dz < obj.sizeD && b.mesh.position.y < obj.h) {
                hit = true;
                // 壁に塗る処理は複雑なので一旦「消える」だけにするぜ
            }
        });

        if (hit || b.mesh.position.y < -5) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}

function createPaint(pos) {
    const geo = new THREE.CircleGeometry(1.2, 8);
    const mat = new THREE.MeshLambertMaterial({ color: paintColor });
    const paint = new THREE.Mesh(geo, mat);
    paint.position.set(pos.x, 0.05, pos.z);
    paint.rotation.x = -Math.PI / 2;
    scene.add(paint);
}
