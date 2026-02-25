import * as THREE from 'three';
import { scene, camera } from './scene.js';

export const player = new THREE.Group();
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
body.position.y = 1;
player.add(body);

// --- かっこいい水鉄砲 (Water Gun) ---
const weapon = new THREE.Group();

// 銃身（メインボディ）
const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
);
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0.4, 1.2, 0.5);
weapon.add(barrel);

// インクタンク
const tank = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 })
);
tank.position.set(0.4, 1.4, 0.2);
weapon.add(tank);

player.add(weapon);
scene.add(player);

export let velocityY = 0;
export function setVelocityY(v) { velocityY = v; }
