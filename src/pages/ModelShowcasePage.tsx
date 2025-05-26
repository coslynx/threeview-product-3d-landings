import React, { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, useProgress } from '@react-three/drei';

import MinimalLayout from 'src/components/layout/MinimalLayout.tsx';
import ModelLoader from 'src/components/3d/ModelLoader.tsx';
import { three3DHelpersUtil } from 'src/utils/three-helpers.ts';
import 'src/styles/pages/model-showcase.css';

interface ModelShowcasePageProps { }

interface ModelConfig {
  url: string;
  title: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const ModelShowcasePage: React.FC<ModelShowcasePageProps> = () => {
  const [models, setModels] = useState<ModelConfig[]>([
    { url: '/models/chart.glb', title: 'Interactive Chart', description: 'Explore data in 3D', position: [0, 0, 0], rotation: [0, 0, 0] },
    { url: '/models/predict.glb', title: 'AI Predictions', description: 'See future trends', position: [3, 0, 0], rotation: [0, Math.PI / 4, 0] },
    { url: '/models/product-hd.glb', title: 'Product HD', description: 'High definition model.', position: [-3, 0, 0], rotation: [0, -Math.PI / 4, 0] },
  ]);

  const ModelItem: React.FC<{ config: ModelConfig }> = ({ config }) => {
    return (
      <div className="model-item">
        <h3>{config.title}</h3>
        <Canvas style={{ width: '100%', height: '300px' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 5]} intensity={0.8} />
          <ModelLoader url={config.url} />
          <OrbitControls />
        </Canvas>
        <p>{config.description}</p>
      </div>
    );
  };

  const LoadingOverlay: React.FC = () => {
    const { progress } = useProgress();

    return (
      <div className="loading-overlay">
        Loading... {progress.toFixed(2)}%
      </div>
    );
  };

  return (
    <MinimalLayout>
      <div className="model-showcase-page">
        <h2>Explore Our Models</h2>
        <Suspense fallback={<LoadingOverlay />}>
          <div className="model-grid">
            {models.map((config, index) => (
              <ModelItem key={index} config={config} />
            ))}
          </div>
        </Suspense>
      </div>
    </MinimalLayout>
  );
};

export default ModelShowcasePage;