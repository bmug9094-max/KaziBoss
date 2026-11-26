/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Alias accepté (nom affiché par Supabase pour les clés sb_publishable_…) */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Noms créés par l'intégration Vercel ↔ Supabase (exposés via envPrefix dans vite.config.ts) */
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_CHARIOW_AGRI_URL?: string;
  readonly VITE_CHARIOW_UNLIMITED_URL?: string;
  readonly VITE_CHARIOW_RESOURCES_URL?: string;
}

/** Date du build (vite.config.ts › define), jointe aux avis pour savoir quelle version le joueur utilisait. */
declare const __BUILD__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
