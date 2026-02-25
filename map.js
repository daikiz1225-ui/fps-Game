import * as THREE from 'three';
import { scene } from './scene.js';

export const colliders = []; // 当たり判定用の箱リスト

export function createMap() {
    // 地面
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x55bb55 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 高い高台
    const platformGeom = new THREE.BoxGeometry(10, 8, 10);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.set(0, 4, 0); // 高さを4（半分）に設定して地面に接地
    scene.add(platform);
    
    // 当たり判定リストに追加
    colliders.push(platform);
}
