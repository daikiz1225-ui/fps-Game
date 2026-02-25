import * as THREE from 'three';
import { scene } from './scene.js';

export const colliders = [];

export function createMap() {
    // 床
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 80),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 青：リスポーン地点 (1P: 右, 2P: 左)
    const spawnData = [
        { x: 45, z: 0, name: '1P_Spawn' },
        { x: -45, z: 0, name: '2P_Spawn' }
    ];
    spawnData.forEach(s => {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 1, 10),
            new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x000055 })
        );
        mesh.position.set(s.x, 0.5, s.z);
        scene.add(mesh);
        colliders.push({ mesh, h: 1, size: 5 });
    });

    // 赤：一番高い中央タワー
    const redTowerH = 30;
    const redTower = new THREE.Mesh(
        new THREE.BoxGeometry(12, redTowerH, 12),
        new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.3 })
    );
    redTower.position.set(0, redTowerH / 2, 0);
    scene.add(redTower);
    colliders.push({ mesh: redTower, h: redTowerH, size: 6 });

    // 黒：普通の高台 (中央タワーの周りに配置)
    const blackPos = [
        { x: 15, z: 15 }, { x: -15, z: 15 },
        { x: 15, z: -15 }, { x: -15, z: -15 }
    ];
    blackPos.forEach(p => {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(8, 10, 8),
            new THREE.MeshStandardMaterial({ color: 0x111111 })
        );
        mesh.position.set(p.x, 5, p.z);
        scene.add(mesh);
        colliders.push({ mesh, h: 10, size: 4 });
    });
}
