import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

import { useToggle } from 'src/hooks/useToggle';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import 'src/styles/layout/header.css';

export interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { toggled, toggle } = useToggle(false);
  const logoRef = useRef<THREE.Mesh>(null);

  const FloatingLogo = () => {
    const { scene } = useThree();
    useEffect(() => {
      if (!scene) return;

      const geometry = new THREE.IcosahedronGeometry(1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.7, roughness: 0.1 });
      const logoMesh = new THREE.Mesh(geometry, material);
      logoMesh.name = 'logoMesh';
      logoMesh.position.set(0, 0, 0);
      logoMesh.scale.set(0.7, 0.7, 0.7);
      scene.add(logoMesh);
      logoRef.current = logoMesh;

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

    useThree(({ gl }) => {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    useThree(({ clock }) => {
      three3DHelpersUtil.optimizeRendering(clock);
    });

    useThree(({ gl, camera, scene }) => {
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    });

    useThree((state) => {
      if (!logoRef.current) return;
      state.gl.setAnimationLoop((time) => {
        if (logoRef.current) {
          logoRef.current.rotation.x = time / 2000;
          logoRef.current.rotation.y = time / 1000;
          state.gl.render(state.scene, state.camera);
        }
      });
    });

    return null;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleThemeHandler = useCallback(() => {
    toggle();
  }, [toggle]);

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.header
      className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 py-4"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{ zIndex: 50 }}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 relative">
            <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[0, 0, 5]} intensity={0.6} />
              <FloatingLogo />
            </Canvas>
          </div>
          <span className="text-xl font-semibold dark:text-white">SaaS Product</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">About</Link>
          <Link to="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Features</Link>
          <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Pricing</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Contact</Link>
        </nav>

        <button
          onClick={toggleThemeHandler}
          className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 transition-colors focus:outline-none"
          aria-label="Toggle Theme"
        >
          {toggled ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
    </motion.header>
  );
};

export default Header;