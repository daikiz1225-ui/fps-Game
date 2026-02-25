import * as THREE from 'three';
import { scene } from './scene.js';

export function createMap() {
    // 地面
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 範囲の柵（赤色で見やすく）
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const positions = [[0, -50], [0, 50], [-50, 0], [50, 0]];
    positions.forEach((pos, i) => {
        const fence = new THREE.Mesh(new THREE.BoxGeometry(i < 2 ? 100 : 1, 2, i < 2 ? 1 : 100), fenceMat);
        fence.position.set(pos[0], 1, pos[1]);
        scene.add(fence);
    });

    // 中央の高台
    const platform = new THREE.Mesh(
        new THREE.BoxGeometry(15, 4, 15),
        new THREE.MeshStandardMaterial({ color: 0x4444ff })
    );
    platform.position.set(0, 2, 0);
    scene.add(platform);
}
