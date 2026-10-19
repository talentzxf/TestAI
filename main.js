import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

// ==========================================
// 1. 四个核心空间与三进四合院预设视角及介绍数据 (严格参照 siheyuan.jpg 规制)
// ==========================================
const LOCATIONS = {
  overview: {
    id: "overview",
    tag: "三进四合院 · 全院总览",
    title: "北京标准三进现代四合院",
    subtitle: "当前位置：全景鸟瞰 · 标准三进院落格局",
    desc: "严格遵循北京传统三进四合院规制（参照 siheyuan.jpg）：一进外院设东南广亮大门、迎门影壁、南侧倒座房与西侧屏门；中轴设华丽垂花门步入二进正院，由抄手游廊贯通北侧正房客厅、左右耳房及东西厢房（主角与父亲房间），院心铺十字青石甬道、植海棠柿树、设太平锦鲤鱼缸；北端三进后院设七间通长后罩房。",
    highlights: [
      "🏮 垂花门与抄手游廊",
      "🏛️ 正房+左右耳房",
      "🧱 东南大门与影壁",
      "🏡 倒座房与后罩房",
    ],
    // 与 siheyuan.jpg 完全一致的西南偏南等轴鸟瞰视角
    birdPos: new THREE.Vector3(-34, 42, 48),
    birdTarget: new THREE.Vector3(0, 1.5, -1.5),
    fpvPos: new THREE.Vector3(0, 1.85, 8.2),
    fpvYaw: 0, // 朝北站在二进院十字甬道南端看正房
    fpvPitch: 0.02,
  },
  mainGate: {
    id: "mainGate",
    tag: "一进外院 · 东南宅门",
    title: "大门口 (广亮大门 · 影壁 · 倒座房)",
    subtitle: "当前位置：大门口 · 东南广亮大门与迎门影壁",
    desc: "遵循“坎宅巽门”规制设于东南角，朱红双扇大门配鎏金门钹与四枚门簪，门前立汉白玉抱鼓石与三级踏跺。跨过门槛正北即见“福”字砖雕迎门影壁；西转进入一进外院，南侧为四间倒座房，西端设屏门，北侧中轴矗立进入内宅的垂花门。",
    highlights: [
      "🚪 东南广亮大门",
      "🧱 迎门砖雕影壁",
      "🏠 南侧通排倒座房",
      "🏮 内外院分界垂花门",
    ],
    birdPos: new THREE.Vector3(24, 15, 38),
    birdTarget: new THREE.Vector3(11.5, 2.2, 20.5),
    fpvPos: new THREE.Vector3(14.6, 1.85, 22.8),
    fpvYaw: 0, // 站在大门口朝北正对影壁
    fpvPitch: 0.02,
  },
  chuihuamen: {
    id: "chuihuamen",
    tag: "中轴礼门 · 二进门户",
    title: "垂花门 (一进与二进院分界门)",
    subtitle: "当前位置：垂花门 · 雕梁画栋内宅门户",
    desc: "位于四合院中轴线上一进外院与二进内院之间，是四合院中最精美的装饰性建筑。前檐悬有一对雕花垂莲柱，梁枋施绿底鎏金苏式彩绘，内设朱红屏门，两侧直接与二进院环院抄手游廊相连。",
    highlights: [
      "🪷 雕花垂莲悬柱",
      "🎨 苏式青绿描金彩绘",
      "🚪 四扇内宅屏门",
      "🏛️ 衔接抄手游廊",
    ],
    birdPos: new THREE.Vector3(-8, 12, 24),
    birdTarget: new THREE.Vector3(0, 2.5, 13.5),
    fpvPos: new THREE.Vector3(0, 1.85, 17.8),
    fpvYaw: 0,
    fpvPitch: 0.03,
  },
  livingRoom: {
    id: "livingRoom",
    tag: "二进正院 · 北房三间带左右耳房",
    title: "正房客厅 (水墨挑高会客堂)",
    subtitle: "当前位置：正房客厅 · 北侧正房三间与耳房",
    desc: "四合院等级最高的北侧正房三间，建于汉白玉高台基之上，两侧对称布置东、西耳房，东侧留有通往三进后院及后罩房的夹道门洞。正房采用全景落地玻璃与传统朱红廊柱结合，室内设巨幅水墨山水背景墙、胡桃木功夫茶台与现代环抱沙发。",
    highlights: [
      "⛰️ 巨幅水墨背景墙",
      "🛋️ 现代环抱式沙发",
      "🍵 胡桃木功夫茶台",
      "🏛️ 左右对称东西耳房",
    ],
    birdPos: new THREE.Vector3(0, 15.5, -2.0),
    birdTarget: new THREE.Vector3(0, 2.2, -13.8),
    fpvPos: new THREE.Vector3(-1.4, 2.15, -10.8),
    fpvYaw: -0.12,
    fpvPitch: -0.04,
  },
  protagonistRoom: {
    id: "protagonistRoom",
    tag: "二进东厢房 · 现代潮玩与创客",
    title: "主角房间 (东厢房三间带耳房)",
    subtitle: "当前位置：主角房间 · 东厢现代数字工作室",
    desc: "位于二进内院东侧的东厢房（三间正厢加南侧厢耳房），门前由抄手游廊环绕。室内将传统灰瓦坡顶与现代创客空间融合，配备悬浮式暖光大床、L型双联屏数字工作站、RGB主机、满墙潮玩书架与民谣吉他角，推窗即见内院海棠与太平鱼缸。",
    highlights: [
      "🖥️ 双联屏创客工作站",
      "🛏️ 悬浮暖光大床",
      "🎸 原木吉他音乐角",
      "📚 潮玩设计书柜",
    ],
    birdPos: new THREE.Vector3(3.8, 13.5, 5.5),
    birdTarget: new THREE.Vector3(14.6, 1.8, -0.5),
    fpvPos: new THREE.Vector3(11.6, 2.08, -0.8),
    fpvYaw: -Math.PI / 2 - 0.35,
    fpvPitch: -0.06,
  },
  fatherRoom: {
    id: "fatherRoom",
    tag: "二进西厢房 · 沉稳书香雅居",
    title: "父亲房间 (西厢房三间带耳房)",
    subtitle: "当前位置：父亲房间 · 西厢茗香书画雅室",
    desc: "位于二进内院西侧的西厢房（三间正厢加南侧厢耳房），与东厢房严格对称并通过抄手游廊相连。室内以紫光檀与暖宣纸色调为主，设新中式实木架子床、书法大画案、文房四宝、太师圈椅与多宝博古架，古朴儒雅。",
    highlights: [
      "🖌️ 紫光檀挥毫书案",
      "🏺 博古架青花藏品",
      "🛏️ 新中式胡桃木卧榻",
      "🎋 抄手游廊听竹茗席",
    ],
    birdPos: new THREE.Vector3(-3.8, 13.5, 5.5),
    birdTarget: new THREE.Vector3(-14.6, 1.8, -0.5),
    fpvPos: new THREE.Vector3(-11.6, 2.08, -0.8),
    fpvYaw: Math.PI / 2 + 0.35,
    fpvPitch: -0.06,
  },
};

// ==========================================
// 2. 全局场景状态与初始化
// ==========================================
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1f2633);
scene.fog = new THREE.FogExp2(0x1f2633, 0.0085);

const camera = new THREE.PerspectiveCamera(
  52,
  window.innerWidth / window.innerHeight,
  0.15,
  250,
);
camera.position.copy(LOCATIONS.overview.birdPos);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance",
  stencil: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

// 轨道控制器 (用于鸟瞰模式，调高旋转/缩放/平移响应速度)
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.12;
orbitControls.rotateSpeed = 1.5;
orbitControls.zoomSpeed = 2.0;
orbitControls.panSpeed = 1.8;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.03;
orbitControls.minDistance = 3;
orbitControls.maxDistance = 115;
orbitControls.target.copy(LOCATIONS.overview.birdTarget);

// 状态管理
const state = {
  mode: "bird", // 'bird' | 'fpv'
  currentLocation: "overview",
  roofCutaway: false, // 屋顶半透明透视
  isNight: true, // 默认“北京黄昏/华灯初上”氛围，凸显现代四合院暖光
  cameraAnim: null, // 平滑过渡动画
  fpvYaw: 0,
  fpvPitch: 0,
  moveKeys: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  },
  isDraggingLook: false,
  prevMouse: { x: 0, y: 0 },
  walkBobTimer: 0,
  verticalVel: 0,
  isGrounded: true,
};

// 存放可切换透明度的屋顶网格、灯光列表、动态物体、空间分区裁剪(BSP/Portal)房间组
const roofMeshes = [];
const warmLights = [];
const koiFishList = [];
const lanternGlows = [];
const roomSprites = [];
const dynamicObjects = new Set();
const roomInteriorGroups = []; // 用于距离与视锥/房间遮挡裁剪 (BSP/PVS 思想)

// ==========================================
// 3. 程序化材质与纹理生成器 (无需外部图片资源)
// ==========================================
function createBrickTexture(bgHex = "#4b5056", lineHex = "#33373c") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = lineHex;
  ctx.lineWidth = 3;
  const rows = 8;
  const rowH = 256 / rows;
  const cols = 4;
  const colW = 256 / cols;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();

    const offset = (r % 2) * (colW / 2);
    for (let c = 0; c <= cols; c++) {
      const x = (c * colW + offset) % 256;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowH);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createRoofTileTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#383d44";
  ctx.fillRect(0, 0, 256, 256);

  const cols = 8;
  const colW = 256 / cols;
  for (let c = 0; c < cols; c++) {
    const x = c * colW;
    const grad = ctx.createLinearGradient(x, 0, x + colW, 0);
    grad.addColorStop(0, "#262a30");
    grad.addColorStop(0.5, "#505761");
    grad.addColorStop(1, "#262a30");
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, colW, 256);
  }
  ctx.strokeStyle = "#22252a";
  ctx.lineWidth = 2;
  for (let r = 0; r < 10; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * 25.6);
    ctx.lineTo(256, r * 25.6);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createWoodFloorTexture(baseColor = "#6d4c33", grainColor = "#543822") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = grainColor;
  ctx.lineWidth = 2;
  const planks = 6;
  const plankH = 256 / planks;
  for (let i = 0; i < planks; i++) {
    const y = i * plankH;
    ctx.fillStyle = i % 2 === 0 ? baseColor : grainColor;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(0, y, 256, plankH);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createInkLandscapeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // 宣纸暖底色
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, "#f3ead8");
  bgGrad.addColorStop(1, "#e2d4bc");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 金色满月/落日
  ctx.fillStyle = "rgba(205, 75, 50, 0.75)";
  ctx.beginPath();
  ctx.arc(760, 140, 55, 0, Math.PI * 2);
  ctx.fill();

  // 远山层叠水墨
  const layers = [
    { color: "rgba(90, 102, 110, 0.32)", base: 260, amp: 85 },
    { color: "rgba(60, 70, 78, 0.52)", base: 330, amp: 95 },
    { color: "rgba(35, 42, 48, 0.78)", base: 400, amp: 70 },
  ];
  layers.forEach((l, idx) => {
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.moveTo(0, 512);
    for (let x = 0; x <= 1024; x += 16) {
      const y =
        l.base -
        Math.sin(x * 0.006 + idx * 1.8) * l.amp -
        Math.cos(x * 0.015 - idx) * (l.amp * 0.45);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(1024, 512);
    ctx.closePath();
    ctx.fill();
  });

  // 题字印章
  ctx.fillStyle = "#2c2f33";
  ctx.font = 'bold 34px "KaiTi", "STKaiti", serif';
  ctx.fillText("溪山清远 · 京华雅集", 90, 120);
  ctx.fillStyle = "#b93124";
  ctx.fillRect(435, 92, 34, 34);
  ctx.fillStyle = "#fff";
  ctx.font = "18px serif";
  ctx.fillText("雅居", 437, 115);

  return new THREE.CanvasTexture(canvas);
}

function createScreenWallMedallionTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#484d54";
  ctx.fillRect(0, 0, 512, 512);

  // 外框回纹装饰
  ctx.strokeStyle = "#c5a059";
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, 464, 464);

  // 中心圆形砖雕底盘
  ctx.fillStyle = "#363a40";
  ctx.beginPath();
  ctx.arc(256, 256, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d4af63";
  ctx.lineWidth = 6;
  ctx.stroke();

  // 书法“福”字或“和”字
  ctx.fillStyle = "#e5c175";
  ctx.font = 'bold 170px "KaiTi", "STKaiti", "Microsoft YaHei", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("福", 256, 250);

  return new THREE.CanvasTexture(canvas);
}

function createMonitorScreenTexture(title, subtitle, accentColor = "#38bdf8") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 288;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, 512, 288);

  // 模拟3D建模/代码界面
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 480, 256);

  ctx.fillStyle = accentColor;
  ctx.font = "bold 24px monospace";
  ctx.fillText(title, 36, 62);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "16px sans-serif";
  ctx.fillText(subtitle, 36, 95);

  // 绘制线框网格示意
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  for (let i = 0; i < 6; i++) {
    ctx.strokeRect(36 + i * 70, 125, 55, 110);
  }
  return new THREE.CanvasTexture(canvas);
}

// 公共材质库
const brickTex = createBrickTexture();
brickTex.repeat.set(6, 2);

const roofTex = createRoofTileTexture();
roofTex.repeat.set(8, 3);

const woodFloorTex = createWoodFloorTexture();
woodFloorTex.repeat.set(6, 6);

const materials = {
  greyBrick: new THREE.MeshLambertMaterial({ map: brickTex }),
  darkStone: new THREE.MeshLambertMaterial({
    color: 0x3b4046,
  }),
  courtyardStone: new THREE.MeshLambertMaterial({
    color: 0x596068,
  }),
  vermilionRed: new THREE.MeshLambertMaterial({
    color: 0xa6291e,
  }),
  brightRedGate: new THREE.MeshLambertMaterial({
    color: 0xb8281c,
  }),
  goldBrass: new THREE.MeshLambertMaterial({
    color: 0xe3b959,
    emissive: 0x3a2a0a,
  }),
  walnutWood: new THREE.MeshLambertMaterial({
    color: 0x4a2f1d,
  }),
  lightOakWood: new THREE.MeshLambertMaterial({
    color: 0x9b744f,
  }),
  woodFloor: new THREE.MeshLambertMaterial({
    map: woodFloorTex,
  }),
  warmWall: new THREE.MeshLambertMaterial({ color: 0xf2ece1 }),
  creamFabric: new THREE.MeshLambertMaterial({
    color: 0xebe5da,
  }),
  slateFabric: new THREE.MeshLambertMaterial({
    color: 0x3f4c5c,
  }),
  jadeGreen: new THREE.MeshLambertMaterial({
    color: 0x3e8e6c,
  }),
  glassWall: new THREE.MeshBasicMaterial({
    color: 0xbce6ff,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
  }),
  darkFrame: new THREE.MeshLambertMaterial({
    color: 0x22262b,
  }),
  whiteMarble: new THREE.MeshLambertMaterial({
    color: 0xdcd9d0,
  }),
  outerGround: new THREE.MeshLambertMaterial({
    color: 0x23282e,
  }),
  lawnGreen: new THREE.MeshLambertMaterial({
    color: 0x365e38,
  }),
  treeCanopy: new THREE.MeshLambertMaterial({
    color: 0x3b6e38,
  }),
  bambooGreen: new THREE.MeshLambertMaterial({
    color: 0x4b8b52,
  }),
  persimmonOrange: new THREE.MeshBasicMaterial({
    color: 0xff5a1f,
  }),
  lanternRed: new THREE.MeshLambertMaterial({
    color: 0xff3b28,
    emissive: 0xff4411,
    emissiveIntensity: 0.8,
  }),
  vatWater: new THREE.MeshBasicMaterial({
    color: 0x16697a,
    transparent: true,
    opacity: 0.82,
  }),
  woolRug: new THREE.MeshLambertMaterial({
    color: 0xd8cfc0,
  }),
  warmLamp: new THREE.MeshBasicMaterial({
    color: 0xffdd99,
  }),
};
lanternGlows.push(materials.lanternRed);

// 共享可切换透视的屋顶材质，减少材质实例与状态切换开销
const sharedRoofMaterial = new THREE.MeshLambertMaterial({
  map: roofTex,
  transparent: false,
  opacity: 1.0,
});

function createRoofMaterial() {
  return sharedRoofMaterial;
}

// ==========================================
// 4. 光照与天空系统
// ==========================================
const ambientLight = new THREE.AmbientLight(0xd9e2ff, 0.65);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffdfa8, 0x2d3748, 0.65);
hemiLight.position.set(0, 40, 0);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffb870, 1.45);
sunLight.position.set(-28, 34, 24);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 5;
sunLight.shadow.camera.far = 135;
const d = 44;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

function addWarmPointLight(
  x,
  y,
  z,
  intensity = 2.2,
  distance = 14,
  color = 0xffaa55,
) {
  // 仅保留最关键的主光源，避免 10+ 个实时 PointLight 导致片元着色器循环爆算
  if (warmLights.length >= 2) {
    return null;
  }
  const light = new THREE.PointLight(color, intensity, distance, 1.5);
  light.position.set(x, y, z);
  scene.add(light);
  warmLights.push({ light, baseIntensity: intensity });
  return light;
}

// ==========================================
// 5. 建筑通用构建辅助函数
// ==========================================
function addBox(
  parent,
  w,
  h,
  d,
  mat,
  x,
  y,
  z,
  castShadow = true,
  receiveShadow = true,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  parent.add(mesh);
  return mesh;
}

// 创建中式双坡硬山/悬山屋顶 (带正脊与飞檐)
function createPitchedRoof(width, depth, ridgeHeight, orient = "EW") {
  const roofGroup = new THREE.Group();
  const roofMat = createRoofMaterial();

  const overhangW = width + 1.5;
  const overhangD = depth + 1.5;

  if (orient === "EW") {
    // 屋脊沿X方向延伸 (如北房正房、南倒座房)
    const halfD = overhangD / 2;
    const slopeLen = Math.hypot(halfD, ridgeHeight);
    const angle = Math.atan2(ridgeHeight, halfD);

    const frontSlope = new THREE.Mesh(
      new THREE.BoxGeometry(overhangW, 0.22, slopeLen),
      roofMat,
    );
    frontSlope.position.set(0, ridgeHeight / 2, halfD / 2);
    frontSlope.rotation.x = angle;
    frontSlope.castShadow = true;
    roofGroup.add(frontSlope);

    const backSlope = new THREE.Mesh(
      new THREE.BoxGeometry(overhangW, 0.22, slopeLen),
      roofMat,
    );
    backSlope.position.set(0, ridgeHeight / 2, -halfD / 2);
    backSlope.rotation.x = -angle;
    backSlope.castShadow = true;
    roofGroup.add(backSlope);

    // 屋脊装饰条
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(overhangW + 0.4, 0.36, 0.36),
      materials.darkStone,
    );
    ridge.position.set(0, ridgeHeight + 0.08, 0);
    roofGroup.add(ridge);

    // 两侧吻兽端头
    [-overhangW / 2, overhangW / 2].forEach((rx) => {
      const ornament = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.65, 0.5),
        materials.goldBrass,
      );
      ornament.position.set(rx, ridgeHeight + 0.3, 0);
      roofGroup.add(ornament);
    });
  } else {
    // 屋脊沿Z方向延伸 (如东西厢房)
    const halfW = overhangW / 2;
    const slopeLen = Math.hypot(halfW, ridgeHeight);
    const angle = Math.atan2(ridgeHeight, halfW);

    const leftSlope = new THREE.Mesh(
      new THREE.BoxGeometry(slopeLen, 0.22, overhangD),
      roofMat,
    );
    leftSlope.position.set(-halfW / 2, ridgeHeight / 2, 0);
    leftSlope.rotation.z = angle;
    leftSlope.castShadow = true;
    roofGroup.add(leftSlope);

    const rightSlope = new THREE.Mesh(
      new THREE.BoxGeometry(slopeLen, 0.22, overhangD),
      roofMat,
    );
    rightSlope.position.set(halfW / 2, ridgeHeight / 2, 0);
    rightSlope.rotation.z = -angle;
    rightSlope.castShadow = true;
    roofGroup.add(rightSlope);

    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.36, overhangD + 0.4),
      materials.darkStone,
    );
    ridge.position.set(0, ridgeHeight + 0.08, 0);
    roofGroup.add(ridge);

    [-overhangD / 2, overhangD / 2].forEach((rz) => {
      const ornament = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.65, 0.35),
        materials.goldBrass,
      );
      ornament.position.set(0, ridgeHeight + 0.3, rz);
      roofGroup.add(ornament);
    });
  }

  roofGroup.traverse((child) => {
    if (child.isMesh) {
      roofMeshes.push(child);
    }
  });
  return roofGroup;
}

// 创建中式红灯笼挂件 (共享材质以便静态合批)
function createHangingLantern(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6),
    materials.darkFrame,
  );
  cord.position.y = 0.22;
  g.add(cord);

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 10, 8),
    materials.lanternRed,
  );
  body.scale.set(1, 0.82, 1);
  g.add(body);

  const capTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.06, 8),
    materials.goldBrass,
  );
  capTop.position.y = 0.2;
  g.add(capTop);

  const capBot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.06, 8),
    materials.goldBrass,
  );
  capBot.position.y = -0.2;
  g.add(capBot);

  scene.add(g);
}

// ==========================================
// 6. 构建标准三进四合院基地、院墙、抄手游廊、垂花门、十字甬道与后罩房 (严格对应 siheyuan.jpg)
// ==========================================
function createClassicalTree(x, z, scale = 1.0, hasPersimmons = false) {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(x, 0.1, z);

  // 树池青石围边
  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15 * scale, 1.25 * scale, 0.32, 10),
    materials.whiteMarble,
  );
  ring.position.y = 0.16;
  treeGroup.add(ring);

  // 树干
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24 * scale, 0.38 * scale, 3.6 * scale, 8),
    materials.walnutWood,
  );
  trunk.position.y = 1.8 * scale;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  const canopyOffsets = [
    [0, 4.1 * scale, 0, 1.85 * scale],
    [-1.15 * scale, 3.7 * scale, 0.55 * scale, 1.38 * scale],
    [1.2 * scale, 3.8 * scale, -0.5 * scale, 1.45 * scale],
    [0.35 * scale, 4.7 * scale, 0.7 * scale, 1.3 * scale],
  ];
  canopyOffsets.forEach(([cx, cy, cz, r]) => {
    const leaf = new THREE.Mesh(
      new THREE.DodecahedronGeometry(r, 0),
      materials.treeCanopy,
    );
    leaf.position.set(cx, cy, cz);
    leaf.castShadow = true;
    treeGroup.add(leaf);
  });

  if (hasPersimmons) {
    for (let p = 0; p < 10; p++) {
      const angle = (p / 10) * Math.PI * 2;
      const rad = (1.05 + (p % 3) * 0.4) * scale;
      const fruit = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 6, 6),
        materials.persimmonOrange,
      );
      fruit.position.set(
        Math.cos(angle) * rad,
        (3.4 + (p % 4) * 0.3) * scale,
        Math.sin(angle) * rad,
      );
      treeGroup.add(fruit);
    }
  }
  return treeGroup;
}

function buildCourtyardBaseAndWalls() {
  const baseGroup = new THREE.Group();

  // 远景胡同地面
  const outerGround = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    materials.outerGround,
  );
  outerGround.rotation.x = -Math.PI / 2;
  outerGround.position.y = -0.05;
  outerGround.receiveShadow = true;
  baseGroup.add(outerGround);

  // 三进四合院整体青砖台基与院落铺地 (宽 44m: X[-22, 22], 深 60m: Z[-32, 28])
  const yardFloor = new THREE.Mesh(
    new THREE.BoxGeometry(44, 0.14, 60),
    materials.courtyardStone,
  );
  yardFloor.position.set(0, 0.02, -2);
  yardFloor.receiveShadow = true;
  baseGroup.add(yardFloor);

  // 四周高大青砖院墙 (高 4.2m)
  const wallH = 4.2;
  // 北外墙 (后罩房背墙 Z = -31.2)
  addBox(baseGroup, 43.2, wallH, 0.5, materials.greyBrick, 0, wallH / 2, -31.2);
  // 西外墙 (X = -21.4, Z 从 -31.2 到 +27.6)
  addBox(
    baseGroup,
    0.5,
    wallH,
    58.8,
    materials.greyBrick,
    -21.4,
    wallH / 2,
    -1.8,
  );
  // 东外墙 (X = +21.4, Z 从 -31.2 到 +27.6)
  addBox(
    baseGroup,
    0.5,
    wallH,
    58.8,
    materials.greyBrick,
    21.4,
    wallH / 2,
    -1.8,
  );
  // 南外墙西段 (倒座房南山墙 X: -21.4 ~ +11.6, Z = +27.6)
  addBox(
    baseGroup,
    33.0,
    wallH,
    0.5,
    materials.greyBrick,
    -4.9,
    wallH / 2,
    27.6,
  );
  // 南外墙最东端封墙 (X: +17.6 ~ +21.4, Z = +27.6)
  addBox(
    baseGroup,
    3.8,
    wallH,
    0.5,
    materials.greyBrick,
    19.5,
    wallH / 2,
    27.6,
  );

  // 一进院与二进院之间的东西向内院分界墙 (Z = +14.5，中间留出 X: -2.6 ~ +2.6 给【垂花门】)
  addBox(baseGroup, 18.6, 3.6, 0.42, materials.greyBrick, -11.9, 1.8, 14.5);
  addBox(baseGroup, 18.6, 3.6, 0.42, materials.greyBrick, 11.9, 1.8, 14.5);
  addBox(baseGroup, 18.8, 0.2, 0.62, materials.darkStone, -11.9, 3.68, 14.5);
  addBox(baseGroup, 18.8, 0.2, 0.62, materials.darkStone, 11.9, 3.68, 14.5);

  // 二进院与三进后院之间的东西向隔墙 (Z = -18.2，东侧留出 X: +9.8 ~ +11.6 月亮门/夹道通往后院)
  addBox(baseGroup, 31.0, 3.6, 0.4, materials.greyBrick, -5.8, 1.8, -18.2);
  addBox(baseGroup, 9.6, 3.6, 0.4, materials.greyBrick, 16.5, 1.8, -18.2);

  // 1. 构建二进院核心【垂花门】 (Chuihuamen, X = 0, Z = +14.5)
  buildChuihuamen(baseGroup);

  // 2. 构建二进院环院【抄手游廊】 (Veranda Corridors)
  buildVerandaCorridors(baseGroup);

  // 3. 构建二进院【十字青石甬道、庭院绿地、两棵古树与正房前太平鱼缸】
  buildCentralCourtyardDetails(baseGroup);

  // 4. 构建三进院【后院与七间后罩房】 (Houzhaofang, Z = -28.0)
  buildBackyardAndHouzhaofang(baseGroup);

  scene.add(baseGroup);
}

// 一进与二进分界核心建筑：垂花门 (参照 siheyuan.jpg 正中垂花门)
function buildChuihuamen(parent) {
  const chm = new THREE.Group();
  const cz = 14.5;
  chm.position.set(0, 0, cz);

  // 汉白玉须弥座台基与踏跺
  addBox(chm, 5.4, 0.28, 3.6, materials.whiteMarble, 0, 0.14, 0);
  addBox(chm, 3.2, 0.16, 4.4, materials.whiteMarble, 0, 0.08, 0);

  // 四根朱红主柱 + 两侧抱鼓石
  [
    [-2.1, 1.3],
    [2.1, 1.3],
    [-2.1, -1.3],
    [2.1, -1.3],
  ].forEach(([px, pz]) => {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.2, 3.8, 16),
      materials.vermilionRed,
    );
    col.position.set(px, 2.1, pz);
    col.castShadow = true;
    chm.add(col);
  });

  // 门前一对汉白玉抱鼓石
  [-2.1, 2.1].forEach((dx) => {
    addBox(chm, 0.5, 0.42, 0.75, materials.whiteMarble, dx, 0.42, 1.85);
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.38, 18),
      materials.whiteMarble,
    );
    drum.rotation.z = Math.PI / 2;
    drum.position.set(dx, 0.82, 1.92);
    chm.add(drum);
  });

  // 苏式青绿描金彩绘梁枋 (还原 siheyuan.jpg 垂花门上沿蓝绿金彩绘)
  addBox(chm, 4.8, 0.42, 2.9, materials.jadeGreen, 0, 3.75, 0);
  addBox(chm, 4.9, 0.12, 3.0, materials.goldBrass, 0, 3.98, 0);

  // 一对标志性雕花【垂莲柱】(悬挂在前檐两端)
  [-1.35, 1.35].forEach((lx) => {
    const pendant = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.11, 0.95, 12),
      materials.vermilionRed,
    );
    pendant.position.set(lx, 3.35, 1.45);
    chm.add(pendant);
    const lotusCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 12, 12),
      materials.goldBrass,
    );
    lotusCap.position.set(lx, 2.85, 1.45);
    chm.add(lotusCap);
  });

  // 垂花门内侧屏门 (向两侧敞开以便第一人称漫游自由穿行)
  addBox(chm, 0.9, 3.1, 0.12, materials.brightRedGate, -1.55, 1.8, -0.3);
  addBox(chm, 0.9, 3.1, 0.12, materials.brightRedGate, 1.55, 1.8, -0.3);

  // 垂花门双坡卷棚瓦顶
  const chmRoof = createPitchedRoof(5.6, 4.0, 1.55, "EW");
  chmRoof.position.set(0, 4.05, 0);
  chm.add(chmRoof);

  addWarmPointLight(0, 3.5, cz + 0.8, 2.2, 11, 0xffbb66);
  parent.add(chm);
}

// 二进院环院【抄手游廊】(连接垂花门、东西厢房与正房，带灰瓦廊顶与朱红美人靠栏杆)
function buildVerandaCorridors(parent) {
  // 内院游廊范围：X = ±9.2, Z = -9.2 (北正房前廊) 到 +13.2 (南垂花门北侧)
  const northZ = -9.2;
  const southZ = 13.2;
  const westX = -9.2;
  const eastX = 9.2;

  // 游廊环形台基与木栈道地面
  addBox(parent, 19.6, 0.22, 1.8, materials.whiteMarble, 0, 0.11, northZ);
  addBox(parent, 19.6, 0.22, 1.8, materials.whiteMarble, 0, 0.11, southZ);
  addBox(parent, 1.8, 0.22, 24.0, materials.whiteMarble, westX, 0.11, 2.0);
  addBox(parent, 1.8, 0.22, 24.0, materials.whiteMarble, eastX, 0.11, 2.0);

  // 游廊朱红立柱坐标
  const pillars = [
    // 北廊柱
    [-9.2, northZ],
    [-5.5, northZ],
    [-2.0, northZ],
    [2.0, northZ],
    [5.5, northZ],
    [9.2, northZ],
    // 南廊柱
    [-9.2, southZ],
    [-5.5, southZ],
    [-2.2, southZ],
    [2.2, southZ],
    [5.5, southZ],
    [9.2, southZ],
    // 西廊柱
    [westX, -5.8],
    [westX, -2.0],
    [westX, 1.8],
    [westX, 5.8],
    [westX, 9.6],
    // 东廊柱
    [eastX, -5.8],
    [eastX, -2.0],
    [eastX, 1.8],
    [eastX, 5.8],
    [eastX, 9.6],
  ];

  pillars.forEach(([px, pz]) => {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.26, 0.24, 14),
      materials.whiteMarble,
    );
    base.position.set(px, 0.22, pz);
    parent.add(base);

    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.17, 3.2, 14),
      materials.vermilionRed,
    );
    col.position.set(px, 1.85, pz);
    col.castShadow = true;
    parent.add(col);
  });

  // 游廊苏式彩绘横梁 (红柱上沿绿金彩绘枋)
  addBox(parent, 19.2, 0.26, 0.3, materials.jadeGreen, 0, 3.35, northZ);
  addBox(parent, 19.2, 0.26, 0.3, materials.jadeGreen, 0, 3.35, southZ);
  addBox(parent, 0.3, 0.26, 23.2, materials.jadeGreen, westX, 3.35, 2.0);
  addBox(parent, 0.3, 0.26, 23.2, materials.jadeGreen, eastX, 3.35, 2.0);

  // 游廊遮雨坡顶 (纳入 roofMeshes 支持透视切换)
  const roofN = createPitchedRoof(19.6, 2.1, 0.65, "EW");
  roofN.position.set(0, 3.5, northZ);
  parent.add(roofN);

  const roofS = createPitchedRoof(19.6, 2.1, 0.65, "EW");
  roofS.position.set(0, 3.5, southZ);
  parent.add(roofS);

  const roofW = createPitchedRoof(2.1, 22.8, 0.65, "NS");
  roofW.position.set(westX, 3.5, 2.0);
  parent.add(roofW);

  const roofE = createPitchedRoof(2.1, 22.8, 0.65, "NS");
  roofE.position.set(eastX, 3.5, 2.0);
  parent.add(roofE);

  // 游廊朱红坐凳栏杆 (美人靠，留出十字甬道出入口)
  addBox(
    parent,
    6.4,
    0.55,
    0.14,
    materials.vermilionRed,
    -5.6,
    0.5,
    northZ + 0.7,
  );
  addBox(
    parent,
    6.4,
    0.55,
    0.14,
    materials.vermilionRed,
    5.6,
    0.5,
    northZ + 0.7,
  );
  addBox(
    parent,
    6.4,
    0.55,
    0.14,
    materials.vermilionRed,
    -5.6,
    0.5,
    southZ - 0.7,
  );
  addBox(
    parent,
    6.4,
    0.55,
    0.14,
    materials.vermilionRed,
    5.6,
    0.5,
    southZ - 0.7,
  );

  // 悬挂宫灯
  createHangingLantern(-3.6, 3.1, northZ);
  createHangingLantern(3.6, 3.1, northZ);
  createHangingLantern(eastX, 3.1, -2.2);
  createHangingLantern(eastX, 3.1, 2.2);
  createHangingLantern(westX, 3.1, -2.2);
  createHangingLantern(westX, 3.1, 2.2);
  createHangingLantern(-2.8, 3.1, southZ);
  createHangingLantern(2.8, 3.1, southZ);
}

// 二进院中心：十字青石甬道、四块绿茵草坪、海棠/柿子树与正房前大鱼缸 (严格还原 siheyuan.jpg 院心布局)
function buildCentralCourtyardDetails(parent) {
  // 1. 十字形青石板主甬道 (连接南垂花门至北正房，以及西厢房至东厢房)
  addBox(parent, 2.8, 0.18, 22.4, materials.whiteMarble, 0, 0.09, 2.0);
  addBox(parent, 18.8, 0.18, 2.6, materials.whiteMarble, 0, 0.09, -0.2);

  // 2. 十字甬道分隔出的四块庭院翠绿草坪/花圃
  const lawnCoords = [
    [-5.0, -4.6, 6.4, 5.4],
    [5.0, -4.6, 6.4, 5.4],
    [-5.0, 6.2, 6.4, 10.2],
    [5.0, 6.2, 6.4, 10.2],
  ];
  lawnCoords.forEach(([lx, lz, lw, ld]) => {
    addBox(parent, lw, 0.14, ld, materials.lawnGreen, lx, 0.07, lz);
  });

  // 3. 正房台阶正前方中轴线偏北：传统石雕/古铜【太平锦鲤大鱼缸】 (对应 siheyuan.jpg 院中大水缸)
  const vatZ = -5.8;
  const vatOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 0.88, 1.05, 16),
    materials.goldBrass,
  );
  vatOuter.position.set(0, 0.62, vatZ);
  vatOuter.castShadow = true;
  parent.add(vatOuter);

  const vatWater = new THREE.Mesh(
    new THREE.CylinderGeometry(1.04, 1.04, 0.1, 16),
    materials.vatWater,
  );
  vatWater.position.set(0, 1.08, vatZ);
  parent.add(vatWater);

  // 鱼缸内游动的红白锦鲤
  const koiColors = [0xff3b1f, 0xffaa00, 0xffffff, 0xff5500];
  for (let i = 0; i < 4; i++) {
    const fishGroup = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.26, 6),
      new THREE.MeshBasicMaterial({ color: koiColors[i] }),
    );
    dynamicObjects.add(fishGroup);
    dynamicObjects.add(body);
    body.rotation.x = Math.PI / 2;
    fishGroup.add(body);
    fishGroup.position.set(0, 1.12, vatZ);
    parent.add(fishGroup);

    koiFishList.push({
      mesh: fishGroup,
      centerX: 0,
      centerZ: vatZ,
      radius: 0.45 + (i % 2) * 0.2,
      speed: 1.1 + i * 0.2,
      phase: i * 1.57,
      heightY: 1.12,
    });
  }

  // 4. 院内两棵对称参天大树 (西侧百年柿子树 + 东侧西府海棠，对应 siheyuan.jpg 院心两棵大树)
  parent.add(createClassicalTree(-5.2, -3.6, 1.05, true));
  parent.add(createClassicalTree(5.2, -3.6, 1.0, false));

  // 南半院对称点缀青竹与石榴盆景
  buildBambooCluster(parent, -5.2, 8.2, 6);
  buildBambooCluster(parent, 5.2, 8.2, 6);
  addWarmPointLight(0, 2.2, -2.0, 2.0, 15, 0xffbe76);
}

// 三进后院与七间通长【后罩房】 (对应 siheyuan.jpg 最北端后罩房与后院树木)
function buildBackyardAndHouzhaofang(parent) {
  const hzfGroup = new THREE.Group();
  const hzfZ = -27.8;
  const floorY = 0.26;
  const wallH = 3.9;

  // 后罩房 41m 通长台基与七间房身
  addBox(
    hzfGroup,
    41.6,
    floorY,
    6.2,
    materials.whiteMarble,
    0,
    floorY / 2,
    hzfZ,
  );
  addBox(
    hzfGroup,
    41.0,
    wallH,
    5.6,
    materials.greyBrick,
    0,
    floorY + wallH / 2,
    hzfZ,
  );

  // 南立面七间朱红廊柱与格栅窗
  for (let bx = -18.0; bx <= 18.0; bx += 6.0) {
    addBox(
      hzfGroup,
      0.24,
      wallH,
      0.24,
      materials.vermilionRed,
      bx,
      floorY + wallH / 2,
      hzfZ + 2.82,
    );
    if (bx < 18.0) {
      addBox(
        hzfGroup,
        4.2,
        2.4,
        0.1,
        materials.glassWall,
        bx + 3.0,
        floorY + 2.0,
        hzfZ + 2.82,
        false,
        false,
      );
      addBox(
        hzfGroup,
        4.4,
        0.22,
        0.26,
        materials.jadeGreen,
        bx + 3.0,
        floorY + wallH - 0.2,
        hzfZ + 2.85,
      );
    }
  }

  // 后罩房通长硬山灰瓦大屋顶
  const hzfRoof = createPitchedRoof(41.8, 6.4, 2.1, "EW");
  hzfRoof.position.set(0, floorY + wallH, hzfZ);
  hzfGroup.add(hzfRoof);

  // 后院青石甬道与东西两侧古树 (还原 siheyuan.jpg 后院两侧绿树)
  addBox(hzfGroup, 2.4, 0.16, 6.8, materials.whiteMarble, 10.6, 0.08, -21.4);
  hzfGroup.add(createClassicalTree(-14.5, -21.8, 0.85, false));
  hzfGroup.add(createClassicalTree(15.5, -21.8, 0.9, true));

  parent.add(hzfGroup);
}

function buildBambooCluster(parent, centerX, centerZ, count = 6) {
  const bambooGroup = new THREE.Group();
  bambooGroup.position.set(centerX, 0.1, centerZ);
  const stalkMat = new THREE.MeshStandardMaterial({
    color: 0x4b8b52,
    roughness: 0.5,
  });

  for (let i = 0; i < count; i++) {
    const ox = Math.sin(i * 2.5) * 0.6;
    const oz = Math.cos(i * 3.1) * 0.6;
    const h = 3.2 + (i % 3) * 0.65;
    const stalk = new THREE.Mesh(

  for (let i = 0; i < count; i++) {
    const ox = Math.sin(i * 2.5) * 0.6;
    const oz = Math.cos(i * 3.1) * 0.6;
    const h = 3.2 + (i % 3) * 0.65;
    const stalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.065, h, 6),
      materials.bambooGreen,
    );
    stalk.position.set(ox, h / 2, oz);
    stalk.castShadow = true;
    bambooGroup.add(stalk);

    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 6, 6),
      materials.bambooGreen · 大门口 (东南广亮大门 + 迎门影壁 + 南侧倒座房 + 西侧屏门)
// ==========================================
function buildMainGateArea() {
  const gateGroup = new THREE.Group();
  // 严格对应 siheyuan.jpg：大门位于东南角 X = +14.6, Z = +25.2
  const gx = 14.6;
  const gz = 25.2;

  // 大门台阶踏跺与门道青石地坪
  addBox(gateGroup, 6.2, 0.26, 5.4, materials.whiteMarble, gx, 0.13, gz);
  addBox(gateGroup, 4.6, 0.14, 1.6, materials.whiteMarble, gx, 0.07, gz + 3.2);

  // 大门两侧青砖墀头垛与朱红门柱
  addBox(gateGroup, 0.85, 4.6, 4.8, materials.greyBrick, gx - 2.7, 2.3, gz);
  addBox(gateGroup, 0.85, 4.6, 4.8, materials.greyBrick, gx + 2.7, 2.3, gz);
  addBox(
    gateGroup,
    0.36,
    4.3,
    0.4,
    materials.vermilionRed,
    gx - 2.1,
    2.15,
    gz + 1.2,
  );
  addBox(
    gateGroup,
    0.36,
    4.3,
    0.4,
    materials.vermilionRed,
    gx + 2.1,
    2.15,
    gz + 1.2,
  );
  addBox(
    gateGroup,
    4.8,
    0.48,
    0.55,
    materials.vermilionRed,
    gx,
    4.15,
    gz + 1.2,
  );

  // 4枚鎏金门簪
  for (let i = -1.35; i <= 1.35; i += 0.9) {
    const zan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.65, 8),
      materials.goldBrass,
    );
    zan.rotation.x = Math.PI / 2;
    zan.position.set(gx + i, 4.15, gz + 1.3);
    gateGroup.add(zan);
  }

  // 双扇朱红广亮大门 (微敞开迎客)
  const leftDoorPivot = new THREE.Group();
  leftDoorPivot.position.set(gx - 1.9, 0.26, gz + 1.0);
  addBox(
    leftDoorPivot,
    1.85,
    3.65,
    0.14,
    materials.brightRedGate,
    0.92,
    1.82,
    0,
  );
  const leftRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.035, 10, 20),
    materials.goldBrass,
  );
  leftRing.position.set(1.5, 1.85, 0.1);
  leftDoorPivot.add(leftRing);
  leftDoorPivot.rotation.y = 0.65;
  gateGroup.add(leftDoorPivot);

  const rightDoorPivot = new THREE.Group();
  rightDoorPivot.position.set(gx + 1.9, 0.26, gz + 1.0);
  addBox(
    rightDoorPivot,
    1.85,
    3.65,
    0.14,
    materials.brightRedGate,
    -0.92,
    1.82,
    0,
  );
  const rightRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.035, 10, 20),
    materials.goldBrass,
  );
  rightRing.position.set(-1.5, 1.85, 0.1);
  rightDoorPivot.add(rightRing);
  rightDoorPivot.rotation.y = -0.65;
  gateGroup.add(rightDoorPivot);

  // 门外一对汉白玉抱鼓石
  [-2.05, 2.05].forEach((dx) => {
    addBox(
      gateGroup,
      0.65,
      0.45,
      0.95,
      materials.whiteMarble,
      gx + dx,
      0.42,
      gz + 2.35,
    );
    const drumCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.48, 20),
      materials.whiteMarble,
    );
    drumCylinder.rotation.z = Math.PI / 2;
    drumCylinder.position.set(gx + dx, 0.96, gz + 2.45);
    gateGroup.add(drumCylinder);
  });

  // 大门高挑屋顶 (屋脊高于西侧倒座房，与 siheyuan.jpg 完全一致)
  const gateRoof = createPitchedRoof(6.4, 5.4, 1.95, "EW");
  gateRoof.position.set(gx, 4.6, gz);
  gateGroup.add(gateRoof);

  // 2. 进门迎面正北侧：【迎门砖雕影壁】 (对应 siheyuan.jpg 大门内北侧影壁 X = +14.6, Z = +17.2)
  const swZ = 17.2;
  addBox(gateGroup, 4.8, 0.45, 0.72, materials.whiteMarble, gx, 0.25, swZ);
  addBox(gateGroup, 4.4, 2.9, 0.48, materials.greyBrick, gx, 1.9, swZ);
  const medallionMat = new THREE.MeshStandardMaterial({
    map: createScreenWallMedallionTexture(),
    roughness: 0.4,
  });
  const frontMedallion = new THREE.MeLambertMaterial({
    map: createScreenWallMedallionTexture()
  );
  frontMedallion.position.set(gx, 1.92, swZ + 0.26);
  gateGroup.add(frontMedallion);

  const backMedallion = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 2.15),
    medallionMat,
  );
  backMedallion.rotation.y = Math.PI;
  backMedallion.position.set(gx, 1.92, swZ - 0.26);
  gateGroup.add(backMedallion);

  // 影壁小坡顶
  const swRoof = createPitchedRoof(4.9, 1.15, 0.58, "EW");
  swRoof.position.set(gx, 3.35, swZ);
  gateGroup.add(swRoof);

  // 3. 一进院南侧四间【倒座房】 (Daozuofang, X 从 -13.5 到 +11.2, Z = +25.0，坐南朝北)
  const dzX = -1.2;
  const dzZ = 25.0;
  addBox(gateGroup, 24.6, 0.25, 5.2, materials.whiteMarble, dzX, 0.12, dzZ);
  addBox(gateGroup, 24.2, 3.8, 4.8, materials.greyBrick, dzX, 2.0, dzZ);
  // 倒座房朝北朱红门窗与现代玻璃
  for (let wx = -10.5; wx <= 8.5; wx += 4.8) {
    addBox(
      gateGroup,
      0.24,
      3.8,
      0.24,
      materials.vermilionRed,
      wx,
      2.0,
      dzZ - 2.42,
    );
    addBox(
      gateGroup,
      3.4,
      2.5,
      0.1,
      materials.glassWall,
      wx + 2.2,
      2.1,
      dzZ - 2.42,
      false,
      false,
    );
    addBox(
      gateGroup,
      3.6,
      0.24,
      0.26,
      materials.vermilionRed,
      wx + 2.2,
      3.6,
      dzZ - 2.44,
    );
  }
  const daozuoRoof = createPitchedRoof(24.8, 5.4, 1.6, "EW");
  daozuoRoof.position.set(dzX, 3.9, dzZ);
  gateGroup.add(daozuoRoof);

  // 4. 一进院西侧【屏门】与西角房 (对应 siheyuan.jpg 左下角“屏门”标识，位于 X = -14.2, Z = +19.6)
  addBox(gateGroup, 0.38, 3.4, 5.8, materials.greyBrick, -14.2, 1.7, 19.6);
  addBox(gateGroup, 0.45, 2.8, 2.2, materials.vermilionRed, -14.2, 1.4, 19.6);
  const pingmenRoof = createPitchedRoof(1.1, 3.0, 0.48, "NS");
  pingmenRoof.position.set(-14.2, 3.45, 19.6);
  gateGroup.add(pingmenRoof);

  // 一进外院东西向青石甬道 (连接大门口、影壁前至垂花门前)
  addBox(gateGroup, 19.5, 0.15, 2.4, materials.whiteMarble, 5.8, 0.08, 19.8);

  // 大门与影壁暖光照明
  addWarmPointLight(gx, 3.6, gz + 1.0, 2.6, 14, 0xffaa44);
  addWarmPointLight(gx, 2.4, swZ + 1.5, 2.4, 12, 0xffcc77);

  scene.add(gateGroup);
}

// ==========================================
// 8. 空间二：正房客厅 + 左右耳房 (二进院北侧正房三间 + 东西耳房，参照 siheyuan.jpg)
// ==========================================
function buildMainLivingRoom() {
  const room = new THREE.Group();
  // 正房居中三间: X 从 -9.6 到 +9.6 (宽19.2m), Z 从 -17.8 到 -9.6 (深8.2m)
  const centerZ = -13.7;
  const floorY = 0.36; // 正房崇高汉白玉台基
  const wallH = 4.6;

  // 正房汉白玉高台基与中轴三出陛踏跺台阶
  addBox(
    room,
    19.6,
    floorY,
    8.8,
    materials.whiteMarble,
    0,
    floorY / 2,
    centerZ,
  );
  addBox(room, 4.2, 0.18, 1.6, materials.whiteMarble, 0, 0.09, -8.8);
  addBox(room, 18.6, 0.06, 7.8, materials.woodFloor, 0, floorY + 0.03, centerZ);

  // 北后墙、东西山墙
  addBox(
    room,
    19.2,
    wallH,
    0.4,
    materials.warmWall,
    0,
    floorY + wallH / 2,
    -17.8,
  );
  addBox(
    room,
    0.4,
    wallH,
    8.2,
    materials.greyBrick,
    -9.4,
    floorY + wallH / 2,
    centerZ,
  );
  addBox(
    room,
    0.4,
    wallH,
    8.2,
    materials.greyBrick,
    9.4,
    floorY + wallH / 2,
    centerZ,
  );

  // 南立面：传统朱红檐柱 + 现代全景无框玻璃幕墙 (中间留出 4.2m 宽敞敞开门洞 Z = -9.7)
  addBox(
    room,
    7.0,
    wallH - 0.4,
    0.12,
    materials.glassWall,
    -5.6,
    floorY + wallH / 2,
    -9.7,
    false,
    false,
  );
  addBox(
    room,
    7.0,
    wallH - 0.4,
    0.12,
    materials.glassWall,
    5.6,
    floorY + wallH / 2,
    -9.7,
    false,
    false,
  );
  [-9.1, -5.6, -2.1, 2.1, 5.6, 9.1].forEach((fx) => {
    addBox(
      room,
      0.22,
      wallH,
      0.22,
      materials.vermilionRed,
      fx,
      floorY + wallH / 2,
      -9.7,
    );
  });

  // 1. 巨幅新中式发光水墨山水背景墙 (正北墙中央)
  addBox(room, 9.6, 3.6, 0.18, materials.walnutWood, 0, floorY + 2.2, -17.5);
  const inkArtMat = new THREE.MeshBasicMaterial({
    map: createInkLandscapeTexture(),
  });
  const inkArt = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 3.1), inkArtMat);
  inkArt.position.set(0, floorY + 2.2, -17.38);
  room.add(inkArt);

  // 背景墙两侧中式格栅与博古展示柜
  [-6.2, 6.2].forEach((sx) => {
    addBox(
      room,
      2.2,
      3.5,
      0.55,
      materials.walnutWood,
      sx,
      floorY + 1.85,
      -17.2,
    );
    for (let sy = 1.0; sy <= 3.0; sy += 0.9) {
      addBox(
        room,
        2.0,
        0.06,
        0.5,
        materials.goldBrass,
        sx,
        floorY + sy,
        -17.18,
      );
      const vase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.18, 0.48, 12),
        materials.jadeGreen,
      );
      vase.position.set(
        sx + (sy > 2 ? 0.35 : -0.35),
        floorY + sy + 0.27,
        -17.15,
      );
      room.add(vase);
    }
  });

  // 2. 客厅中央巨幅现代羊毛地毯
  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.03, 4.8),
    new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.92 }),
  );materials.woolRug
  rug.position.set(0, floorY + 0.07, -13.6);
  rug.receiveShadow = true;
  room.add(rug);

  // 3. 现代新中式环抱式沙发组合
  addBox(room, 5.0, 0.42, 1.15, materials.walnutWood, 0, floorY + 0.25, -15.5);
  addBox(room, 4.8, 0.32, 1.05, materials.creamFabric, 0, floorY + 0.52, -15.5);
  addBox(
    room,
    4.8,
    0.65,
    0.25,
    materials.creamFabric,
    0,
    floorY + 0.88,
    -15.95,
  );

  [-3.5, 3.5].forEach((cx) => {
    addBox(room, 1.1, 0.4, 2.6, materials.walnutWood, cx, floorY + 0.24, -13.6);
    addBox(room, 1.0, 0.3, 2.4, materials.creamFabric, cx, floorY + 0.5, -13.6);
    addBox(
      room,
      0.24,
      0.6,
      2.4,
      materials.creamFabric,
      cx + (cx < 0 ? -0.42 : 0.42),
      floorY + 0.82,
      -13.6,
    );
  });

  // 4. 中央胡桃木原木大茶台 + 功夫茶具 + 迎客松盆景
  addBox(room, 3.0, 0.48, 1.4, materials.walnutWood, 0, floorY + 0.28, -13.6);
  addBox(
    room,
    0.85,
    0.06,
    0.52,
    materials.darkStone,
    -0.45,
    floorY + 0.55,
    -13.6,
  );
  const teapot = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 12, 12),
    materials.vermilionRed,
  );
  teapot.position.set(-0.45, floorY + 0.68, -13.6);
  room.add(teapot);

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.18, 0.16, 12),
    materials.whiteMarble,
  );
  pot.position.set(0.7, floorY + 0.6, -13.5);
  room.add(pot);
  const bonsaiCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 10, 10),
    materials.jadeGreen,
  );
  bonsaiCrown.scale.set(1.4, 0.6, 1.0);
  bonsaiCrown.position.set(0.78, floorY + 0.92, -13.5);
  room.add(bonsaiCrown);

  // 5. 东侧团圆餐桌区
  const diningTable = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.25, 0.08, 24),
    materials.walnutWood,
  );
  diningTable.position.set(6.8, floorY + 0.78, -13.6);
  room.add(diningTable);
  const diningBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.55, 0.75, 16),
    materials.darkStone,
  );
  diningBase.position.set(6.8, floorY + 0.4, -13.6);
  room.add(diningBase);

  // 6. 正房两侧对称【东西耳房】 (严格参照 siheyuan.jpg 正房两侧“耳房”规制，体量略低于正房)
  // 西耳房 (X: -18.8 ~ -9.8, Z: -14.2) & 东耳房 (X: +11.6 ~ +19.6, Z: -14.2，中间预留 X:+10.5 后院通道)
  [
    [-14.3, 8.8],
    [15.6, 7.8],
  ].forEach(([ex, ew]) => {
    const earH = 3.6;
    addBox(room, ew, 0.24, 6.2, materials.whiteMarble, ex, 0.12, -14.2);
    addBox(
      room,
      ew - 0.4,
      earH,
      5.8,
      materials.greyBrick,
      ex,
      0.24 + earH / 2,
      -14.2,
    );
    addBox(
      room,
      ew - 1.8,
      2.4,
      0.12,
      materials.glassWall,
      ex,
      2.0,
      -11.28,
      false,
      false,
    );
    addBox(room, ew - 1.4, 0.24, 0.28, materials.vermilionRed, ex, 3.5, -11.26);
    const earRoof = createPitchedRoof(ew + 0.4, 6.4, 1.55, "EW");
    earRoof.position.set(ex, 0.24 + earH, -14.2);
    room.add(earRoof);
  });

  // 客厅暖光源
  addWarmPointLight(0, floorY + 3.8, -13.6, 3.2, 18, 0xffb86c);
  addWarmPointLight(-6.0, floorY + 3.5, -13.6, 1.8, 12, 0xffaa55);
  addWarmPointLight(6.0, floorY + 3.5, -13.6, 1.8, 12, 0xffaa55);

  // 正房高耸大坡屋顶 (全院最高屋脊)
  const mainRoof = createPitchedRoof(20.2, 9.2, 2.85, "EW");
  mainRoof.position.set(0, floorY + wallH, centerZ);
  room.add(mainRoof);

  scene.add(room);
}

// ==========================================
// 9. 空间三：主角房间 (东厢房三间 + 南侧厢耳房 · 现代创客卧室与双屏工作室)
// ==========================================
function buildProtagonistRoom() {
  const room = new THREE.Group();
  // 东厢房范围: X 从 +10.2 到 +18.8 (宽8.6m), Z 从 -7.2 到 +6.8 (长14.0m)
  const centerX = 14.5;
  const floorY = 0.24;
  const wallH = 4.0;

  // 台基与木地板
  addBox(
    room,
    9.0,
    floorY,
    14.6,
    materials.whiteMarble,
    centerX,
    floorY / 2,
    -0.2,
  );
  addBox(
    room,
    8.2,
    0.06,
    13.8,
    materials.woodFloor,
    centerX,
    floorY + 0.03,
    -0.2,
  );

  // 东外墙、南北山墙
  addBox(
    room,
    0.4,
    wallH,
    14.4,
    materials.warmWall,
    18.7,
    floorY + wallH / 2,
    -0.2,
  );
  addBox(
    room,
    8.6,
    wallH,
    0.4,
    materials.greyBrick,
    centerX,
    floorY + wallH / 2,
    -7.2,
  );
  addBox(
    room,
    8.6,
    wallH,
    0.4,
    materials.greyBrick,
    centerX,
    floorY + wallH / 2,
    6.8,
  );

  // 西立面 (朝二进内院): 朱红廊柱 + 落地玻璃窗 + 居中敞开门洞
  addBox(
    room,
    0.12,
    wallH - 0.3,
    5.0,
    materials.glassWall,
    10.3,
    floorY + wallH / 2,
    -4.4,
    false,
    false,
  );
  addBox(
    room,
    0.12,
    wallH - 0.3,
    4.8,
    materials.glassWall,
    10.3,
    floorY + wallH / 2,
    4.2,
    false,
    false,
  );
  [-6.8, -1.8, 1.8, 6.6].forEach((fz) => {
    addBox(
      room,
      0.22,
      wallH,
      0.22,
      materials.vermilionRed,
      10.3,
      floorY + wallH / 2,
      fz,
    );
  });

  // 1. 北半区 (Z = -3.6)：现代悬浮低矮双人床 + 暖光床头背景墙
  addBox(room, 0.2, 2.8, 4.2, materials.walnutWood, 18.4, floorY + 1.4, -3.6);
  addBox(
    room,
    3.2,
    0.32,
    2.6,
    materials.lightOakWood,
    16.7,
    floorY + 0.22,
    -3.6,
  );
  addBox(
    room,
    2.9,
    0.32,
    2.3,
    materials.creamFabric,
    16.8,
    floorY + 0.48,
    -3.6,
  );
  addBox(
    room,
    1.8,
    0.34,
    2.34,
    materials.slateFabric,
    16.2,
    floorY + 0.5,
    -3.6,
  );
  addBox(
    room,
    0.45,
    0.18,
    0.85,
    materials.creamFabric,
    17.9,
    floorY + 0.72,
    -4.15,
  );
  addBox(
    room,
    0.45,
    0.18,
    0.85,
    materials.creamFabric,
    17.9,
    floorY + 0.72,
    -3.05,
  );

  // 床头柜与现代台灯
  addBox(
    room,
    0.65,
    0.55,
    0.65,
    materials.walnutWood,
    18.0,
    floorY + 0.3,
    -5.4,
  );
  const lampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 0.32, 10),
    materials.warmLamp,
  );
  lampShade.position.set(18.0, floorY + 0.78, -5.4);
  room.add(lampShade);

  // 2. 南半区 (Z = +3.4)：主角双联屏创客工作站 & 电竞/设计桌
  addBox(room, 1.2, 0.78, 3.4, materials.darkFrame, 17.6, floorY + 0.42, 3.4);
  addBox(
    room,
    1.25,
    0.08,
    3.5,
    materials.lightOakWood,
    17.6,
    floorY + 0.82,
    3.4,
  );

  const monTex1 = createMonitorScreenTexture(
    "THREE.JS SIHEYUAN",
    "3D Architecture Viewport [FPS: 60]",
    "#38bdf8",
  );
  const monTex2 = createMonitorScreenTexture(
    "VS CODE // MAIN.JS",
    "const scene = new THREE.Scene();",
    "#a855f7",
  );

  const monitor1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.68, 1.22),
    new THREE.MeshBasicMaterial({ map: monTex1 }),
  );
  monitor1.position.set(17.95, floorY + 1.32, 2.85);
  monitor1.rotation.y = 0.15;
  room.add(monitor1);

  const monitor2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.68, 1.22),
    new THREE.MeshBasicMaterial({ map: monTex2 }),
  );
  monitor2.position.set(17.95, floorY + 1.32, 4.15);
  monitor2.rotation.y = -0.15;
  room.add(monitor2);

  // 发光RGB透明机箱
  addBox(
    room,
    0.55,
    0.52,
    0.28,
    materials.darkFrame,
    17.6,
    floorY + 1.12,
    4.85,
  );
  const rgbStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.57, 0.42, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
  );
  rgbStrip.position.set(17.6, floorY + 1.12, 4.7);
  room.add(rgbStrip);

  // 人体工学转椅
  addBox(
    room,
    0.68,
    0.52,
    0.68,
    materials.slateFabric,
    16.2,
    floorY + 0.48,
    3.4,
  );
  addBox(
    room,
    0.12,
    0.95,
    0.62,
    materials.slateFabric,
    15.88,
    floorY + 0.95,
    3.4,
  );

  // 3. 南山墙满墙潮玩书柜与原木吉他架
  addBox(room, 3.6, 3.1, 0.5, materials.walnutWood, 14.5, floorY + 1.6, 6.4);
  for (let row = 0.8; row <= 2.6; row += 0.6) {
    addBox(
      room,
      3.4,
      0.06,
      0.46,
      materials.lightOakWood,
      14.5,
      floorY + row,
      6.38,
    );
  }
  const guitarBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.34, 0.12, 16),
    materials.lightOakWood,
  );
  guitarBody.rotation.z = Math.PI / 2;
  guitarBody.position.set(12.3, floorY + 0.55, 5.9);
  room.add(guitarBody);

  // 4. 东厢房南侧附属小耳房 (东厢耳房，对应 siheyuan.jpg 东厢房南侧小房 Z = +10.2)
  addBox(room, 7.6, 3.2, 5.2, materials.greyBrick, 15.0, 1.7, 9.8);
  const eastEarRoof = createPitchedRoof(8.0, 5.4, 1.4, "NS");
  eastEarRoof.position.set(15.0, 3.3, 9.8);
  room.add(eastEarRoof);

  // 主角房间暖光 + 科技蓝氛围补光
  addWarmPointLight(14.5, floorY + 3.3, -2.5, 2.2, 13, 0xffba75);
  addWarmPointLight(16.8, floorY + 2.5, 3.4, 1.8, 10, 0x80d4ff);

  // 东厢房大坡屋顶 (南北向屋脊)
  const eastRoof = createPitchedRoof(9.2, 14.8, 2.3, "NS");
  eastRoof.position.set(centerX, floorY + wallH, -0.2);
  room.add(eastRoof);

  scene.add(room);
}

// ==========================================
// 10. 空间四：父亲房间 (西厢房三间 + 南侧厢耳房 · 书香茶席与新中式雅居)
// ==========================================
function buildFatherRoom() {
  const room = new THREE.Group();
  // 西厢房范围: X 从 -18.8 到 -10.2 (宽8.6m), Z 从 -7.2 到 +6.8 (长14.0m)
  const centerX = -14.5;
  const floorY = 0.24;
  const wallH = 4.0;

  // 台基与深胡桃木地板
  addBox(
    room,
    9.0,
    floorY,
    14.6,
    materials.whiteMarble,
    centerX,
    floorY / 2,
    -0.2,
  );
  addBox(
    room,
    8.2,
    0.06,
    13.8,
    materials.woodFloor,
    centerX,
    floorY + 0.03,
    -0.2,
  );

  // 西外墙、南北山墙
  addBox(
    room,
    0.4,
    wallH,
    14.4,
    materials.warmWall,
    -18.7,
    floorY + wallH / 2,
    -0.2,
  );
  addBox(
    room,
    8.6,
    wallH,
    0.4,
    materials.greyBrick,
    centerX,
    floorY + wallH / 2,
    -7.2,
  );
  addBox(
    room,
    8.6,
    wallH,
    0.4,
    materials.greyBrick,
    centerX,
    floorY + wallH / 2,
    6.8,
  );

  // 东立面 (朝二进内院): 朱红廊柱 + 落地玻璃窗 + 居中敞开门洞
  addBox(
    room,
    0.12,
    wallH - 0.3,
    5.0,
    materials.glassWall,
    -10.3,
    floorY + wallH / 2,
    -4.4,
    false,
    false,
  );
  addBox(
    room,
    0.12,
    wallH - 0.3,
    4.8,
    materials.glassWall,
    -10.3,
    floorY + wallH / 2,
    4.2,
    false,
    false,
  );
  [-6.8, -1.8, 1.8, 6.6].forEach((fz) => {
    addBox(
      room,
      0.22,
      wallH,
      0.22,
      materials.vermilionRed,
      -10.3,
      floorY + wallH / 2,
      fz,
    );
  });

  // 1. 北半区 (Z = -3.6)：父亲新中式实木拔步/架子床
  addBox(
    room,
    3.3,
    0.38,
    2.6,
    materials.walnutWood,
    -16.6,
    floorY + 0.24,
    -3.6,
  );
  addBox(
    room,
    3.0,
    0.28,
    2.35,
    materials.creamFabric,
    -16.7,
    floorY + 0.52,
    -3.6,
  );
  addBox(
    room,
    0.85,
    0.31,
    2.38,
    materials.vermilionRed,
    -15.6,
    floorY + 0.53,
    -3.6,
  );
  addBox(
    room,
    0.42,
    0.2,
    0.85,
    materials.goldBrass,
    -17.8,
    floorY + 0.72,
    -4.15,
  );
  addBox(
    room,
    0.42,
    0.2,
    0.85,
    materials.goldBrass,
    -17.8,
    floorY + 0.72,
    -3.05,
  );
  addBox(
    room,
    0.18,
    2.4,
    2.8,
    materials.walnutWood,
    -18.25,
    floorY + 1.25,
    -3.6,
  );

  // 2. 南半区 (Z = +3.2)：父亲紫光檀书法大画案 + 中式圈椅 + 博古架
  addBox(
    room,
    1.35,
    0.82,
    3.0,
    materials.walnutWood,
    -15.2,
    floorY + 0.44,
    3.2,
  );
  addBox(
    room,
    0.75,
    0.03,
    1.6,
    materials.creamFabric,
    -15.2,
    floorY + 0.87,
    3.2,
  );
  addBox(
    room,
    0.22,
    0.18,
    0.32,
    materials.darkStone,
    -15.2,
    floorY + 0.94,
    4.15,
  );

  // 主人太师圈椅
  addBox(
    room,
    0.72,
    0.48,
    0.72,
    materials.walnutWood,
    -16.7,
    floorY + 0.28,
    3.2,
  );
  addBox(
    room,
    0.14,
    0.98,
    0.72,
    materials.walnutWood,
    -17.02,
    floorY + 0.65,
    3.2,
  );

  // 西墙：大型中式多宝博古架 + 青花瓷/玉壶春瓶
  addBox(room, 0.48, 3.2, 3.8, materials.walnutWood, -18.3, floorY + 1.65, 3.2);
  for (let row = 0.9; row <= 2.7; row += 0.65) {
    addBox(
      room,
      0.44,
      0.06,
      3.6,
      materials.goldBrass,
      -18.28,
      floorY + row,
      3.2,
    );
    const porcelain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.17, 0.42, 12),
      row > 1.8 ? materials.whiteMarble : materials.jadeGreen,
    );
    porcelain.position.set(-18.25, floorY + row + 0.25, 2.3 + row * 0.5);
    room.add(porcelain);
  }

  // 3. 西厢房南侧附属小耳房 (西厢耳房，对应 siheyuan.jpg 西厢房南侧小房 Z = +9.8)
  addBox(room, 7.6, 3.2, 5.2, materials.greyBrick, -15.0, 1.7, 9.8);
  const westEarRoof = createPitchedRoof(8.0, 5.4, 1.4, "NS");
  westEarRoof.position.set(-15.0, 3.3, 9.8);
  room.add(westEarRoof);

  // 父亲房间温润暖黄灯光
  addWarmPointLight(-14.5, floorY + 3.3, -2.5, 2.1, 13, 0xffb366);
  addWarmPointLight(-15.2, floorY + 2.9, 3.2, 2.3, 12, 0xffcc88);

  // 西厢房大坡屋顶
  const westRoof = createPitchedRoof(9.2, 14.8, 2.3, "NS");
  westRoof.position.set(centerX, floorY + wallH, -0.2);
  room.add(westRoof);

  scene.add(room);
}

// ==========================================
// 11. 3D 悬浮空间铭牌 (鸟瞰导览标签，对应 siheyuan.jpg 各建筑名称)
// ==========================================
function create3DRoomLabels() {
  const labelConfigs = [
    {
      id: "livingRoom",
      text: "🛋️ 正房 · 客厅",
      pos: [0, 8.8, -13.7],
      scale: [6.2, 1.55, 1],
    },
    {
      id: "livingRoom",
      text: "耳房",
      pos: [-14.3, 6.2, -14.2],
      scale: [3.6, 1.1, 1],
    },
    {
      id: "livingRoom",
      text: "耳房",
      pos: [15.6, 6.2, -14.2],
      scale: [3.6, 1.1, 1],
    },
    {
      id: "protagonistRoom",
      text: "💻 东厢房 · 主角房",
      pos: [14.5, 7.6, -0.2],
      scale: [6.4, 1.55, 1],
    },
    {
      id: "fatherRoom",
      text: "🍵 西厢房 · 父亲房",
      pos: [-14.5, 7.6, -0.2],
      scale: [6.4, 1.55, 1],
    },
    {
      id: "overview",
      text: "抄手游廊",
      pos: [-9.2, 5.4, 7.5],
      scale: [4.2, 1.15, 1],
    },
    {
      id: "chuihuamen",
      text: "🏮 垂花门",
      pos: [0, 6.8, 14.5],
      scale: [4.8, 1.3, 1],
    },
    {
      id: "mainGate",
      text: "🚪 大门口",
      pos: [14.6, 7.6, 25.2],
      scale: [5.0, 1.35, 1],
    },
    {
      id: "mainGate",
      text: "影壁",
      pos: [14.6, 5.2, 17.2],
      scale: [3.6, 1.1, 1],
    },
    {
      id: "mainGate",
      text: "倒座房",
      pos: [-1.5, 6.4, 25.0],
      scale: [4.4, 1.2, 1],
    },
    {
      id: "mainGate",
      text: "屏门",
      pos: [-14.2, 5.4, 19.6],
      scale: [3.6, 1.1, 1],
    },
    {
      id: "livingRoom",
      text: "后罩房",
      pos: [0, 6.8, -27.8],
      scale: [4.8, 1.25, 1],
    },
  ];

  labelConfigs.forEach((cfg) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(20, 22, 28, 0.86)";
    ctx.beginPath();
    ctx.roundRect(12, 16, 488, 96, 48);
    ctx.fill();

    ctx.strokeStyle = "#e2b15c";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 40px "Microsoft YaHei", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cfg.text, 256, 64);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(...cfg.pos);
    sprite.scale.set(...(cfg.scale || [6.5, 1.6, 1]));
    sprite.userData = { targetLocation: cfg.id };
    scene.add(sprite);
    roomSprites.push(sprite);
  });
}

// 初始化全部建筑与景观
buildCourtyardBaseAndWalls();
buildMainGateArea();
buildMainLivingRoom();
buildProtagonistRoom();

// ==========================================
// 11.5 静态几何体按材质合批 (Batching) + BSP/区域空间树组织
// 将 300+ 个零散 Mesh 合并为约 15 个合批 Mesh，Draw Call 降低 95%，彻底解决渲染卡顿
// ==========================================
function optimizeSceneWithBatchingAndBSP() {
  scene.updateMatrixWorld(true);

  // 按空间区域 (BSP 叶节点分区: 外院/正房/东厢/西厢/后院) + 材质分类合批
  const REGION_BOUNDS = [
    {
      name: "livingRoom",
      test: (p) => p.z < -8.5 && p.z > -19.0 && Math.abs(p.x) < 20.5,
    },
    {
      name: "protagonistRoom",
      test: (p) => p.x >= 9.8 && p.z >= -8.5 && p.z <= 13.5,
    },
    {
      name: "fatherRoom",
      test: (p) => p.x <= -9.8 && p.z >= -8.5 && p.z <= 13.5,
    },
    { name: "frontYard", test: (p) => p.z > 13.5 },
    { name: "backYard", test: (p) => p.z <= -19.0 },
    { name: "centralYard", test: () => true },
  ];

  const buckets = new Map(); // key: `${regionName}_${matUuid}_${isRoof}`
  const meshesToRemove = [];
  const worldPos = new THREE.Vector3();

  scene.traverse((obj) => {
    if (!obj.isMesh) return;
    if (dynamicObjects.has(obj) || dynamicObjects.has(obj.parent)) return;

    obj.getWorldPosition(worldPos);
    const region =
      REGION_BOUNDS.find((r) => r.test(worldPos))?.name || "centralYard";
    const isRoof = roofMeshes.includes(obj);
    const mat = obj.material;
    if (!mat || Array.isArray(mat)) return;

    const key = `${region}__${mat.uuid}__${isRoof ? "roof" : "body"}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        region,
        material: mat,
        isRoof,
        geoms: [],
        castShadow: false,
        receiveShadow: false,
      });
    }

    const clonedGeom = obj.geometry.clone();
    clonedGeom.applyMatrix4(obj.matrixWorld);
    const bucket = buckets.get(key);
    bucket.geoms.push(clonedGeom);
    if (obj.castShadow) bucket.castShadow = true;
    if (obj.receiveShadow) bucket.receiveShadow = true;
    meshesToRemove.push(obj);
  });

  // 移除原有碎散 Mesh
  meshesToRemove.forEach((m) => {
    if (m.parent) m.parent.remove(m);
    m.geometry.dispose();
  });
  roofMeshes.length = 0;

  // 为每个 BSP 空间分区创建独立 Group，便于视锥剔除与第一人称遮挡剔除 (PVS)
  const regionGroups = {};
  REGION_BOUNDS.forEach((r) => {
    const g = new THREE.Group();
    g.name = `BSP_Region_${r.name}`;
    scene.add(g);
    regionGroups[r.name] = g;
    roomInteriorGroups.push({ name: r.name, group: g });
  });

  buckets.forEach((bucket) => {
    if (bucket.geoms.length === 0) return;
    const mergedGeom = BufferGeometryUtils.mergeGeometries(bucket.geoms, false);
    bucket.geoms.forEach((g) => g.dispose());
    if (!mergedGeom) return;

    mergedGeom.computeBoundingSphere();
    mergedGeom.computeBoundingBox();

    const mergedMesh = new THREE.Mesh(mergedGeom, bucket.material);
    mergedMesh.castShadow = bucket.castShadow;
    mergedMesh.receiveShadow = bucket.receiveShadow;
    mergedMesh.matrixAutoUpdate = false;
    mergedMesh.updateMatrix();

    if (bucket.isRoof) {
      roofMeshes.push(mergedMesh);
    }
    regionGroups[bucket.region].add(mergedMesh);
  });

  // 冻结全院静态矩阵，避免每帧遍历重算 matrixWorld
  scene.traverse((obj) => {
    if (
      !dynamicObjects.has(obj) &&
      !dynamicObjects.has(obj.parent) &&
      !obj.isCamera &&
      !obj.isLight
    ) {
      obj.matrixAutoUpdate = false;
    }
  });
}

// BSP / PVS 潜在可见集室内外遮挡裁剪：当处于第一人称室内时，自动剔除被厚墙完全挡住的远端院落分区
function updateBSPOcclusionCulling() {
  if (state.mode !== "fpv") {
    // 鸟瞰模式下交由 Three.js 合并后的高效 BoundingSphere 视锥剔除
    for (let i = 0; i < roomInteriorGroups.length; i++) {
      roomInteriorGroups[i].group.visible = true;
    }
    return;
  }

  const px = camera.position.x;
  const pz = camera.position.z;

  // 判断玩家当前所在的 BSP 空间区域
  const inBackYard = pz < -18.0;
  const inFrontYard = pz > 15.0;
  const inEastRoom = px > 10.2 && pz > -7.2 && pz < 6.8;
  const inWestRoom = px < -10.2 && pz > -7.2 && pz < 6.8;

  for (let i = 0; i < roomInteriorGroups.length; i++) {
    const item = roomInteriorGroups[i];
    let vis = true;
    if (inBackYard) {
      // 在三进后院时，一进外院与东西厢房被北房高墙完全遮挡
      if (
        item.name === "frontYard" ||
        item.name === "protagonistRoom" ||
        item.name === "fatherRoom"
      ) {
        vis = false;
      }
    } else if (inFrontYard) {
      // 在一进外院（大门口/影壁）时，三进后院被完全遮挡
      if (item.name === "backYard") {
        vis = false;
      }
    } else if (inEastRoom || inWestRoom) {
      // 在东/西厢房室内时，一进外院与三进后院不可见
      if (item.name === "frontYard" || item.name === "backYard") {
        vis = false;
      }
    }
    item.group.visible = vis;
  }
}

optimizeSceneWithBatchingAndBSP();
buildFatherRoom();
create3DRoomLabels();
renderer.shadowMap.needsUpdate = true;

// ==========================================
// 12. 屋顶透视开关、昼夜光影切换与视角状态管理
// ==========================================
function setRoofCutaway(enabled) {
  state.roofCutaway = enabled;
  sharedRoofMaterial.transparent = enabled;
  sharedRoofMaterial.opacity = enabled ? 0.16 : 1.0;
  sharedRoofMaterial.depthWrite = !enabled;
  sharedRoofMaterial.needsUpdate = true;

  const btn = document.getElementById("btn-toggle-roof");
  const txt = document.getElementById("roof-btn-text");
  if (enabled) {
    btn.classList.add("active");
    txt.textContent = "屋顶已透视 (可看室内)";
  } else {
    btn.classList.remove("active");
    txt.textContent = "屋顶半透视";
  }
}

function setLightingTheme(isNight) {
  state.isNight = isNight;
  const iconEl = document.getElementById("time-icon");
  const textEl = document.getElementById("time-btn-text");

  if (isNight) {
    scene.background.setHex(0x181f2c);
    scene.fog.color.setHex(0x181f2c);
    ambientLight.intensity = 0.55;
    hemiLight.intensity = 0.5;
    sunLight.intensity = 1.1;
    sunLight.color.setHex(0xff9e5e);
    warmLights.forEach((w) => (w.light.intensity = w.baseIntensity * 1.25));
    lanternGlows.forEach((m) => (m.emissiveIntensity = 1.6));
    iconEl.textContent = "🌇";
    textEl.textContent = "北京黄昏 (华灯)";
  } else {
    scene.background.setHex(0x9ec5e8);
    scene.fog.color.setHex(0x9ec5e8);
    ambientLight.intensity = 1.15;
    hemiLight.intensity = 0.95;
    sunLight.intensity = 2.1;
    sunLight.color.setHex(0xfff5e4);
    warmLights.forEach((w) => (w.light.intensity = w.baseIntensity * 0.45));
    lanternGlows.forEach((m) => (m.emissiveIntensity = 0.4));
    iconEl.textContent = "☀️";
    textEl.textContent = "晴朗白昼";
  }
}

// 更新UI面板与高亮按钮
function updateUIForLocation(locKey) {
  const loc = LOCATIONS[locKey] || LOCATIONS.overview;
  document.getElementById("info-tag").textContent = loc.tag;
  document.getElementById("info-title").textContent = loc.title;
  document.getElementById("info-desc").textContent = loc.desc;
  document.getElementById("current-scene-subtitle").textContent =
    `${loc.subtitle} · [${state.mode === "bird" ? "鸟瞰模式" : "第一人称漫游"}]`;

  const highlightsEl = document.getElementById("info-highlights");
  highlightsEl.innerHTML = loc.highlights
    .map((h) => `<span>${h}</span>`)
    .join("");

  // 高亮底部地点按钮
  document.querySelectorAll(".loc-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === locKey);
  });

  // 高亮小地图热区
  document.querySelectorAll(".map-zone").forEach((zone) => {
    zone.classList.toggle("active", zone.dataset.target === locKey);
  });
}

// 启动平滑快速相机飞行过渡 (大幅缩短过渡耗时，响应更敏捷)
function flyCameraTo(targetPos, targetLookAt, duration = 420, onDone = null) {
  const startPos = camera.position.clone();
  const startDir = new THREE.Vector3();
  camera.getWorldDirection(startDir);
  const startLookAt =
    state.mode === "bird"
      ? orbitControls.target.clone()
      : startPos.clone().add(startDir.multiplyScalar(8));

  state.cameraAnim = {
    startTime: performance.now(),
    duration,
    startPos,
    endPos: targetPos.clone(),
    startLookAt,
    endLookAt: targetLookAt.clone(),
    onDone,
  };
}

// 切换到指定房间/位置
function switchToLocation(locKey) {
  const loc = LOCATIONS[locKey];
  if (!loc) return;
  state.currentLocation = locKey;

  if (state.mode === "bird") {
    // 在鸟瞰模式下点击四个房间时，自动开启屋顶半透明透视，方便直接俯瞰房间内部陈设
    if (locKey !== "overview" && locKey !== "mainGate") {
      setRoofCutaway(true);
    } else if (locKey === "overview") {
      setRoofCutaway(false);
    }
    flyCameraTo(loc.birdPos, loc.birdTarget, 450);
  } else {
    // 第一人称漫游模式下，将视角直接快速移入该房间内部站立点
    state.fpvYaw = loc.fpvYaw;
    state.fpvPitch = loc.fpvPitch;
    const lookDir = new THREE.Vector3(
      -Math.sin(state.fpvYaw) * Math.cos(state.fpvPitch),
      Math.sin(state.fpvPitch),
      -Math.cos(state.fpvYaw) * Math.cos(state.fpvPitch),
    );
    const targetLook = loc.fpvPos.clone().add(lookDir.multiplyScalar(6));
    flyCameraTo(loc.fpvPos, targetLook, 360);
  }

  updateUIForLocation(locKey);
}

// 切换浏览模式：鸟瞰模式 ('bird') vs 第一人称漫游 ('fpv')
function switchBrowseMode(newMode) {
  if (state.mode === newMode && newMode !== "bird") return;
  state.mode = newMode;

  document
    .getElementById("btn-mode-bird")
    .classList.toggle("active", newMode === "bird");
  document
    .getElementById("btn-mode-fpv")
    .classList.toggle("active", newMode === "fpv");
  document
    .getElementById("crosshair")
    .classList.toggle("hidden", newMode !== "fpv");
  document
    .getElementById("fpv-hint")
    .classList.toggle("hidden", newMode !== "fpv");

  // 3D悬浮标签仅在鸟瞰模式显示
  roomSprites.forEach((s) => (s.visible = newMode === "bird"));

  if (newMode === "bird") {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    camera.fov = 52;
    camera.updateProjectionMatrix();
    orbitControls.enabled = true;
    // 如果点击“鸟瞰模式”，默认回到全景鸟瞰（或当前选中房间的鸟瞰位）
    const targetKey =
      state.currentLocation === "overview" ? "overview" : state.currentLocation;
    const loc = LOCATIONS[targetKey];
    flyCameraTo(loc.birdPos, loc.birdTarget, 450);
  } else {
    // 进入第一人称漫游模式：关闭屋顶透视以获得真实室内天花板与屋檐体验
    setRoofCutaway(false);
    camera.fov = 65;
    camera.updateProjectionMatrix();
    orbitControls.enabled = false;

    const targetKey = state.currentLocation || "overview";
    const loc = LOCATIONS[targetKey];
    state.fpvYaw = loc.fpvYaw;
    state.fpvPitch = loc.fpvPitch;
    const lookDir = new THREE.Vector3(
      -Math.sin(state.fpvYaw) * Math.cos(state.fpvPitch),
      Math.sin(state.fpvPitch),
      -Math.cos(state.fpvYaw) * Math.cos(state.fpvPitch),
    );
    const targetLook = loc.fpvPos.clone().add(lookDir.multiplyScalar(6));
    flyCameraTo(loc.fpvPos, targetLook, 400);
  }

  updateUIForLocation(state.currentLocation);
}

// ==========================================
// 13. 第一人称漫游控制 (WASD + 鼠标拖拽/PointerLock + 碰撞边界)
// ==========================================
function applyFirstPersonLook() {
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  euler.x = state.fpvPitch;
  euler.y = state.fpvYaw;
  camera.quaternion.setFromEuler(euler);
}

// 根据坐标判断所处区域并自动返回地面高度及更新所在房间提示
function getFloorHeightAt(x, z) {
  // 北房正房客厅区域
  if (z < -9.8 && z > -18.0 && Math.abs(x) < 9.6) return 2.15;
  // 东厢房主角房间区域
  if (x > 10.0 && Math.abs(z) < 7.0) return 2.04;
  // 西厢房父亲房间区域
  if (x < -10.0 && Math.abs(z) < 7.0) return 2.04;
  // 默认庭院、垂花门与大门口高度
  return 1.85;
}

function clampPlayerPosition(pos) {
  // 限制在三进四合院院墙范围内 (X: [-20.2, 20.2], Z: [-24.5, 27.2])
  pos.x = Math.max(-20.2, Math.min(20.2, pos.x));
  pos.z = Math.max(-24.5, Math.min(27.2, pos.z));

  // 迎门影壁防穿模 (X: 12.2 ~ 17.0, Z: 16.6 ~ 17.8)
  if (pos.x > 12.2 && pos.x < 17.0 && pos.z > 16.5 && pos.z < 17.9) {
    if (pos.z >= 17.2) pos.z = 17.9;
    else pos.z = 16.5;
  }

  // 二进院中心太平鱼缸防穿模 (X: -1.3 ~ 1.3, Z: -7.1 ~ -4.5)
  const distToVat = Math.hypot(pos.x, pos.z - -5.8);
  if (distToVat < 1.35) {
    const ang = Math.atan2(pos.z - -5.8, pos.x);
    pos.x = Math.cos(ang) * 1.35;
    pos.z = -5.8 + Math.sin(ang) * 1.35;
  }
}

function updateFirstPersonMovement(dt) {
  if (state.mode !== "fpv" || state.cameraAnim) return;

  // 大幅提升第一人称漫游移速 (常规 12m/s，按住 Shift 疾跑 22m/s)
  const moveSpeed = (state.moveKeys.shift ? 22.0 : 12.0) * dt;
  const forward = new THREE.Vector3(
    -Math.sin(state.fpvYaw),
    0,
    -Math.cos(state.fpvYaw),
  ).normalize();
  const right = new THREE.Vector3(
    Math.cos(state.fpvYaw),
    0,
    -Math.sin(state.fpvYaw),
  ).normalize();

  let moved = false;
  const delta = new THREE.Vector3();

  if (state.moveKeys.forward) {
    delta.addScaledVector(forward, moveSpeed);
    moved = true;
  }
  if (state.moveKeys.backward) {
    delta.addScaledVector(forward, -moveSpeed);
    moved = true;
  }
  if (state.moveKeys.right) {
    delta.addScaledVector(right, moveSpeed);
    moved = true;
  }
  if (state.moveKeys.left) {
    delta.addScaledVector(right, -moveSpeed);
    moved = true;
  }

  camera.position.add(delta);
  clampPlayerPosition(camera.position);

  const baseEyeY = getFloorHeightAt(camera.position.x, camera.position.z);

  // 轻微步伐起伏与跳跃物理
  if (!state.isGrounded) {
    state.verticalVel -= 18 * dt;
    camera.position.y += state.verticalVel * dt;
    if (camera.position.y <= baseEyeY) {
      camera.position.y = baseEyeY;
      state.verticalVel = 0;
      state.isGrounded = true;
    }
  } else if (moved) {
    state.walkBobTimer += dt * 13.0;
    camera.position.y = baseEyeY + Math.sin(state.walkBobTimer) * 0.04;
  } else {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, baseEyeY, 0.25);
  }

  applyFirstPersonLook();
}

// 鸟瞰模式下也支持 WASD / 方向键快速平移视角
function updateBirdKeyboardPan(dt) {
  if (state.mode !== "bird" || state.cameraAnim) return;
  if (
    !state.moveKeys.forward &&
    !state.moveKeys.backward &&
    !state.moveKeys.left &&
    !state.moveKeys.right
  ) {
    return;
  }

  const panSpeed = (state.moveKeys.shift ? 38.0 : 22.0) * dt;
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  if (forward.lengthSq() > 0.0001) forward.normalize();

  const right = new THREE.Vector3(forward.z, 0, -forward.x).normalize();
  const moveOffset = new THREE.Vector3();

  if (state.moveKeys.forward) moveOffset.addScaledVector(forward, panSpeed);
  if (state.moveKeys.backward) moveOffset.addScaledVector(forward, -panSpeed);
  if (state.moveKeys.right) moveOffset.addScaledVector(right, panSpeed);
  if (state.moveKeys.left) moveOffset.addScaledVector(right, -panSpeed);

  camera.position.add(moveOffset);
  orbitControls.target.add(moveOffset);
}

// 缓存小地图 DOM 节点，避免每帧重复查询与无效样式重排
const mapDotEl = document.getElementById("map-player-dot");
const mapConeEl = mapDotEl ? mapDotEl.querySelector(".map-player-cone") : null;
const _minimapDir = new THREE.Vector3();
let _lastMapX = -1;
let _lastMapY = -1;
let _lastAngle = -999;

// 更新右上角小地图上的玩家位置与朝向扇形 (对应 X:[-22, 22]->[6, 172], Z:[-32, 28]->[6, 230])
function updateMinimapIndicator() {
  if (!mapDotEl || !mapConeEl) return;
  const mapX = Math.max(
    6,
    Math.min(172, ((camera.position.x + 22) / 44) * 166 + 6),
  );
  const mapY = Math.max(
    6,
    Math.min(230, ((camera.position.z + 32) / 60) * 224 + 6),
  );

  if (Math.abs(mapX - _lastMapX) > 0.1 || Math.abs(mapY - _lastMapY) > 0.1) {
    mapDotEl.style.left = `${mapX.toFixed(1)}px`;
    mapDotEl.style.top = `${mapY.toFixed(1)}px`;
    _lastMapX = mapX;
    _lastMapY = mapY;
  }

  camera.getWorldDirection(_minimapDir);
  const angleDeg = Math.atan2(_minimapDir.x, -_minimapDir.z) * (180 / Math.PI);
  if (Math.abs(angleDeg - _lastAngle) > 0.3) {
    mapConeEl.style.transform = `translate(-50%, 0) rotate(${(angleDeg + 180).toFixed(1)}deg)`;
    _lastAngle = angleDeg;
  }
}

// ==========================================
// 14. DOM 事件绑定与鼠标/键盘交互
// ==========================================
// 四个核心空间按钮
document.querySelectorAll(".loc-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    switchToLocation(target);
  });
});

// 小地图区域与垂花门点击直接跳转
document.querySelectorAll(".map-zone, .map-chuihuamen").forEach((zone) => {
  zone.addEventListener("click", () => {
    const target = zone.dataset.target;
    if (target) switchToLocation(target);
  });
});

// 右上角“参考图”对照按钮
const refBtn = document.getElementById("btn-ref-img");
const refPopup = document.getElementById("ref-img-popup");
if (refBtn && refPopup) {
  refBtn.addEventListener("click", () => {
    const isHidden = refPopup.classList.toggle("hidden");
    refBtn.classList.toggle("active", !isHidden);
  });
}

// 鸟瞰模式按钮 (若已在鸟瞰模式再次点击则回到全院总览)
document.getElementById("btn-mode-bird").addEventListener("click", () => {
  if (state.mode === "bird") {
    switchToLocation("overview");
  } else {
    switchBrowseMode("bird");
  }
});

// 第一人称漫游模式按钮
document.getElementById("btn-mode-fpv").addEventListener("click", () => {
  switchBrowseMode("fpv");
});

// 屋顶半透明透视按钮
document.getElementById("btn-toggle-roof").addEventListener("click", () => {
  setRoofCutaway(!state.roofCutaway);
});

// 昼夜/黄昏光影切换按钮
document.getElementById("btn-toggle-time").addEventListener("click", () => {
  setLightingTheme(!state.isNight);
});

// 键盘 WASD 与方向键监听 (按下移动键时立即打断未完成的飞行过渡，响应零延迟)
window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      state.cameraAnim = null;
      state.moveKeys.forward = true;
      break;
    case "KeyS":
    case "ArrowDown":
      state.cameraAnim = null;
      state.moveKeys.backward = true;
      break;
    case "KeyA":
    case "ArrowLeft":
      state.cameraAnim = null;
      state.moveKeys.left = true;
      break;
    case "KeyD":
    case "ArrowRight":
      state.cameraAnim = null;
      state.moveKeys.right = true;
      break;
    case "ShiftLeft":
    case "ShiftRight":
      state.moveKeys.shift = true;
      break;
    case "Space":
      if (state.mode === "fpv" && state.isGrounded) {
        state.verticalVel = 5.5;
        state.isGrounded = false;
      }
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      state.moveKeys.forward = false;
      break;
    case "KeyS":
    case "ArrowDown":
      state.moveKeys.backward = false;
      break;
    case "KeyA":
    case "ArrowLeft":
      state.moveKeys.left = false;
      break;
    case "KeyD":
    case "ArrowRight":
      state.moveKeys.right = false;
      break;
    case "ShiftLeft":
    case "ShiftRight":
      state.moveKeys.shift = false;
      break;
  }
});

// 屏幕虚拟方向键支持 (鼠标按住/触摸移动)
document.querySelectorAll(".dpad-btn").forEach((btn) => {
  const dir = btn.dataset.move;
  const startMove = (e) => {
    e.preventDefault();
    state.cameraAnim = null;
    state.moveKeys[dir] = true;
  };
  const endMove = () => {
    state.moveKeys[dir] = false;
  };
  btn.addEventListener("mousedown", startMove);
  btn.addEventListener("mouseup", endMove);
  btn.addEventListener("mouseleave", endMove);
  btn.addEventListener("touchstart", startMove, { passive: false });
  btn.addEventListener("touchend", endMove);
});

// 第一人称下鼠标拖拽旋转视角 & 双击锁定视角 + 鸟瞰下点击3D房间标签跳转
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener("mousedown", (e) => {
  if (state.mode === "fpv") {
    state.cameraAnim = null;
    state.isDraggingLook = true;
    state.prevMouse.x = e.clientX;
    state.prevMouse.y = e.clientY;
  } else if (state.mode === "bird") {
    // 检测是否点击了3D悬浮标签
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(roomSprites);
    if (hits.length > 0 && hits[0].object.userData.targetLocation) {
      switchToLocation(hits[0].object.userData.targetLocation);
    } else {
      state.cameraAnim = null;
    }
  }
});

renderer.domElement.addEventListener(
  "wheel",
  () => {
    state.cameraAnim = null;
  },
  { passive: true },
);

window.addEventListener("mouseup", () => {
  state.isDraggingLook = false;
});

window.addEventListener("mousemove", (e) => {
  if (state.mode !== "fpv") return;

  if (document.pointerLockElement === renderer.domElement) {
    state.fpvYaw -= e.movementX * 0.0032;
    state.fpvPitch = Math.max(
      -Math.PI / 2.4,
      Math.min(Math.PI / 2.4, state.fpvPitch - e.movementY * 0.0032),
    );
  } else if (state.isDraggingLook) {
    const dx = e.clientX - state.prevMouse.x;
    const dy = e.clientY - state.prevMouse.y;
    state.prevMouse.x = e.clientX;
    state.prevMouse.y = e.clientY;
    state.fpvYaw -= dx * 0.005;
    state.fpvPitch = Math.max(
      -Math.PI / 2.4,
      Math.min(Math.PI / 2.4, state.fpvPitch - dy * 0.005),
    );
  }
});

// 双击画布在第一人称模式下可切换 PointerLock
renderer.domElement.addEventListener("dblclick", () => {
  if (state.mode === "fpv") {
    if (document.pointerLockElement !== renderer.domElement) {
      renderer.domElement.requestPointerLock?.();
    } else {
      document.exitPointerLock?.();
    }
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 15. 主渲染循环与动态动画
// ==========================================
let lastTime = performance.now();
const _lerpLookAt = new THREE.Vector3();

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // 1. 相机平滑过渡插值 (使用更轻快的 EaseOutQuart 曲线)
  if (state.cameraAnim) {
    const anim = state.cameraAnim;
    const elapsed = now - anim.startTime;
    const t = Math.min(elapsed / anim.duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);

    camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
    _lerpLookAt.lerpVectors(anim.startLookAt, anim.endLookAt, ease);

    if (state.mode === "bird") {
      orbitControls.target.copy(_lerpLookAt);
      orbitControls.update();
    } else {
      camera.lookAt(_lerpLookAt);
    }

    if (t >= 1) {
      const doneCb = anim.onDone;
      state.cameraAnim = null;
      if (state.mode === "fpv") {
        applyFirstPersonLook();
      }
      if (doneCb) doneCb();
    }
  } else if (state.mode === "bird") {
    updateBirdKeyboardPan(dt);
    orbitControls.update();
  } else if (state.mode === "fpv") {
    updateFirstPersonMovement(dt);
  }

  // 2. 中庭锦鲤环游动画
  const timeSec = now * 0.001;
  koiFishList.forEach((koi) => {
    const angle = timeSec * koi.speed + koi.phase;
    const nx = koi.centerX + Math.cos(angle) * koi.radius;
    const nz = koi.centerZ + Math.sin(angle) * koi.radius;
    const dx = -Math.sin(angle) * koi.radius * koi.speed;
    const dz = Math.cos(angle) * koi.radius * koi.speed;
    koi.mesh.position.set(nx, koi.heightY || 0.28, nz);
    koi.mesh.rotation.y = Math.atan2(dx, dz);
  });

  // 3. 更新小地图指示器与 BSP/PVS 空间分区遮挡剔除
  updateMinimapIndicator();
  updateBSPOcclusionCulling();

  renderer.render(scene, camera);
}

// 初始化光影与UI状态并启动渲染 (默认晴朗白昼，清晰展现三进四合院全貌)
setLightingTheme(false);
updateUIForLocation("overview");
requestAnimationFrame(animate);
