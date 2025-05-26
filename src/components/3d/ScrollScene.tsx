import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import { ModelLoader } from 'src/components/3d/ModelLoader';
import { useScrollAnimation } from 'src/hooks/useScrollAnimation';
import { use3DAnimation } from 'src/hooks/use3DAnimation';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import 'src/styles/components/scroll-scene.css';

extend({ ScrollTrigger });

export interface ScrollSceneProps {
  modelPath: string;
  animationName?: string;
  sections: { start: string; end: string }[];
}

const ScrollScene: React.FC<ScrollSceneProps> = ({ modelPath, animationName, sections }) => {
  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { gl, camera, scene } = useThree();
  const { scrollY } = useScrollAnimation(sceneRef);
  const { actions, mixer } = use3DAnimation();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers = sections.map((section, index) => {
      return ScrollTrigger.create({
        trigger: `.section-${index + 1}`,
        scroller: window,
        start: section.start,
        end: section.end,
        onEnter: () => {
          console.log(`Entered section ${index + 1}`);
        },
        onLeave: () => {
          console.log(`Left section ${index + 1}`);
        },
        onUpdate: (self) => {
          if (cameraRef.current) {
            cameraRef.current.position.z = 5 + self.progress * 5;
            if (modelRef.current) {
              modelRef.current.rotation.y = self.progress * Math.PI;
            }
          }
        },
        markers: false,
        id: `ScrollTrigger-${index + 1}`,
      });
    });

    return () => {
      triggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, [sections]);

  useFrame(() => {
    if (mixer) mixer.update(0.016);
  });

  return (
    <group ref={modelRef}>
      <ModelLoader modelPath={modelPath} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 0, 5]} intensity={0.6} />
    </group>
  );
};

export default ScrollScene;