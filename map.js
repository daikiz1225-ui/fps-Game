import * as THREE from 'three';
import { scene } from './scene.js';

export const colliders = [];

export function createMap() {
    // ベース地面
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 「リ」の字リスポーン地点（1：高、2：中、3：低）
    const spawnData = [
        { h: 15, z: -25, color: 0xff0000 }, // リ1 (一番高い)
        { h: 10, z: 0, color: 0xffaa00 },   // リ2
        { h: 5, z: 25, color: 0xffff00 }    // リ3
    ];

    spawnData.forEach((data, i) => {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(10, data.h, 10),
            new THREE.MeshStandardMaterial({ color: data.color })
        );
        box.position.set(-25, data.h / 2, data.z);
        scene.add(box);
        colliders.push({ mesh: box, h: data.h, size: 5 });
    });

    // 超高台（中央）
    const towerH = 20; // さらに高く！
    const tower = new THREE.Mesh(
        new THREE.BoxGeometry(12, towerH, 12),
        new THREE.MeshStandardMaterial({ color: 0x4444ff })
    );
    tower.position.set(10, towerH / 2, 0);
    scene.add(tower);
    colliders.push({ mesh: tower, h: towerH, size: 6 });
}
