/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_GITHUB_SIGNIN_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
