import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF, useGLTF, Html } from '@react-three/drei';

import { useToggle } from 'src/hooks/useToggle';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import 'src/styles/components/landing-hero.css';

export interface LandingHeroProps {}

const LandingHero: React.FC<LandingHeroProps> = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.3 } },
  };

  const HeroScene = () => {
    const { scene } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (!scene) return;

      const geometry = new THREE.IcosahedronGeometry(1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.7, roughness: 0.1 });
      const logoMesh = new THREE.Mesh(geometry, material);
      logoMesh.name = 'logoMesh';
      logoMesh.position.set(0, 0, 0);
      logoMesh.scale.set(0.7, 0.7, 0.7);
      scene.add(logoMesh);
      meshRef.current = logoMesh;

      return () => {
        scene.remove(logoMesh);
        geometry.dispose();
        material.dispose();
      };
    }, [scene]);

    useThree(({ gl, scene }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.outputEncoding = THREE.sRGBEncoding;
      scene.background = new THREE.Color(0x000000);
    });

    useThree(({ camera }) => {
      camera.position.set(0, 0, 3);
    });

    useFrame((state) => {
      if (!meshRef.current) return;
      meshRef.current.rotation.x = state.clock.getElapsedTime() / 2000;
      meshRef.current.rotation.y = state.clock.getElapsedTime() / 1000;
    });

    return null;
  };

  return (
    <motion.section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-purple-700 opacity-50 z-0"></div>
      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          variants={textVariants}
        >
          Data to Brilliance
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-8"
          variants={textVariants}
        >
          Visualize complex data and unlock actionable insights.
        </motion.p>
        <motion.div variants={textVariants}>
          <Link
            to="/features"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Explore Features
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 md:h-2/3 z-0">
        <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 0, 5]} intensity={0.6} />
          <HeroScene />
        </Canvas>
      </div>
    </motion.section>
  );
};

export default LandingHero;