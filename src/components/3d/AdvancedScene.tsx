import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { FXAA } from 'three/examples/jsm/postprocessing/EffectComposer';
import { Bloom, DepthOfField, EffectComposer, SSAO } from '@react-three/postprocessing';
import { AdaptiveDpr, useHelper } from '@react-three/drei';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import { useTheme } from 'src/hooks/useToggle';

export const AdvancedScene = () => {
  const { scene, gl, camera } = useThree();
  const composer = useRef<THREE.EffectComposer>(null);
  const bloomRef = useRef<any>(null);
  const ssaoRef = useRef<any>(null);
  const depthOfFieldRef = useRef<any>(null);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputEncoding = THREE.sRGBEncoding;
    scene.background = new THREE.Color(0x000000);
  }, [gl, scene]);

  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  useFrame((state, delta) => {
  });

  return (
    <>
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 0, 5]} intensity={0.6} />
      <EffectComposer multisampling={8} ref={composer} autoClear={false} disableNormalPass>
        <SSAO ref={ssaoRef} intensity={0.25} samples={24} luminanceInfluence={0.6} color="black" />
        <Bloom ref={bloomRef} luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={0.75} />
        <FXAA />
      </EffectComposer>
    </>
  );
};

export default AdvancedScene;