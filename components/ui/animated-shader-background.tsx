"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const StarryBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width || window.innerWidth, height || window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width || window.innerWidth, height || window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);
          
          // Slow, intentional drift to the right
          uv.x -= iTime * 0.02;
          
          vec3 finalColor = vec3(0.0);
          
          for(float i = 0.0; i < 4.0; i++) {
            float size = i * 10.0 + 10.0;
            vec2 p = uv * size;
            vec2 id = floor(p);
            vec2 f = fract(p) - 0.5;
            
            float r = hash(id);
            if(r > 0.6) { // HIGH FREQUENCY
              float d = length(f);
              // Make stars bigger/softer as requested by the image
              float star = 0.005 / (d * size * 0.1); 
              float twinkle = sin(iTime * (r * 3.0) + r * 10.0) * 0.5 + 0.5;
              finalColor += star * twinkle * vec3(1.0); // Pure white stars
            }
          }
          
          gl_FragColor = vec4(finalColor, clamp(length(finalColor), 0.0, 1.0));
        }
      `,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const animate = () => {
      material.uniforms.iTime.value += 0.015;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      material.uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
};

export default StarryBackground;
