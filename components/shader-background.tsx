"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const FRAG_SHADER = `
  uniform float iTime;
  uniform vec2 iResolution;

  #define NUM_OCTAVES 4

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.35;
    vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.45;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 shake = vec2(sin(iTime * 0.8) * 0.003, cos(iTime * 1.4) * 0.003);
    vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);

    // Deep navy base
    vec3 navyDeep = vec3(0.02, 0.04, 0.08);
    vec3 navyMid  = vec3(0.0, 0.21, 0.376);
    vec3 gold     = vec3(0.945, 0.66, 0.145);
    vec3 goldWarm = vec3(0.96, 0.78, 0.35);

    // Background: deep navy with subtle radial gradient
    float dist = length(uv - 0.5);
    vec3 bg = mix(navyMid * 0.15, navyDeep, smoothstep(0.0, 0.8, dist));

    // FBM-based nebula field
    float f = fbm(p * 0.4 + vec2(iTime * 0.3, 0.0));
    float f2 = fbm(p * 0.6 + vec2(0.0, iTime * 0.2) + 50.0);

    // Navy aurora strands
    vec4 o = vec4(0.0);
    float fScale = 2.0 + f * 0.5;

    for (float i = 0.0; i < 20.0; i++) {
      vec2 v = p + cos(i * i + (iTime + p.x * 0.06) * 0.02 + i * vec2(13.0, 11.0)) * 3.5
             + vec2(sin(iTime * 2.0 + i) * 0.002, cos(iTime * 2.5 - i) * 0.002);

      float tailNoise = noise(v + vec2(iTime * 0.3, i)) * 0.12 * (1.0 - (i / 20.0));

      // Mix between navy and gold strands
      float goldMix = smoothstep(0.3, 0.7, sin(i * 0.5 + iTime * 0.15) * 0.5 + 0.5);
      vec3 navyStrand = mix(navyMid, navyMid * 1.5, sin(i * 0.3) * 0.5 + 0.5);
      vec3 goldStrand = mix(gold, goldWarm, cos(i * 0.4) * 0.5 + 0.5);

      // Most strands navy, some gold
      float isGold = step(0.75, goldMix);
      vec3 strandColor = mix(navyStrand, goldStrand, isGold * 0.8 + (1.0 - isGold) * 0.05);

      float brightness = exp(sin(i * i + iTime * 0.6)) / length(max(v, vec2(v.x * fScale * 0.015, v.y * 1.5)));
      float thinness = smoothstep(0.0, 1.0, i / 20.0) * 0.6;

      o.rgb += strandColor * brightness * (1.0 + tailNoise * 0.8) * thinness;
      o.a += brightness * thinness * 0.05;
    }

    o.rgb = tanh(pow(o.rgb / 80.0, vec3(1.5)));

    // Golden orb glow in center
    vec2 orbCenter = vec2(0.5, 0.5) + vec2(sin(iTime * 0.3) * 0.03, cos(iTime * 0.4) * 0.02);
    float orbDist = length(uv - orbCenter);
    float orbGlow = exp(-orbDist * 6.0) * 0.12;
    float orbPulse = 0.8 + 0.2 * sin(iTime * 1.2);
    vec3 orbColor = gold * orbGlow * orbPulse;

    // Secondary smaller gold particles
    float particle1 = exp(-length(uv - vec2(0.3 + sin(iTime * 0.5) * 0.1, 0.6 + cos(iTime * 0.7) * 0.08)) * 12.0) * 0.04;
    float particle2 = exp(-length(uv - vec2(0.7 + cos(iTime * 0.4) * 0.08, 0.35 + sin(iTime * 0.6) * 0.1)) * 14.0) * 0.03;
    vec3 particles = gold * (particle1 + particle2);

    // Compose
    vec3 final = bg + o.rgb * 1.3 + orbColor + particles;

    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.4, 1.0, dist * 1.2);
    final *= 0.85 + vignette * 0.15;

    gl_FragColor = vec4(final, 1.0);
  }
`;

export function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(container.clientWidth, container.clientHeight)
        }
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: FRAG_SHADER
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /* -- pause when off-screen -- */
    let isVisible = true;
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    visObserver.observe(container);

    let frameId: number;
    const animate = () => {
      if (isVisible) {
        material.uniforms.iTime.value += 0.016;
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      renderer.setSize(width, height);
      material.uniforms.iResolution.value.set(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      visObserver.disconnect();
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}
