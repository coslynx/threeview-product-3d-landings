import type { Globals } from 'vite/client';

interface ImportMetaEnv {
  /**
   *  The title of the landing page application.
   */
  readonly VITE_APP_TITLE: string;
  /**
   *  The base URL for 3D models (GLTF files).
   */
  readonly VITE_MODEL_PATH: string;
  /**
   *  The base URL for textures (PNG, JPG, KTX2).
   */
  readonly VITE_TEXTURE_PATH: string;
  /**
   *  The base URL for the Draco decoder files.
   */
  readonly VITE_DRAGO_DECODER_PATH: string;
  /**
   *  The base URL for the environment map (HDR or equirectangular image).
   */
  readonly VITE_ENVIRONMENT_MAP_PATH: string;
  /**
   * Whether the performance monitor should be enabled.
   */
  readonly VITE_PERFORMANCE_MONITOR: 'true' | 'false';
  /**
   *  The base URL for the application API.
   */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}