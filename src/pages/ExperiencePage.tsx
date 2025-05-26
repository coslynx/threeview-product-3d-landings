import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';
import {
  OrbitControls,
  useProgress,
  AdaptiveDpr,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  SSAO,
} from '@react-three/postprocessing';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import MinimalLayout from 'src/components/layout/MinimalLayout';
import { GLTF, useGLTF } from 'three-stdlib';
import { useMediaQuery } from 'react-responsive';

interface ExperiencePageProps {}

interface PerformanceMonitorProps {
  scene: THREE.Scene;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ scene }) => {
  const frameCount = useRef(0);
  const lastMeasurement = useRef(performance.now());
  const { gl } = useThree();

  useFrame(() => {
    frameCount.current++;
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastMeasurement.current;
      const fps = frameCount.current / (elapsed / 1000);

      console.log(`FPS: ${fps.toFixed(2)}`);

      frameCount.current = 0;
      lastMeasurement.current = now;
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

interface Adaptive3DSceneProps {
  quality: 'low' | 'medium' | 'high';
}

const Adaptive3DScene: React.FC<Adaptive3DSceneProps> = ({ quality }) => {
  const { scene, gl, camera } = useThree();
  const gltf = useGLTF('/models/chart.glb') as GLTF;

  useEffect(() => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.outputEncoding = THREE.sRGBEncoding;
      scene.background = new THREE.Color(0x000000);

      // Set shadow properties for all meshes in the scene
      scene.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
          }
      });
  }, [gl, scene]);

  useFrame(() => {
      //There should be an animation for this object here.
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 0, 5]} intensity={0.6} />
      <primitive object={gltf.scene} dispose={null} />
    </>
  );
};

const ExperiencePage: React.FC<ExperiencePageProps> = () => {
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();
  const isMediumDevice = useMediaQuery({ minWidth: 768 });
  const isHighDevice = useMediaQuery({ minWidth: 1200 });

  const quality = useMemo(() => {
    if (!isMediumDevice) return 'low';
    if (!isHighDevice) return 'medium';
    return 'high';
  }, [isMediumDevice, isHighDevice]);

  const loadingText = useMemo(() => `Loading... ${progress.toFixed(2)}%`, [progress]);

  useEffect(() => {
    if (progress === 100) {
      setLoading(false);
    }
  }, [progress]);

  return (
    <MinimalLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Immersive Experience</h1>
        {loading ? (
          <div className="text-center">{loadingText}</div>
        ) : (
          <Suspense fallback={<div className="text-center">Loading scene...</div>}>
            <Canvas shadows style={{ height: '500px' }}>
              <Adaptive3DScene quality={quality} />
              <OrbitControls />
            </Canvas>
            <PerformanceMonitor scene={useThree().scene} />
          </Suspense>
        )}
      </div>
    </MinimalLayout>
  );
};

export default ExperiencePage;