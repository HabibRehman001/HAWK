import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    target: 'es2022',
    modulePreload: {
      resolveDependencies: (filename, deps) =>
        deps.filter(
          (dep) =>
            !dep.includes('vendor-gsap') &&
            !dep.includes('vendor-lenis') &&
            !dep.includes('WorkGrid') &&
            !dep.includes('AboutAndVideo') &&
            !dep.includes('WhatWeDo') &&
            !dep.includes('ToolsSection') &&
            !dep.includes('TeamSection') &&
            !dep.includes('WorkAndPlay') &&
            !dep.includes('TrustSection') &&
            !dep.includes('Footer')
        ),
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react'
          }
          if (id.includes('/gsap/')) return 'vendor-gsap'
          if (id.includes('/lenis/')) return 'vendor-lenis'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
