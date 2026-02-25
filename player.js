import * as THREE from 'three';
import { scene } from './scene.js';

export const player = new THREE.Group();
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
body.position.y = 1;
player.add(body);

const weapon = new THREE.Group();
// 銃の位置を少し上げる (1.2 -> 1.4)
const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 })
);
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0.5, 1.4, 0.4);
weapon.add(barrel);

// タンクも上げる (1.4 -> 1.6)
const tank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 })
);
tank.position.set(0.5, 1.6, 0.1);
weapon.add(tank);

player.add(weapon);
player.position.set(45, 1, 0); 
scene.add(player);

export let velocityY = 0;
export function setVelocityY(v) { velocityY = v; }
