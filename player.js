import * as THREE from 'three';
import { scene } from './scene.js';

export const player = new THREE.Group();
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff8800 })
);
body.position.y = 1;
player.add(body);
scene.add(player);

export let velocityY = 0;
export function setVelocityY(v) { velocityY = v; }
