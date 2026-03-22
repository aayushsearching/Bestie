"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const StarryBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showStars) return;
    
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
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
          vec3 finalColor = vec3(0.0);
          
          // Layered stars for depth
          for(float i = 0.0; i < 4.0; i++) {
            float size = i * 15.0 + 20.0;
            vec2 p = uv * size;
            vec2 id = floor(p);
            vec2 f = fract(p) - 0.5;
            
            float r = hash(id);
            if(r > 0.94) {
              float d = length(f);
              float star = 0.002 / (d * size * 0.1);
              float twinkle = sin(iTime * (r * 2.0) + r * 10.0) * 0.5 + 0.5;
              finalColor += star * twinkle * vec3(0.9, 0.9, 1.0);
            }
          }
          
          gl_FragColor = vec4(finalColor, finalColor.r);
        }
      `,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const animate = () => {
      material.uniforms.iTime.value += 0.01;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
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
  }, [showStars]);

  return (
    <AnimatePresence>
      {showStars && (
        <motion.div
          key="stars"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <div ref={containerRef} className="w-full h-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StarryBackground;
