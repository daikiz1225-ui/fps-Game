import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { input } from './input.js';
import { player, state, updatePlayerMode, setVelocityY, velocityY } from './player.js';

// --- 1. 射撃・塗り用データの定義 ---
const bullets = [];
const paintableMeshes = [];
const colliders = [];
const paintColor = 0xffff00;

// --- 2. 射撃ボタンの強制生成 ---
function ensureUI() {
    if (!document.getElementById('shoot-btn')) {
        const btn = document.createElement('div');
        btn.id = 'shoot-btn';
        btn.innerHTML = "🔫";
        Object.assign(btn.style, {
            position: 'fixed', bottom: '160px', right: '60px', width: '90px', height: '90px',
            borderRadius: '50%', background: 'rgba(255,100,0,0.8)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '40px', touchAction: 'none', zIndex: '2000', border: '3px solid #fff'
        });
        document.body.appendChild(btn);
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); input.isShooting = true; });
        btn.addEventListener('touchend', () => { input.isShooting = false; });
    }
}
ensureUI();

// --- 3. 画像（IMG_0668/0669）通りのマップ作成 ---
function createField() {
    // 地面
    const floor = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    floor.position.y = -0.5;
    scene.add(floor);
    paintableMeshes.push(floor);

    // 壁を配置する関数
    function addWall(w, h, d, x, z, color = 0x0000ff) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color }));
        wall.position.set(x, h / 2, z);
        scene.add(wall);
        paintableMeshes.push(wall);
        colliders.push(new THREE.Box3().setFromObject(wall));
    }

    // 画像の中央「2」（広場・赤枠）
    addWall(20, 5, 15, 0, 0, 0x555555);

    // 画像の「L字の壁」2箇所
    addWall(15, 8, 2, -20, 20); // 左下L字の横
    addWall(2, 8, 15, -28.5, 13.5); // 左下L字の縦
    
    addWall(15, 8, 2, 20, -20); // 右上L字の横
    addWall(2, 8, 15, 28.5, -13.5); // 右上L字の縦

    // 画像の直線「3」2箇所
    addWall(2, 10, 15, -15, -15); // 左上の縦棒
    addWall(2, 10, 10, 15, 15);   // 右下の縦棒

    // リスポーン地点（画像の両端の丸）
    addWall(8, 0.2, 8, -40, 0, 0x0000ff); // 1P側
    addWall(8, 0.2, 8, 40, 0, 0x0000ff);  // 2P側
}
createField();

// --- 4. 射撃・塗りシステム ---
function shootInk() {
    if (state.ink < 2) return;
    state.ink -= 1.2;

    const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ color: paintColor }));
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    
    b.position.copy(player.position).y += 1.5;
    const vel = dir.clone().multiplyScalar(1.8);
    vel.y += 0.1;
    bullets.push({ mesh: b, vel: vel, life: 60 });
    scene.add(b);
}

function updateInk() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.add(b.vel);
        b.vel.y -= 0.015;

        // 当たり判定と塗り
        const bBox = new THREE.Box3().setFromObject(b.mesh);
        let hit = false;
        
        paintableMeshes.forEach(m => {
            const mBox = new THREE.Box3().setFromObject(m);
            if (bBox.intersectsBox(mBox)) {
                // 簡易的な塗り：当たったメッシュの色を変える
                m.material.color.set(paintColor);
                hit = true;
            }
        });

        if (hit || b.mesh.position.y < 0 || b.life-- < 0) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}

// --- 5. メインループ ---
let cameraAngleX = Math.PI / 2;

function animate() {
    requestAnimationFrame(animate);

    // 入力：カメラ回転
    cameraAngleX += input.look.x * 4;
    input.look.x = 0;

    // 【修正】イカ速度 60% (0.45 * 0.6 = 0.27)
    let speed = input.isSquid ? 0.27 : 0.18;

    // 移動処理
    if (input.move.x !== 0 || input.move.y !== 0) {
        const moveAngle = Math.atan2(input.move.x, input.move.y) + cameraAngleX;
        player.position.x += Math.sin(moveAngle) * speed;
        player.position.z += Math.cos(moveAngle) * speed;
        player.rotation.y = moveAngle;
    }

    // 射撃実行
    if (input.isShooting && !input.isSquid) {
        if (Math.random() > 0.8) shootInk();
    }

    // 重力と衝突（簡易）
    player.position.y += velocityY;
    if (player.position.y > 0) {
        setVelocityY(velocityY - 0.02);
    } else {
        player.position.y = 0;
        setVelocityY(0);
    }
    if (input.jump && player.position.y <= 0.1) setVelocityY(0.4);

    updateInk();
    updatePlayerMode(input.isSquid);

    // インクUI更新
    const inkBar = document.getElementById('ink-bar');
    if (inkBar) inkBar.style.width = state.ink + "%";

    // 【修正】カメラ固定：上向き
    camera.position.set(
        player.position.x + Math.sin(cameraAngleX) * 12,
        player.position.y + 4,
        player.position.z + Math.cos(cameraAngleX) * 12
    );
    camera.lookAt(player.position.x, player.position.y + 2.5, player.position.z);

    renderer.render(scene, camera);
}
animate();
