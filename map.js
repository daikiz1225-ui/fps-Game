import * as THREE from 'three';
import { scene } from './scene.js';

export const colliders = [];
export const paintableBlocks = [];

function createVoxelWall(width, height, depth, x, y, z, color, isFloor = false) {
    for (let ix = 0; ix < width; ix++) {
        for (let iy = 0; iy < height; iy++) {
            for (let iz = 0; iz < depth; iz++) {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(isFloor ? 1.9 : 0.95, isFloor ? 0.4 : 0.95, isFloor ? 1.9 : 0.95),
                    new THREE.MeshStandardMaterial({ color: color })
                );
                // 配置間隔の調整
                const px = x + (ix - (width - 1) / 2) * (isFloor ? 2 : 1);
                const py = y + (iy - (height - 1) / 2) * (isFloor ? 0.4 : 1);
                const pz = z + (iz - (depth - 1) / 2) * (isFloor ? 2 : 1);
                mesh.position.set(px, py, pz);
                scene.add(mesh);
                paintableBlocks.push(mesh);
            }
        }
    }
    // キャラクターの当たり判定
    if (!isFloor) {
        colliders.push({ 
            pos: new THREE.Vector3(x, y, z), 
            h: height, 
            sizeW: width / 2, 
            sizeD: depth / 2 
        });
    }
}

export function createMap() {
    // 地面（タイルブロック）
    createVoxelWall(40, 1, 40, 0, -0.2, 0, 0x888888, true);

    // 1Pリスポーン (青)
    createVoxelWall(10, 1, 10, 50, 0.2, 0, 0x0000ff);
    // 2Pリスポーン (青)
    createVoxelWall(10, 1, 10, -50, 0.2, 0, 0x0000ff);

    // 中央：緑の超高台
    createVoxelWall(10, 20, 10, 0, 10, 0, 0x00ff00);

    // 青：L字の壁1
    createVoxelWall(10, 8, 2, 25, 4, 30, 0x0000ff);
    createVoxelWall(2, 8, 10, 31, 4, 26, 0x0000ff);

    // 青：L字の壁2
    createVoxelWall(10, 8, 2, -25, 4, -30, 0x0000ff);
    createVoxelWall(2, 8, 10, -31, 4, -26, 0x0000ff);
}
