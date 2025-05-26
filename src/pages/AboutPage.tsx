import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, OrbitControls, Html } from '@react-three/drei';
import { GLTF, useGLTF } from 'three-stdlib';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import MinimalLayout from 'src/components/layout/MinimalLayout';
import { useProgress } from '@react-three/drei';

import 'src/styles/pages/home.css';

interface AboutPageProps {}

interface AboutPageAssets {
  scene: THREE.Scene | null;
  gltf: GLTF | null;
  loading: boolean;
  progress: number;
}

const useAboutPageAssets = (): AboutPageAssets => {
  const { scene } = useThree();
  const gltf = useGLTF('/models/chart.glb');
  const { progress } = useProgress();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
      setLoading(progress < 100);
  }, [progress]);

  return { scene, gltf, loading, progress };
};

const AboutPageThreeJSScene = () => {
  const { scene } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!scene) return;

    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.7, roughness: 0.1 });
    const logoMesh = new THREE.Mesh(geometry, material);
    logoMesh.name = 'logoMesh';
    logoMesh.position.set(0, 1, 0);
    logoMesh.scale.set(0.3, 0.3, 0.3);
    scene.add(logoMesh);
    meshRef.current = logoMesh;

    return () => {
      scene.remove(logoMesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() / 2000;
    meshRef.current.rotation.y = state.clock.getElapsedTime() / 1000;
  });

  return null;
};

const AboutPage: React.FC<AboutPageProps> = () => {
  const { scene, gltf, loading, progress } = useAboutPageAssets();

  return (
    <MinimalLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Our company is dedicated to providing innovative solutions for data
          visualization and analysis. We are passionate about helping businesses
          unlock insights from their data and make better decisions.
        </p>
        <p className="mb-4">
          Our flagship product is a powerful SaaS platform that combines
          cutting-edge 3D graphics with advanced analytics techniques. We believe
          that data should be accessible and understandable for everyone.
        </p>

        {loading ? (
          <div className="text-center">Loading... {progress.toFixed(2)}%</div>
        ) : (
          <div className="relative h-64">
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 2, 5]} intensity={0.7} />
              <AboutPageThreeJSScene />
              <OrbitControls/>
            </Canvas>
          </div>
        )}
      </div>
    </MinimalLayout>
  );
};

export default AboutPage;