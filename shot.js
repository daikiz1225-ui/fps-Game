import * as THREE from 'three';
import { scene } from './scene.js';
import { colliders } from './map.js';

const bullets = [];
const paintColor = 0xffff00;
// 法線ベクトル用のヘルパー
const upNormal = new THREE.Vector3(0, 1, 0);
const dummy = new THREE.Object3D();

export function shoot(gunPosition, cameraDirection) {
    const geo = new THREE.SphereGeometry(0.3, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: paintColor });
    const sphere = new THREE.Mesh(geo, mat);
    
    // 発射位置も高くする (1.2 -> 1.5)
    sphere.position.copy(gunPosition);
    sphere.position.y += 1.5;
    
    // レティクルが上がった分、少し上向きに撃つ
    const velocity = cameraDirection.clone().multiplyScalar(1.3);
    velocity.y += 0.1; 

    bullets.push({ mesh: sphere, vel: velocity });
    scene.add(sphere);
}

export function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        const prevPos = b.mesh.position.clone(); // 直前の位置を記憶
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.012;

        let hit = false;
        let hitNormal = null;

        // 1. 床判定
        if (b.mesh.position.y <= 0.1 && b.vel.y < 0) {
            hit = true;
            hitNormal = upNormal;
            b.mesh.position.y = 0.1; // めり込み補正
        }

        // 2. 壁判定 (側面)
        if (!hit) {
            colliders.forEach(obj => {
                if (hit) return;
                // 簡易的な衝突チェック
                if (Math.abs(b.mesh.position.x - obj.mesh.position.x) < obj.sizeW &&
                    Math.abs(b.mesh.position.z - obj.mesh.position.z) < obj.sizeD &&
                    b.mesh.position.y > 0 && b.mesh.position.y < obj.h) {
                    
                    hit = true;
                    // どの面に当たったか、直前の位置から推測して法線を決める
                    const dx = prevPos.x - obj.mesh.position.x;
                    const dz = prevPos.z - obj.mesh.position.z;

                    if (Math.abs(dx) / obj.sizeW > Math.abs(dz) / obj.sizeD) {
                        hitNormal = new THREE.Vector3(Math.sign(dx), 0, 0); // 東西の面
                    } else {
                        hitNormal = new THREE.Vector3(0, 0, Math.sign(dz)); // 南北の面
                    }
                }
            });
        }

        if (hit) {
            if (hitNormal) {
                createPaint(b.mesh.position, hitNormal);
            }
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        } else if (b.mesh.position.y < -5) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}

function createPaint(pos, normal) {
    const geo = new THREE.CircleGeometry(1.5, 12);
    // DoubleSideをやめて片面描画にし、点滅を防ぐ
    const mat = new THREE.MeshLambertMaterial({ color: paintColor });
    const paint = new THREE.Mesh(geo, mat);
    
    // 法線方向に少しだけ浮かせて配置（これが絨毯表現！）
    paint.position.copy(pos).add(normal.clone().multiplyScalar(0.02));
    
    // 面に合わせて向きを調整
    if (normal.y > 0.9) {
        paint.rotation.x = -Math.PI / 2; // 床
    } else {
        // 壁：法線方向を向くように回転させるハック
        dummy.position.copy(pos);
        dummy.lookAt(pos.clone().add(normal));
        paint.quaternion.copy(dummy.quaternion);
    }

    scene.add(paint);
}
