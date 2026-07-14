/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** station-sync WebSocket endpoint (port-louis sync). */
  readonly VITE_WS_URL?: string;
  /** REST API base URL (makeAuthenticatedRequest — secrets/adjust-inventory handlers). */
  readonly VITE_API_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
