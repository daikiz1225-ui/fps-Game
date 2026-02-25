import * as THREE from 'three';
import { scene } from './scene.js';

export const player = new THREE.Group();

// プレイヤー本体
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
body.position.y = 1;
player.add(body);

// 水鉄砲（メカニカルなデザイン）
const weapon = new THREE.Group();
const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 })
);
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0.5, 1.2, 0.4);
weapon.add(barrel);

const tank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 })
);
tank.position.set(0.5, 1.4, 0.1);
weapon.add(tank);

player.add(weapon);

// 1Pリスポーン地点 (右側) に配置
player.position.set(45, 1, 0); 
scene.add(player);

export let velocityY = 0;
export function setVelocityY(v) { velocityY = v; }
