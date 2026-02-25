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
const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 })
);
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0.5, 1.4, 0.4); // 高さを1.4へ
weapon.add(barrel);

player.add(weapon);
player.position.set(50, 1, 0); // 1Pリスポーン地点
scene.add(player);

export let velocityY = 0;
export function setVelocityY(v) { velocityY = v; }
