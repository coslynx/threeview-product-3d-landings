import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import type { ThreeSceneProps, SceneObject } from './threeSceneTypes';

interface ThreeSceneContextType {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  add: (object: SceneObject) => void;
  remove: (object: SceneObject) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
}

const ThreeSceneContext = React.createContext<ThreeSceneContextType | undefined>(undefined);

const useThreeScene = (): ThreeSceneContextType => {
  const context = React.useContext(ThreeSceneContext);
  if (!context) {
    throw new Error('useThreeScene must be used within a ThreeScene component');
  }
  return context;
};

export { useThreeScene };

extend({ THREE });

const ThreeScene: React.FC<ThreeSceneProps> = ({
  cameraPosition = [0, 0, 5],
  cameraFov = 75,
  backgroundColor = 0x000000,
  fogColor = 0x000000,
  fogNear = 1,
  fogFar = 1000,
  children,
}) => {
  const { scene, gl, camera, size } = useThree();
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  const add = useCallback((object: SceneObject) => {
    scene.add(object);
  }, [scene]);

  const remove = useCallback((object: SceneObject) => {
    scene.remove(object);
  }, [scene]);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputEncoding = THREE.sRGBEncoding;
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = cameraFov;
        camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        cameraRef.current = camera;
    }
    sceneRef.current = scene;

    ambientLightRef.current = new THREE.AmbientLight(0xffffff, 0.3);
    directionalLightRef.current = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLightRef.current.position.set(0, 0, 5);
    scene.add(ambientLightRef.current);
    scene.add(directionalLightRef.current);

    return () => {
      gl.dispose();
      three3DHelpersUtil.disposeScene(scene);
      scene.remove(ambientLightRef.current!);
      scene.remove(directionalLightRef.current!);
      ambientLightRef.current!.dispose();
      directionalLightRef.current!.dispose();

      //Attempt to set references to null
      sceneRef.current = null;
      cameraRef.current = null;
      ambientLightRef.current = null;
      directionalLightRef.current = null;
    };
  }, [gl, scene, backgroundColor, fogColor, fogNear, fogFar, cameraFov, cameraPosition, camera, size]);

  useFrame(() => {
    //This function could be used to perform animation functions for lighting or other scene configuration
    //It is kept blank to maintain a clear scope for responsibilities
  });

  const contextValue = useMemo(() => ({
      scene,
      camera: camera as THREE.PerspectiveCamera,
      renderer: gl,
      add,
      remove,
      setQuality,
  }), [scene, camera, gl, add, remove, setQuality]);

  return (
    <ThreeSceneContext.Provider value={contextValue}>
      <AdaptiveDpr pixelated />
      {children}
    </ThreeSceneContext.Provider>
  );
};

export interface ThreeSceneProps {
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  backgroundColor?: number;
  fogColor?: number;
  fogNear?: number;
  fogFar?: number;
  children?: React.ReactNode;
}

export interface SceneObject extends THREE.Object3D { }

export default ThreeScene;