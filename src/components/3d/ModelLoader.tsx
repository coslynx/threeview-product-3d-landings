import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTF, DRACOLoader, KTX2Loader } from 'three-stdlib';
import { Html } from '@react-three/drei';

import { three3DHelpersUtil } from 'src/utils/three-helpers';
import { modelManager } from 'src/utils/modelManager';
import 'src/styles/components/model-loader.css';

export interface ModelLoaderProps {
  url: string;
  draco?: boolean;
  ktx2?: boolean;
  lOD?: boolean;
  fallback?: React.ReactNode;
  onLoad?: (model: THREE.Group) => void;
  onError?: (error: ErrorEvent) => void;
  priority?: number;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  url,
  draco = true,
  ktx2 = true,
  lOD = true,
  fallback = null,
  onLoad,
  onError,
  priority = 0,
}) => {
  const model = useRef<THREE.Group>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { scene, gl } = useThree();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const gltf = await modelManager.loadModel(url);
        if (!isMounted) return;

        if (gltf) {
          model.current = gltf;

          gltf.scene.traverse((object) => {
            if ((object as THREE.Mesh).isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          if (onLoad) onLoad(gltf.scene);
        } else {
          const error = new Error(`Model not found at ${url}`);
          setLoadError(error);
          if (onError) onError(new ErrorEvent(error.message));
        }
      } catch (err) {
        if (err instanceof Error) {
          setLoadError(err);
          if (onError) onError(new ErrorEvent(err.message));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [url, onLoad, onError]);

  if (loadError) {
    return (
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="red" />
        <Html center>
          <div>Error loading model</div>
        </Html>
      </mesh>
    );
  }

  return (
    <Suspense fallback={fallback}>
      {loading ? (
        <mesh>
          <sphereGeometry />
          <meshBasicMaterial color="gray" />
          <Html center>
            <div>Loading...</div>
          </Html>
        </mesh>
      ) : model.current ? (
        <primitive object={model.current} dispose={null} />
      ) : null}
    </Suspense>
  );
};

export default ModelLoader;