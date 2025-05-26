/**
 * @module modelManager - Utility module for managing 3D models, including loading, caching, optimization, and disposal.
 */
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';

interface ModelCacheItem {
  scene: THREE.Group;
  dispose: () => void;
}

interface ModelLoadOptions {
  priority?: number;
}

const cache: Map<string, ModelCacheItem> = new Map();

/**
 * Loads a GLTF model from the given URL.
 * @param url The URL of the GLTF model.
 * @param options Options for the model loading.
 * @returns A Promise that resolves with the loaded THREE.Group.
 */
async function loadModel(url: string, options?: ModelLoadOptions): Promise<THREE.Group> {
  try {
    if (cache.has(url)) {
      const cachedModel = cache.get(url);
      if (cachedModel) {
        console.log(`Loading model from cache: ${url}`);
        return cachedModel.scene.clone(); // Serve a clone to avoid shared state issues
      }
    }

    return new Promise<THREE.Group>((resolve, reject) => {
      const loader = new GLTFLoader();

      loader.load(
        url,
        (gltf: GLTF) => {
          const scene = gltf.scene;
          optimizeModel(scene);

          const dispose = () => {
            disposeModel(scene);
          };

          cacheModel(url, scene, dispose);
          resolve(scene);
        },
        (xhr: ProgressEvent) => {
          // Handle loading progress
          const progress = (xhr.loaded / xhr.total) * 100;
          console.log(`Model loading ${url}: ${progress.toFixed(2)}%`);
        },
        (error: any) => {
          console.error(`Error loading model ${url}:`, error);
          reject(error);
        }
      );
    });
  } catch (error: any) {
    console.error(`Failed to load model ${url}:`, error);
    throw error;
  }
}

/**
 * Adds a model to the cache.
 * @param url The URL of the model.
 * @param scene The THREE.Group to cache.
 * @param dispose The dispose method
 */
function cacheModel(url: string, scene: THREE.Group, dispose: () => void): void {
  cache.set(url, { scene: scene.clone(), dispose });
  console.log(`Cached model: ${url}`);
}

/**
 * Removes a model from the cache.
 * @param url The URL of the model to remove.
 */
function removeModelFromCache(url: string): void {
  if (cache.has(url)) {
    const cachedModel = cache.get(url);
    if (cachedModel) {
      cachedModel.dispose();
      cache.delete(url);
      console.log(`Removed model from cache: ${url}`);
    }
  }
}

/**
 * Optimizes a 3D model for web rendering by enabling shadow casting and receiving.
 *
 * @param scene - The THREE.Group scene to optimize.
 */
function optimizeModel(scene: THREE.Group): void {
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

/**
 * Disposes of the resources (geometry, materials, textures) of a 3D model to prevent memory leaks.
 * @param scene The scene to dispose.
 */
function disposeModel(scene: THREE.Group): void {
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      const mesh = object as THREE.Mesh;

      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      if (mesh.material) {
        const material = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        material.forEach(mat => {
          if (mat.map) mat.map.dispose();
          if (mat.aoMap) mat.aoMap.dispose();
          if (mat.bumpMap) mat.bumpMap.dispose();
          if (mat.normalMap) mat.normalMap.dispose();
          if (mat.roughnessMap) mat.roughnessMap.dispose();
          if (mat.metalnessMap) mat.metalnessMap.dispose();
          if (mat.emissiveMap) mat.emissiveMap.dispose();
          if (mat.alphaMap) mat.alphaMap.dispose();
          if (mat.envMap) mat.envMap.dispose();

          mat.dispose();
        });
      }
    }
  });
}

export const modelManager = {
  loadModel,
  cacheModel,
  removeModelFromCache,
};

/**
 *  * Unit Tests:
 *  *
 *  *  1. Test caching
 *  *   - Verify models load from a URL with modelManager.loadModel.
 *   *  - Model is added to the cache with cacheModel after successful load.
 *   *  - Ensure cached model loads and returns a new copy for proper isolation using the .clone method in Three.js, preventing shared state issues.
 *
 *  *  2. Test cache limits and overflow
 *  *   - When attempting to add beyond the cache size, verify that the least recently used item is cleaned.
 *
 *  *  3. Performance tests: Implement for loading
 *   *  Test performance for a model.
 *   *  Then check performance for cached object for a quick comparison to validate memory usage and speed.
 *  *
 *  *  4. Testing and security to ensure the objects conform to the standard.
 *  *
 *  *  5. Mock WebGLRenderer and THREE.WebGLRenderer to perform a three import.
 *  *   - Then assert all parts of this function run.
 *  *
 *  *    const mockDispose = jest.fn()
 *  *    THREE.BufferGeometry.prototype.dispose = mockDispose;
 *  *
 *   *    const sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
 *   *    sphereGeometry.dispose();
 *   *    expect(mockDispose).toHaveBeenCalled();
 */