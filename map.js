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
    return mesh;
}

export function createMap() {
    // 地面：灰色
    createBox(150, 0.1, 150, 0, 0, 0, 0x888888);

    // 青：リスポーン（これまでの指定通り）
    createBox(10, 1, 10, 50, 0.5, 0, 0x0000ff);
    createBox(10, 1, 10, -50, 0.5, 0, 0x0000ff);

    // 緑：一番高い中央タワー
    createBox(15, 30, 15, 0, 15, 0, 0x00ff00);

    // 青：標準高台とL字壁
    createBox(8, 10, 8, 25, 5, 30, 0x0000ff);
    createBox(8, 10, 8, -25, 5, -30, 0x0000ff);

    // L字の壁 (青)
    createBox(15, 12, 3, 30, 6, -25, 0x0000ff);
    createBox(3, 12, 15, 36, 6, -19, 0x0000ff);

    createBox(15, 12, 3, -30, 6, 25, 0x0000ff);
    createBox(3, 12, 15, -36, 6, 19, 0x0000ff);
}
