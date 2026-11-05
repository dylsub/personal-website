import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// A 3DS modelled in millimetres after the real thing: two 134 × 74 halves,
// each about 10.5 thick, hinged at the back. The base lies on the table
// (y up, z toward the viewer); the lid stands on the hinge, leaning back.
const W = 134;
const D = 74;
const T = 10.5;
const LID_LEAN = THREE.MathUtils.degToRad(16);

const AQUA = "#1d9ccf";

// The canvas runs this far past its box on every side (as a share of the
// box's width), so the corners don't clip when the console is turned
// diagonally. The view is widened to match, so the model stays the size
// it would be in the box alone.
const BLEED = 0.3;
const FOV = 26;

type Options = {
  photo: string;
  stamp: string;
  /** Font families as CSS sees them, for text drawn into the screens */
  labelFont: string;
  roundedFont: string;
};

export type DSScene = { dispose: () => void };

/**
 * Builds the 3DS into `host` and returns a way to tear it down. It renders
 * on demand: once on load, then only while it's being turned.
 */
export async function createDS(
  host: HTMLElement,
  { photo, stamp, labelFont, roundedFont }: Options,
): Promise<DSScene> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  // Each material takes the studio reflections directly, at its own
  // strength. (Set as scene.environment instead, three.js applies one
  // strength to every material and ignores theirs.)
  const studio = pmrem.fromScene(room, 0.04).texture;
  room.dispose();

  // Lit from up and off to the left, like a desk lamp. Behind the camera,
  // the black panels would mirror it straight back and read as grey.
  const sun = new THREE.DirectionalLight("#ffffff", 1.4);
  sun.position.set(-220, 200, -40);
  scene.add(sun);

  // ---------- Materials ----------
  const shell = new THREE.MeshPhysicalMaterial({
    envMap: studio,
    envMapIntensity: 0.6,
    color: AQUA,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  // Glossy black: a dim reflection, so it reads as black with a sheen
  // The lid faces up toward the studio's ceiling lights, which are very
  // bright; even a small reflection of them turns black to grey.
  const gloss = new THREE.MeshStandardMaterial({
    color: "#07090c",
    roughness: 0.35,
    envMap: studio,
    envMapIntensity: 0.12,
  });
  const plastic = new THREE.MeshStandardMaterial({
    envMap: studio,
    envMapIntensity: 0.35,
    color: "#2a3037",
    roughness: 0.55,
  });
  const recess = new THREE.MeshStandardMaterial({
    envMap: studio,
    envMapIntensity: 0.2,
    color: "#06080a",
    roughness: 0.7,
  });
  const chrome = new THREE.MeshStandardMaterial({
    envMap: studio,
    envMapIntensity: 1,
    color: "#c8ced4",
    metalness: 1,
    roughness: 0.25,
  });

  // ---------- Screen textures ----------
  await document.fonts.ready;
  const [topTexture, bottomTexture] = await Promise.all([
    topScreen(photo, stamp, labelFont),
    Promise.resolve(bottomScreen(roundedFont)),
  ]);
  for (const t of [topTexture, bottomTexture]) {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }
  const lit = (map: THREE.Texture) =>
    new THREE.MeshBasicMaterial({ map, toneMapped: false });

  const roundedPlane = (w: number, h: number, r: number) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return new THREE.ShapeGeometry(s, 8);
  };

  const ds = new THREE.Group();
  scene.add(ds);

  // ---------- Base ----------
  const base = new THREE.Group();
  ds.add(base);
  const baseBody = new THREE.Mesh(new RoundedBoxGeometry(W, T, D, 6, 4), shell);
  baseBody.position.y = T / 2;
  base.add(baseBody);

  // Things set into the base's top face, laid flat on it
  const onBase = (mesh: THREE.Object3D, x: number, z: number, lift = 0.02) => {
    mesh.position.set(x, T + lift, z);
    base.add(mesh);
    return mesh;
  };
  const flat = (geometry: THREE.BufferGeometry, material: THREE.Material) => {
    const m = new THREE.Mesh(geometry, material);
    m.rotation.x = -Math.PI / 2;
    return m;
  };

  onBase(flat(roundedPlane(W - 5, D - 5, 3.5), gloss), 0, 0);
  onBase(flat(roundedPlane(66, 50.5, 1), recess), 0, -9, 0.04);
  onBase(
    flat(new THREE.PlaneGeometry(61.5, 46), lit(bottomTexture)),
    0,
    -9,
    0.06,
  );

  // Circle pad: a concave-topped disc in a dark ring
  onBase(
    new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.6, 40), recess),
    -49,
    -18,
  );
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7.4, 2.2, 40),
    plastic,
  );
  onBase(pad, -49, -18, 1.1);

  // D-pad
  for (const [w, d] of [
    [14, 4.6],
    [4.6, 14],
  ]) {
    onBase(
      new THREE.Mesh(new RoundedBoxGeometry(w, 1.6, d, 2, 0.6), plastic),
      -47,
      7,
      0.8,
    );
  }

  // A, B, X, Y in a diamond
  for (const [dx, dz] of [
    [0, -7.5],
    [-7.5, 0],
    [7.5, 0],
    [0, 7.5],
  ]) {
    onBase(
      new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 1.8, 28), plastic),
      49 + dx,
      -13 + dz,
      0.9,
    );
  }

  // SELECT, HOME, START along the front, and the power button
  for (const [x, w] of [
    [-14, 7],
    [14, 7],
  ]) {
    onBase(
      new THREE.Mesh(new RoundedBoxGeometry(w, 1, 2.4, 2, 1), plastic),
      x,
      29,
      0.5,
    );
  }
  onBase(
    new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 24), plastic),
    0,
    29,
    0.5,
  );
  onBase(
    new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1, 24), plastic),
    52,
    26,
    0.5,
  );

  // ---------- Hinge ----------
  const hingeAt = new THREE.Vector3(0, T + 1, -D / 2 + 1);
  const hinge = new THREE.Mesh(
    new THREE.CylinderGeometry(5.6, 5.6, W - 10, 32),
    shell,
  );
  hinge.rotation.z = Math.PI / 2;
  hinge.position.copy(hingeAt);
  ds.add(hinge);
  for (const [x, color] of [
    [44, "#8fdcff"],
    [48, "#1d3b4c"],
  ] as const) {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 12, 12),
      new THREE.MeshBasicMaterial({ color, toneMapped: false }),
    );
    led.position.set(x, hingeAt.y, hingeAt.z + 5.4);
    ds.add(led);
  }

  // ---------- Lid ----------
  // Built upright with its inner face toward +z, then leaned back on the hinge
  const lid = new THREE.Group();
  lid.position.copy(hingeAt);
  lid.rotation.x = -LID_LEAN;
  ds.add(lid);
  const lidBody = new THREE.Mesh(new RoundedBoxGeometry(W, D, T, 6, 4), shell);
  lidBody.position.set(0, D / 2 + 2, -T / 2);
  lid.add(lidBody);

  const onLid = (mesh: THREE.Object3D, x: number, y: number, lift = 0.02) => {
    mesh.position.set(x, D / 2 + 2 + y, lift);
    lid.add(mesh);
    return mesh;
  };
  onLid(new THREE.Mesh(roundedPlane(W - 5, D - 5, 3.5), gloss), 0, 0);
  onLid(new THREE.Mesh(roundedPlane(83, 52, 1), recess), 0, 2, 0.04);
  onLid(
    new THREE.Mesh(new THREE.PlaneGeometry(77, 46.2), lit(topTexture)),
    0,
    2,
    0.06,
  );

  // Speaker grilles: a grid of holes either side of the screen
  const holes = new THREE.InstancedMesh(
    new THREE.CircleGeometry(0.55, 12),
    recess,
    2 * 4 * 8,
  );
  const m = new THREE.Matrix4();
  let i = 0;
  for (const side of [-1, 1])
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 8; r++) {
        m.makeTranslation(
          side * 53 + (c - 1.5) * 2.4,
          D / 2 + 2 + 2 + (r - 3.5) * 2.4,
          0.05,
        );
        holes.setMatrixAt(i++, m);
      }
  lid.add(holes);

  // Inner camera, and the 3D slider down the right of the screen
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.4, 0.6, 24),
    chrome,
  );
  lens.rotation.x = Math.PI / 2;
  onLid(lens, 0, 31.5, 0.3);
  onLid(new THREE.Mesh(new THREE.PlaneGeometry(2, 15), recess), 45.5, 12, 0.05);
  onLid(
    new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.6, 1.2), chrome),
    45.5,
    17,
    0.6,
  );

  // ---------- Shadow on the table ----------
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.5, D * 2.2),
    new THREE.MeshBasicMaterial({
      map: shadowTexture(),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.01, -6);
  ds.add(shadow);

  // ---------- Camera and controls ----------
  const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 2000);
  const target = new THREE.Vector3(0, 30, -14);
  camera.position.set(0, 175, 300);
  // Where it starts, kept for lining the model up when the box resizes
  const rest = camera.clone();
  rest.lookAt(target);

  // The two halves' shells, in world space: the model's outline
  scene.updateMatrixWorld();
  const outline: THREE.Vector3[] = [];
  for (const body of [baseBody, lidBody]) {
    const pos = body.geometry.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      outline.push(
        new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(body.matrixWorld),
      );
    }
  }

  // Drags are taken on the box, not the canvas, so the canvas's bleed
  // doesn't catch clicks meant for whatever it overhangs
  const controls = new OrbitControls(camera, host);
  controls.target.copy(target);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.7;
  // Turn it around a good way, but never under the table or past side-on
  controls.minPolarAngle = THREE.MathUtils.degToRad(20);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
  controls.minAzimuthAngle = THREE.MathUtils.degToRad(-70);
  controls.maxAzimuthAngle = THREE.MathUtils.degToRad(70);
  controls.update();
  // Vertical swipes still scroll the page on touch; sideways ones turn it
  host.style.touchAction = "pan-y";

  const render = () => renderer.render(scene, camera);

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const bleed = Math.round(width * BLEED);
    const fullW = width + 2 * bleed;
    const fullH = height + 2 * bleed;
    renderer.setSize(fullW, fullH);
    renderer.domElement.style.left = renderer.domElement.style.top = `${-bleed}px`;

    const fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * (fullH / height)),
    );
    for (const c of [camera, rest]) {
      c.fov = fov;
      c.aspect = fullW / fullH;
      c.updateProjectionMatrix();
    }

    // Slide the view so that, as it starts, the model's right edge sits on
    // the box's right edge
    let right = -Infinity;
    const p = new THREE.Vector3();
    for (const v of outline) right = Math.max(right, p.copy(v).project(rest).x);
    const shift = width + bleed - ((right + 1) / 2) * fullW;
    camera.setViewOffset(fullW, fullH, -shift, 0, fullW, fullH);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  // Draw frames only while it's moving: while dragged, and while the
  // damping eases it to a stop afterwards.
  let raf = 0;
  let still = 0;
  const last = new THREE.Vector3();
  const tick = () => {
    controls.update();
    render();
    still = camera.position.distanceToSquared(last) < 1e-6 ? still + 1 : 0;
    last.copy(camera.position);
    raf = still > 10 ? 0 : requestAnimationFrame(tick);
  };
  const wake = () => {
    still = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  controls.addEventListener("start", wake);
  controls.addEventListener("change", wake);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      topTexture.dispose();
      studio.dispose();
      bottomTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

/** The photo in an old-school camera app, as the top screen shows it. */
async function topScreen(src: string, stamp: string, font: string) {
  const [w, h] = [800, 480];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const img = new Image();
  img.src = src;
  await img.decode();
  ctx.drawImage(img, 0, 0, w, h);

  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgb(0 0 0 / 0.7)";
  ctx.shadowBlur = 6;
  ctx.font = `28px ${font}`;
  ctx.fillText("PHOTO 012/100", 28, 50);

  // Battery
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(w - 92, 26, 58, 30);
  ctx.fillRect(w - 34, 34, 5, 14);
  for (let i = 0; i < 3; i++) ctx.fillRect(w - 86 + i * 17, 32, 13, 18);

  // Viewfinder corners
  ctx.shadowBlur = 4;
  ctx.lineWidth = 4;
  const [x0, y0, x1, y1, l] = [w * 0.15, h * 0.18, w * 0.85, h * 0.82, 44];
  for (const [x, y, dx, dy] of [
    [x0, y0, 1, 1],
    [x1, y0, -1, 1],
    [x0, y1, 1, -1],
    [x1, y1, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x + dx * l, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * l);
    ctx.stroke();
  }

  // The date, burned in orange
  ctx.font = `bold 38px ${font}`;
  ctx.textAlign = "right";
  ctx.shadowColor = "rgb(255 140 40 / 0.9)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ffa03a";
  ctx.fillText(stamp, w - 30, h - 28);

  return new THREE.CanvasTexture(canvas);
}

/** The camera app's controls, on the bottom screen. */
function bottomScreen(font: string) {
  const [w, h] = [640, 480];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#f2f5f8");
  bg.addColorStop(1, "#d6dee6");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, 64);
  ctx.fillStyle = "#c5ced6";
  ctx.fillRect(0, 64, w, 3);
  ctx.fillStyle = "#4b5560";
  ctx.font = `800 34px ${font}`;
  ctx.textAlign = "center";
  ctx.fillText("Camera", w / 2, 44);

  // Shutter
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 + 20, 96, 0, Math.PI * 2);
  ctx.fillStyle = "#c5ced6";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 + 20, 90, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  const red = ctx.createRadialGradient(
    w / 2,
    h / 2 - 10,
    10,
    w / 2,
    h / 2 + 20,
    76,
  );
  red.addColorStop(0, "#ff8a6b");
  red.addColorStop(1, "#e2452a");
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 + 20, 76, 0, Math.PI * 2);
  ctx.fillStyle = red;
  ctx.fill();

  // Two pill buttons along the bottom
  ctx.font = `800 26px ${font}`;
  for (const [x, label] of [
    [96, "Photos"],
    [w - 96, "Effects"],
  ] as const) {
    ctx.beginPath();
    ctx.roundRect(x - 74, h - 72, 148, 48, 24);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#c5ced6";
    ctx.stroke();
    ctx.fillStyle = "#4b5560";
    ctx.fillText(label, x, h - 39);
  }

  return new THREE.CanvasTexture(canvas);
}

/** A soft dark oval, for the console's shadow on the table. */
function shadowTexture() {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgb(0 0 0 / 0.55)");
  g.addColorStop(0.6, "rgb(0 0 0 / 0.25)");
  g.addColorStop(1, "rgb(0 0 0 / 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(canvas);
}
