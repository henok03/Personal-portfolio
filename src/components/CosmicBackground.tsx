import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Move static texture generation OUTSIDE component to save CPU cycles on mount
function createGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function createStreakTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 8;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 64, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(255,255,255,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 8);
  return new THREE.CanvasTexture(c);
}

const sharedGlowTex = createGlowTexture();
const sharedStreakTex = createStreakTexture();

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallOrTouch = window.innerWidth < 820 || window.matchMedia('(hover:none)').matches;

    if (reduceMotion || isSmallOrTouch) {
      canvas.style.display = 'none';
      return;
    }

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: false,
      powerPreference: 'high-performance' 
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171b22, 0.032);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.2, 13);

    scene.add(new THREE.AmbientLight(0x232a35, 1.0));

    const lightEmerald = new THREE.PointLight(0x8fae94, 3.4, 30);
    lightEmerald.position.set(-6, 4, 4);
    scene.add(lightEmerald);

    const lightAzure = new THREE.PointLight(0x6f8fa8, 3.4, 30);
    lightAzure.position.set(6, -2, 2);
    scene.add(lightAzure);

    // Starfield
    const STAR_COUNT = 150;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa6bccb),
      new THREE.Color(0xb7cdb9),
      new THREE.Color(0xe0c793),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 6;
      const c = starPalette[Math.floor(Math.random() * starPalette.length)];
      starCol[i * 3] = c.r;
      starCol[i * 3 + 1] = c.g;
      starCol[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Nebulae
    const nebulae: THREE.Sprite[] = [];
    const nebulaColors = [0x8fae94, 0x6f8fa8, 0xa08d78, 0xc9a86a];

    for (let i = 0; i < 5; i++) {
      const mat = new THREE.SpriteMaterial({
        map: sharedGlowTex,
        color: nebulaColors[i % nebulaColors.length],
        transparent: true,
        opacity: 0.06 + Math.random() * 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      const scale = 10 + Math.random() * 14;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 22, -10 - Math.random() * 24);
      sprite.userData = {
        speed: 0.03 + Math.random() * 0.05,
        offset: Math.random() * Math.PI * 2,
        baseX: sprite.position.x,
      };
      scene.add(sprite);
      nebulae.push(sprite);
    }

    // Comets
    const comets: THREE.Sprite[] = [];
    const cometColors = [0xffffff, 0xa6bccb, 0xb7cdb9];

    for (let i = 0; i < 3; i++) {
      const mat = new THREE.SpriteMaterial({
        map: sharedStreakTex,
        color: cometColors[i % cometColors.length],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(3.2, 0.09, 1);
      sprite.userData = { delay: Math.random() * 10, active: false, progress: 1 };
      scene.add(sprite);
      comets.push(sprite);
    }

    function launchComet(c: THREE.Sprite) {
      const y = (Math.random() - 0.5) * 14;
      const z = -4 - Math.random() * 14;
      c.position.set(-16, y, z);
      c.userData.angle = -0.18 - Math.random() * 0.1;
      c.userData.progress = 0;
      c.userData.active = true;
      c.material.rotation = c.userData.angle;
    }

    // Interactive Points
    const COUNT = 50;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      const c = starPalette[Math.floor(Math.random() * starPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    function resize() {
      if (!canvas) return;
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let targetX = 0, targetY = 0;
    const mouseNDC = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const attractPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const attractPoint = new THREE.Vector3(0, 0, 0);

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let scrollProgress = 0;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          scrollProgress = max > 0 ? window.scrollY / max : 0;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let isIntersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let visible = true;
    const handleVisibilityChange = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const clock = new THREE.Clock();
    const pos = pGeo.attributes.position;
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!visible || !isIntersecting) return;

      const t = clock.getElapsedTime();

      const camTargetX = targetX * 2.2;
      const camTargetY = 1.2 - targetY * 1.4;
      camera.position.x += (camTargetX - camera.position.x) * 0.03;
      camera.position.y += (camTargetY - camera.position.y) * 0.03;
      camera.position.z = 13 - scrollProgress * 5;
      camera.lookAt(0, 0 - scrollProgress * 1.2, -4);

      stars.rotation.y = t * 0.006;
      starMat.opacity = 0.6 + Math.sin(t * 0.7) * 0.15;

      nebulae.forEach((n) => {
        n.position.x = n.userData.baseX + Math.sin(t * n.userData.speed + n.userData.offset) * 2.4;
        n.position.y += Math.cos(t * n.userData.speed * 0.7 + n.userData.offset) * 0.0015;
      });

      comets.forEach((c) => {
        if (!c.userData.active) {
          c.userData.delay -= 0.016;
          if (c.userData.delay <= 0) launchComet(c);
          return;
        }
        c.userData.progress += 0.012;
        const p = c.userData.progress;
        c.position.x = -16 + p * 34;
        c.position.y += Math.sin(c.userData.angle) * 0.34;
        c.material.opacity = (p < 0.15 ? p / 0.15 : p > 0.8 ? Math.max(0, (1 - p) / 0.2) : 1) * 0.85;
        if (p >= 1) {
          c.userData.active = false;
          c.userData.delay = 4 + Math.random() * 9;
          c.material.opacity = 0;
        }
      });

      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(attractPlane, attractPoint);

      const posArr = pos.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const dx = attractPoint.x - posArr[ix];
        const dy = attractPoint.y - posArr[iy];
        const dz = attractPoint.z - posArr[iz];
        const distSq = dx * dx + dy * dy + dz * dz;
        const force = Math.min(0.9, 3.2 / (distSq + 4));

        velocities[ix] = (velocities[ix] + dx * force * 0.0035) * 0.94;
        velocities[iy] = (velocities[iy] + dy * force * 0.0035) * 0.94;
        velocities[iz] = (velocities[iz] + dz * force * 0.0035) * 0.94;

        posArr[ix] += velocities[ix];
        posArr[iy] += velocities[iy];
        posArr[iz] += velocities[iz];
      }
      pos.needsUpdate = true;

      lightEmerald.position.x = Math.sin(t * 0.3) * 8;
      lightAzure.position.x = Math.cos(t * 0.25) * 8;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      starGeo.dispose();
      starMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1, // CRITICAL: keeps canvas strictly behind all content
        transform: 'translateZ(0)',
      }}
    />
  );
};