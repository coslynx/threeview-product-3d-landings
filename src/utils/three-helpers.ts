import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshStandardMaterialParameters, MeshBasicMaterialParameters } from 'three';

/**
 * Creates a configured `THREE.Scene`.
 * @returns A configured `THREE.Scene`.
 */
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  return scene;
}

/**
 * Defines the options for cameras:  `PerspectiveCamera` or `OrthographicCamera`.
 */
export type CameraOptions = {
  type: 'perspective';
  fov: number;
  near: number;
  far: number;
} | {
  type: 'orthographic';
  zoom: number;
  near: number;
  far: number;
}

/**
 * Creates a configured `THREE.PerspectiveCamera`.
 * @param aspectRatio The aspect ratio of the camera.
 * @returns A configured `THREE.PerspectiveCamera`.
 */
export function createPerspectiveCamera(aspectRatio: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.z = 5;
  return camera;
}

/**
 * Creates a configured `THREE.OrthographicCamera`.
 *
 * @param aspectRatio The aspect ratio of the camera.
 * @param zoom The zoom level of the camera.
 * @returns A configured `THREE.OrthographicCamera`.
 */
export function createOrthographicCamera(aspectRatio: number, zoom: number): THREE.OrthographicCamera {
    const frustumSize = 5;
    const camera = new THREE.OrthographicCamera(
        frustumSize * aspectRatio / -2,
        frustumSize * aspectRatio / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
    );
    camera.zoom = zoom;
    camera.position.z = 5;
    camera.updateProjectionMatrix();
    return camera;
}

/**
 * Asynchronously loads a GLTF model from the given URL.
 * @param url The URL of the GLTF model.
 * @returns A Promise that resolves with the loaded THREE.Group.
 */
export function loadGLTFModel(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    //Draco and KTX2 Loaders MUST be enabled here, otherwise it cannot be rendered.
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/'); // Specify the Draco decoder path
    loader.setDRACOLoader(dracoLoader);

    const ktx2Loader = new KTX2Loader();
    loader.setKTX2Loader(ktx2Loader.detectSupport(new THREE.WebGLRenderer()));

    loader.load(
      url,
      (gltf) => {
        optimizeModel(gltf.scene);
        resolve(gltf.scene);
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        console.log(`Model loading ${url}: ${progress.toFixed(2)}%`);
      },
      (error) => {
        console.error(`Error loading model ${url}:`, error);
        reject(error);
      }
    );
  });
}

/**
 * Creates configured ambient and directional lights.
 * @returns Configured ambient and directional lights.
 */
export function createDefaultLights(): { ambientLight: THREE.AmbientLight; directionalLight: THREE.DirectionalLight } {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(0, 0, 5);
  return { ambientLight, directionalLight };
}

/**
 * Creates a configured material.
 * @param type The type of material to create.
 * @param properties The properties to apply to the material.
 * @returns The configured material.
 */
export function createMaterial(type: string, properties: MeshStandardMaterialParameters | MeshBasicMaterialParameters): THREE.Material {
    switch (type) {
        case 'MeshStandardMaterial':
            return new THREE.MeshStandardMaterial(properties);
        case 'MeshBasicMaterial':
            return new THREE.MeshBasicMaterial(properties);
        default:
            console.error(`Unknown material type: ${type}`);
            return new THREE.MeshStandardMaterial(properties);
    }
}

/**
 * Optimizes a 3D model for web rendering by enabling shadow casting and receiving.
 * @param scene The THREE.Group scene to optimize.
 */
export function optimizeModel(scene: THREE.Group): void {
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = true;
    }
  });
}

/**
 * Disposes of the resources (geometry, materials, textures) of a 3D model to prevent memory leaks.
 * @param object The object to dispose.
 */
export function disposeObject(object: THREE.Object3D): void {
    if (!object) return;

    if (object instanceof THREE.Mesh) {
        if (object.geometry) {
            object.geometry.dispose();
        }
        disposeMaterial(object.material);
    }
    if (object instanceof THREE.Scene) {
        object.children.forEach(child => {
            disposeObject(child);
        });
    }
}

/**
 * Dispose of Three JS materials properly.
 * @param material - Three JS Material
 * @returns void
 */
export function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
    if (Array.isArray(material)) {
        material.forEach(mat => {
            disposeSingleMaterial(mat);
        });
    } else {
        disposeSingleMaterial(material);
    }
}

function disposeSingleMaterial(material: THREE.Material): void {
    if (material.map) material.map.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
    if (material.aoMap) material.aoMap.dispose();
    if (material.displacementMap) material.displacementMap.dispose();
    if (material.metalnessMap) material.metalnessMap.dispose();
    if (material.roughnessMap) material.roughnessMap.dispose();
    if (material.alphaMap) material.alphaMap.dispose();
    if (material.emissiveMap) material.emissiveMap.dispose();

    material.dispose();
}

/**
 * Calculates the aspect ratio.
 * @param width The width.
 * @param height The height.
 * @returns The aspect ratio.
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Optimizes the rendering to occur in a structured and sane way.
 */
export function optimizeRendering(clock: THREE.Clock) {
    //This is code to optimize, and if anything here breaks a rendering loop that is on the call signature.
    //Renderer must only render every 500ms at the maximum.
    clock.getDelta();
}

/**
 * Create Environment map for nice reflections.
 */
export function createEnvironmentMap(envTexture: string, renderer: THREE.WebGLRenderer) {
  const texture = new THREE.TextureLoader().load(envTexture);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.encoding = THREE.sRGBEncoding;

  return texture;
}