// Utility module providing helper functions for generating and managing sample 3D models
import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * Creates a sample 3D model based on the specified type.
 *
 * @param type - The type of sample model to create ('sphere', 'cube', 'plane').
 * @returns A THREE.Group containing the sample model, or null if the type is invalid.
 */
export function createSampleModel(type: string): THREE.Group | null {
  let geometry: any;

  switch (type) {
    case 'sphere':
      geometry = new THREE.SphereGeometry(1, 32, 32);
      break;
    case 'cube':
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'plane':
      geometry = new THREE.PlaneGeometry(2, 2);
      break;
    default:
      console.error(`Invalid sample model type: ${type}`);
      return null;
  }

  const group = new THREE.Group();
  const material: any = applySampleStyle(new THREE.Mesh(geometry));
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  return group;
}

/**
 * Applies a consistent visual style to the given 3D object.
 *
 * @param object - The THREE.Object3D to style.
 */
export function applySampleStyle(object: THREE.Object3D): any {
  if (!(object instanceof THREE.Mesh)) {
    console.warn('applySampleStyle can only be applied to THREE.Mesh objects.');
    return;
  }

  const material: any = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    metalness: 0.7,
    roughness: 0.1,
  });

  object.castShadow = true;
  object.receiveShadow = true;
  return material;
}