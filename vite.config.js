import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({ base: process.env.SITE_BASE || '/', build: { rollupOptions: { input: { en: resolve('index.html'), ar: resolve('ar/index.html'), notFound: resolve('404.html'), arNotFound: resolve('ar/404.html') } } } });
