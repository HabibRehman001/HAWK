import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uSize;
  uniform vec2 uPointer;
  uniform float uStrength;

  float ribbon(float y, float center, float width) {
    float d = (y - center) / width;
    return exp(-d * d);
  }

  void main() {
    float aspect = uSize.x / max(uSize.y, 1.0);
    vec2 p = (vUv * 2.0 - 1.0) * vec2(aspect, 1.0);
    float t = uTime;

    // Mouse movement gently pushes the entire signal field.
    vec2 q = p + uPointer * vec2(0.09, 0.045);

    float w1 = -0.27 + 0.15 * sin(q.x * 2.00 - t * 0.27)
                     + 0.035 * sin(q.x * 4.15 + t * 0.18);
    float w2 = -0.47 + 0.13 * sin(q.x * 2.45 - t * 0.22 + 1.5);
    float w3 = -0.70 + 0.10 * sin(q.x * 2.90 + t * 0.18 + 2.6);

    // Soft volumetric light, with narrow luminous wave crests.
    float haze = 0.20 * ribbon(q.y, w1, 0.20)
               + 0.15 * ribbon(q.y, w2, 0.15)
               + 0.09 * ribbon(q.y, w3, 0.13);
    float lines = 0.30 * ribbon(q.y, w1, 0.014)
                + 0.23 * ribbon(q.y, w2, 0.011)
                + 0.13 * ribbon(q.y, w3, 0.009);

    // Energy is concentrated on the right, away from the headline.
    float rightBias = smoothstep(-aspect * 0.9, aspect * 0.7, p.x);
    float focus = mix(0.28, 1.0, rightBias);
    float distanceToGlow = length((p - vec2(aspect * 0.38, -0.41)) * vec2(0.9, 1.5));
    float glow = exp(-2.6 * distanceToGlow * distanceToGlow);

    vec3 cyan = vec3(0.145, 0.663, 0.878);  // #25A9E0
    vec3 blue = vec3(0.098, 0.424, 0.847);
    vec3 navy = vec3(0.039, 0.141, 0.282); // #0A2448

    vec3 color = navy * glow * 0.26;
    color += blue * (haze * 0.58 + glow * 0.075) * focus;
    color += cyan * lines * focus;

    // Keep the top and outer edges nearly pure black.
    float topFade = 1.0 - smoothstep(0.02, 0.93, p.y);
    float vignette = 1.0 - smoothstep(0.8, 2.1, length(p * vec2(0.68, 1.0)));
    color *= topFade * mix(0.52, 1.0, vignette) * uStrength;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function SignalWaves({ strength = 1 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: new THREE.Vector2() },
        uStrength: { value: strength },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const pointerTarget = new THREE.Vector2();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clock = new THREE.Clock();
    let elapsed = 0;

    function resize() {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      material.uniforms.uSize.value.set(width, height);
      if (reducedMotion.matches) renderer.render(scene, camera);
    }

    function movePointer(event) {
      const rect = mount.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        1 - ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2
      );
    }

    function frame() {
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta;
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uPointer.value.lerp(pointerTarget, 0.035);
      renderer.render(scene, camera);
    }

    function syncMotion() {
      renderer.setAnimationLoop(null);
      if (reducedMotion.matches || document.hidden) {
        renderer.render(scene, camera);
      } else {
        clock.getDelta();
        renderer.setAnimationLoop(frame);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    window.addEventListener('pointermove', movePointer, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);
    reducedMotion.addEventListener('change', syncMotion);
    resize();
    syncMotion();

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      window.removeEventListener('pointermove', movePointer);
      document.removeEventListener('visibilitychange', syncMotion);
      reducedMotion.removeEventListener('change', syncMotion);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [strength]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_75%,#0A2448_0%,#000_55%)]"
    />
  );
}
