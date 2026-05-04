/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_IMAGE_URL: string
  readonly VITE_PAYSTACK_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
