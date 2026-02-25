import * as THREE from 'three';
import { scene } from './scene.js';

export const colliders = [];
export const paintableBlocks = [];

function createVoxelWall(width, height, depth, x, y, z, color) {
    for (let ix = 0; ix < width; ix++) {
        for (let iy = 0; iy < height; iy++) {
            for (let iz = 0; iz < depth; iz++) {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(0.95, 0.95, 0.95),
                    new THREE.MeshStandardMaterial({ color: color })
                );
                const px = x + (ix - (width - 1) / 2);
                const py = y + (iy - (height - 1) / 2);
                const pz = z + (iz - (depth - 1) / 2);
                mesh.position.set(px, py, pz);
                scene.add(mesh);
                paintableBlocks.push(mesh);
            }
        }
    }
    // 当たり判定用のボリューム
    colliders.push({ 
        mesh: { position: { x, y, z } }, 
        h: height, sizeW: width / 2, sizeD: depth / 2 
    });
}

export function createMap() {
    // 地面（灰色）
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(150, 150),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 青：リスポーン (右1P / 左2P)
    createVoxelWall(10, 1, 10, 50, 0.5, 0, 0x0000ff);
    createVoxelWall(10, 1, 10, -50, 0.5, 0, 0x0000ff);

    // 緑：中央超高台 (高さ20)
    createVoxelWall(10, 20, 10, 0, 10, 0, 0x00ff00);

    // 青：L字の壁（中央から離して配置）
    createVoxelWall(10, 8, 2, 25, 4, 30, 0x0000ff);
    createVoxelWall(2, 8, 10, 30, 4, 25, 0x0000ff);

    createVoxelWall(10, 8, 2, -25, 4, -30, 0x0000ff);
    createVoxelWall(2, 8, 10, -30, 4, -25, 0x0000ff);
}
