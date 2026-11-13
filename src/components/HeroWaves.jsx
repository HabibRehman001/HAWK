import { useEffect, useRef } from 'react';

/**
 * HeroWaves: raw WebGL (no dependencies) hero background.
 * Black canvas, layered cyan-blue wave lines, radial blue glow, navy wash at the bottom.
 * Glow drifts slightly toward the cursor. Pauses off-screen, honours reduced motion.
 */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;

const vec3 CYAN = vec3(0.145, 0.663, 0.878); // #25A9E0
const vec3 BLUE = vec3(0.082, 0.396, 0.847); // #1565D8
const vec3 NAVY = vec3(0.039, 0.141, 0.282); // #0A2448

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec2  uv  = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2  p   = vec2((uv.x - 0.5) * asp, uv.y);
  float t   = uTime * 0.35;
  vec2  m   = (uMouse - 0.5);

  vec3 col = vec3(0.0);

  // Radial glow rising from bottom centre, nudged by the cursor
  vec2  c  = vec2(m.x * 0.35, -0.05);
  float d0 = length((p - c) * vec2(0.75, 1.35));
  col += BLUE * exp(-d0 * 2.4) * 0.55;
  col += NAVY * exp(-d0 * 1.1) * 0.95;

  // Navy wash at the bottom
  col += NAVY * smoothstep(0.55, 0.0, uv.y) * 0.5;

  // Layered waves
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float y = 0.20 + fi * 0.036
            + 0.070 * sin(p.x * (1.6 + fi * 0.25) + t * (0.8 + fi * 0.12) + fi * 1.7)
            + 0.035 * sin(p.x * (3.1 - fi * 0.20) - t * 1.1 + fi * 2.3)
            + m.y * 0.04 * (fi + 1.0) / 7.0;

    float d    = abs(uv.y - y);
    float core = smoothstep(0.0035, 0.0, d);
    float halo = exp(-d * 55.0) * 0.35;
    float fill = (y > uv.y) ? exp(-(y - uv.y) * 7.0) * 0.05 : 0.0;

    vec3 tint = mix(CYAN, BLUE, fi / 6.0);
    col += tint * (core * 0.8 + halo) * (1.0 - fi * 0.08) + BLUE * fill;
  }

  // Keep the top near black so headline text stays readable
  col *= mix(1.0, 0.12, smoothstep(0.5, 1.0, uv.y));

  // Soft tone-map + dither (prevents banding in the dark gradients)
  col = 1.0 - exp(-col * 1.3);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 128.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function HeroWaves({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let visible = true;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    const draw = (time) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = () => {
      if (visible) draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(4.0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    resize();
    if (reduce) {
      draw(4.0);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
