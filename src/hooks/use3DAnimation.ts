import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

/**
 * @internal
 */
let _uuidCount = 0;

export interface AnimationContext {
  /**
   * Get the GLTF animation mixer.
   */
  mixer: THREE.AnimationMixer | null;
  /**
   * GSAP tween or timeline.
   */
  timeline: GSAPTimeline | null;
  /**
   * List of actions in scene from the GLTF.
   */
  actions: { [name: string]: THREE.AnimationAction };
  /**
   * starts an animation.
   * @param actionName
   * @returns boolean true
   */
  startAnimation: (actionName: string) => boolean;
  /**
   * Pause the current animation.
   * @param actionName
   * @returns boolean true
   */
  pauseAnimation: (actionName: string) => boolean;
  /**
   * Stop the current animation.
   *
   * @param actionName string name of the action
   * @returns boolean
   */
  stopAnimation: (actionName: string) => boolean;
  /**
   * Restart the animation back to the original.
   *
   * @param actionName string name of the action to be reset.
   * @returns boolean
   */
  resetAnimation: (actionName: string) => boolean;
  /**
   * All properties loaded, you can set code to run in here.
   */
  onLoadComplete?: () => void;
}

export function use3DAnimation(): AnimationContext {
  const { scene } = useThree();
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const timeline = useRef<GSAPTimeline | null>(null);
  const actions = useRef<{ [name: string]: THREE.AnimationAction }>({});
  const uuid = useRef<string>((() => `use-animation-hook-id-${_uuidCount++}`)());
  const [loadComplete, setLoadComplete] = useState(false);
  const onCompleted = useRef<(() => void) | null>(null);

  const startAnimation = useCallback((actionName: string): boolean => {
    if (!actions.current[actionName]) {
      console.warn(`Animation "${actionName}" not found.`);
      return false;
    }

    actions.current[actionName].reset().play();
    return true;
  }, []);

  const pauseAnimation = useCallback((actionName: string): boolean => {
    if (!actions.current[actionName]) {
      console.warn(`Animation "${actionName}" not found.`);
      return false;
    }

    actions.current[actionName].pause();
    return true;
  }, []);

  const stopAnimation = useCallback((actionName: string): boolean => {
    if (!actions.current[actionName]) {
      console.warn(`Animation "${actionName}" not found.`);
      return false;
    }

    actions.current[actionName].stop();
    return true;
  }, []);

  const resetAnimation = useCallback((actionName: string): boolean => {
    if (!actions.current[actionName]) {
      console.warn(`Animation "${actionName}" not found.`);
      return false;
    }

    actions.current[actionName].reset();
    return true;
  }, []);

  useEffect(() => {
    if (!scene) return;

    mixer.current = new THREE.AnimationMixer(scene);
    timeline.current = gsap.timeline();

    scene.traverse((object: THREE.Object3D) => {
      if ((object as any).animations) {
        (object as any).animations.forEach((animationClip: THREE.AnimationClip) => {
          const action = mixer.current!.clipAction(animationClip, object);
          actions.current[animationClip.name] = action;
        });
      }
    });

    setLoadComplete(true);
    if (onCompleted.current) {
      onCompleted.current();
    }

    return () => {
      timeline.current?.kill();
      mixer.current?.uncacheRoot(scene);
      mixer.current = null;
      actions.current = {};
    };
  }, [scene]);

  return {
    mixer: mixer.current || null,
    timeline: timeline.current,
    actions: actions.current,
    startAnimation,
    pauseAnimation,
    stopAnimation,
    resetAnimation,
    onLoadComplete: onCompleted.current || undefined,
  };
}