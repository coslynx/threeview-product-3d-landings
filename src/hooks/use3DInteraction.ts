import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Vector2 } from 'three';
import { three3DHelpersUtil } from 'src/utils/three-helpers';

export interface InteractionContext {
  /**
   * Selects an object in the scene.
   * @param object The object to select.
   */
  selectObject: (object: THREE.Object3D | null) => void;
  /**
   * Highlights an object in the scene.
   * @param object The object to highlight.
   */
  highlightObject: (object: THREE.Object3D | null) => void;
  /**
   * Resets the object to the default material.
   * @param object The object to reset.
   */
  resetObject: (object: THREE.Object3D | null) => void;
}

/**
 * Provides base functionality for any implementation.
 */
const raycast = (
  camera: THREE.Camera,
  scene: THREE.Scene,
  mouse: THREE.Vector2,
  objects: THREE.Object3D[]
) => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(objects);
};

/**
 * Custom React hook for managing user interactions (mouse, touch, keyboard) with 3D objects in a Three.js scene.
 * @returns {{ selectObject: Function, highlightObject: Function, resetObject: Function }} Returns functions.
 */
export function use3DInteraction(): InteractionContext {
  const { scene, camera, gl } = useThree();
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const highlightColor = useRef<THREE.Color>(new THREE.Color(0x00ffff));
  const tempColor = useRef<THREE.Color>(new THREE.Color());

  const selectObject = useCallback((object: THREE.Object3D | null) => {
    setSelectedObject(object);
  }, []);

  const highlightObject = useCallback((object: THREE.Object3D | null) => {
    if (!object || !(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshStandardMaterial)) return;
    tempColor.current.copy(object.material.color);
    object.material.color.set(highlightColor.current);
    object.material.emissiveIntensity = 0.5;
    object.material.needsUpdate = true;
  }, []);

  const resetObject = useCallback((object: THREE.Object3D | null) => {
    if (!object || !(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshStandardMaterial)) return;
    object.material.color.copy(tempColor.current);
    object.material.emissiveIntensity = 0;
    object.material.needsUpdate = true;
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (selectedObject) {
          console.log('Keyboard interaction with', selectedObject.name);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedObject]);

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      if (!scene || !camera) return;

      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      const intersectedObjects = raycast(camera, scene, mouse, scene.children);

      if (intersectedObjects.length > 0) {
        const intersectedObject = intersectedObjects[0].object;
      }
    };

    document.addEventListener('mousemove', handlePointerMove);
    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
    };
  }, [scene, camera]);

  return {
    selectObject,
    highlightObject,
    resetObject
  };
}