(function () {
  "use strict";

  const canvas = document.getElementById("webgl-canvas");
  if (!canvas || !window.THREE) return;

  let renderer, scene, camera, points, rafId;
  let w = window.innerWidth, h = window.innerHeight;

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
      camera.position.z = 28;

      const count = Math.floor(Math.max(1200, Math.min(4200, (w * h) / 260)));
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);

      // Золотая пыль + немного холодных оттенков (очень мягко)
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3 + 0] = (Math.random() - 0.5) * 80;
        pos[i3 + 1] = (Math.random() - 0.5) * 50;
        pos[i3 + 2] = (Math.random() - 0.5) * 60;

        const gold = 0.7 + Math.random() * 0.3;
        col[i3 + 0] = 0.6 + 0.4 * gold;
        col[i3 + 1] = 0.45 + 0.35 * gold;
        col[i3 + 2] = 0.15 + 0.2 * Math.random();
      }
      geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geom.setAttribute("color", new THREE.BufferAttribute(col, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      points = new THREE.Points(geom, mat);
      scene.add(points);

      animate();
      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("mousemove", onMouse, { passive: true });
    } catch (e) {
      // если WebGL не доступен — просто оставляем обычный фон
      console.warn("WebGL init failed:", e);
    }
  }

  let mx = 0, my = 0;
  function onMouse(e) {
    mx = (e.clientX / w - 0.5) * 1.0;
    my = (e.clientY / h - 0.5) * 1.0;
  }

  function onResize() {
    w = window.innerWidth; h = window.innerHeight;
    if (!renderer || !camera) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!points || !renderer) return;

    points.rotation.y += 0.0008;
    points.rotation.x += 0.0004;

    // параллакс от мыши
    points.rotation.y += mx * 0.0006;
    points.rotation.x += my * 0.0006;

    renderer.render(scene, camera);
  }

  init();
})();