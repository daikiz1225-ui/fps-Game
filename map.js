import * as THREE from 'three';
import { scene } from './scene.js';

export const colliders = [];

function createBox(w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color: color })
    );
    mesh.position.set(x, y, z);
    scene.add(mesh);
    colliders.push({ mesh, h: h, sizeW: w/2, sizeD: d/2 });
}

export function createMap() {
    // 床
    createBox(120, 0.1, 80, 0, 0, 0, 0x222222);

    // 青：リスポーン (1P:右, 2P:左)
    createBox(10, 1, 10, 45, 0.5, 0, 0x0000ff);
    createBox(10, 1, 10, -45, 0.5, 0, 0x0000ff);

    // 赤：中央超高台 (高さ30)
    createBox(12, 30, 12, 0, 15, 0, 0xff0000);

    // 黒：標準高台とL字壁 (中央から離して配置)
    // 通常の黒高台
    createBox(8, 10, 8, 20, 5, 25, 0x111111);
    createBox(8, 10, 8, -20, 5, -25, 0x111111);

    // L字の壁 1 (右上エリア)
    createBox(12, 10, 3, 25, 5, -20, 0x111111); // 横壁
    createBox(3, 10, 12, 30, 5, -15, 0x111111); // 縦壁

    // L字の壁 2 (左下エリア)
    createBox(12, 10, 3, -25, 5, 20, 0x111111); // 横壁
    createBox(3, 10, 12, -30, 5, 15, 0x111111); // 縦壁
}
