import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { input } from './input.js';

// --- 1. プレイヤーと状態の定義（player.jsが壊れていても動くように再定義） ---
const player = new THREE.Group();
const human = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1, 4, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
human.position.y = 1;
const squid = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffff00 }));
squid.scale.set(1, 0.3, 1.5);
squid.position.y = 0.2;
squid.visible = false;
player.add(human, squid);
scene.add(player);

let inkAmount = 100;
let velY = 0;

// --- 2. 射撃ボタンとUIの強制復活 ---
function setupUI() {
    // 既存のボタンを掃除
    const oldBtn = document.getElementById('shoot-btn');
    if (oldBtn) oldBtn.remove();

    const btn = document.createElement('div');
    btn.id = 'shoot-btn';
    btn.innerHTML = "🔫";
    Object.assign(btn.style, {
        position: 'fixed', bottom: '160px', right: '60px', width: '90px', height: '90px',
        borderRadius: '50%', background: 'orange', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '40px', 
        zIndex: '3000', border: '4px solid white', pointerEvents: 'auto', touchAction: 'none'
    });
    document.body.appendChild(btn);

    btn.addEventListener('touchstart', (e) => { e.preventDefault(); input.isShooting = true; });
    btn.addEventListener('touchend', () => { input.isShooting = false; });
}
setupUI();

// --- 3. 画像（IMG_0668/0669）通りのマップ配置 ---
const paintableMeshes = [];
function buildMap() {
    // 地面
    const floor = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    floor.position.y = -0.5;
    scene.add(floor);
    paintableMeshes.push(floor);

    // 壁を作る関数
    const addBox = (w, h, d, x, z, col = 0x0000ff) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: col }));
        box.position.set(x, h/2, z);
        scene.add(box);
        paintableMeshes.push(box);
    };

    addBox(20, 4, 15, 0, 0, 0x777777); // 中央広場
    addBox(15, 6, 2, -20, 20);        // L字1
    addBox(2, 6, 15, -28, 13);        // L字1
    addBox(15, 6, 2, 20, -20);        // L字2
    addBox(2, 6, 15, 28, -13);        // L字2
}
buildMap();

// --- 4. 射撃システム ---
const bullets = [];
function fire() {
    if (inkAmount < 2) return;
    inkAmount -= 1.5;
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    b.position.copy(player.position).y += 1.2;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    bullets.push({ mesh: b, vel: dir.multiplyScalar(1.5).add(new THREE.Vector3(0, 0.1, 0)), life: 100 });
    scene.add(b);
}

// --- 5. メインループ ---
let camAngle = Math.PI / 2;

function animate() {
    requestAnimationFrame(animate);

    // カメラ回転
    camAngle += input.look.x * 4;
    input.look.x = 0;

    // イカ速度 60% (0.25程度)
    let speed = input.isSquid ? 0.25 : 0.15;
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveA = Math.atan2(input.move.x, input.move.y) + camAngle;
        player.position.x += Math.sin(moveA) * speed;
        player.position.z += Math.cos(moveA) * speed;
        player.rotation.y = moveA;
    }

    // モード切り替え
    human.visible = !input.isSquid;
    squid.visible = input.isSquid;

    // 射撃
    if (input.isShooting && !input.isSquid) {
        if (Math.random() > 0.8) fire();
    }

    // 弾の更新と塗り
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.01;
        if (b.mesh.position.y < 0 || b.life-- < 0) {
            paintableMeshes.forEach(m => {
                if (b.mesh.position.distanceTo(m.position) < 5) m.material.color.set(0xffff00);
            });
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }

    // UI更新
    const bar = document.getElementById('ink-bar');
    if (bar) bar.style.width = inkAmount + "%";

    // カメラ固定（上向き）
    camera.position.set(
        player.position.x + Math.sin(camAngle) * 12,
        player.position.y + 5,
        player.position.z + Math.cos(camAngle) * 12
    );
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    renderer.render(scene, camera);
}
animate();
