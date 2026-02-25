import * as THREE from 'three';
import { scene } from './scene.js';

export const player = new THREE.Group();
export const state = {
    ink: 100,
    isOnMyInk: false
};

// ヒト形態
const humanBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
humanBody.position.y = 1;
player.add(humanBody);

// イカ形態（平べったい球）
const squidBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
squidBody.scale.set(1, 0.3, 1.5);
squidBody.position.y = 0.2;
squidBody.visible = false;
player.add(squidBody);

player.position.set(30, 1, 0); 
scene.add(player);

export function updatePlayerMode(isSquid) {
    humanBody.visible = !isSquid;
    squidBody.visible = isSquid;
}

export let velocityY = 0;
export function setVelocityY(v) { velocityY = v; }
