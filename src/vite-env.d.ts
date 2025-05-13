
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_SIMPLEMDM_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
