interface ViteEnv {
  readonly VITE_PORT: number;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_GLOB_API_PROXY_PREFIX: string;
  readonly VITE_GLOB_API_URL: string;
  readonly VITE_GLOB_PROXY_API_URL: string;
}

interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
