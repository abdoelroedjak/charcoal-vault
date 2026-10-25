import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(() => {
  const isAdmin = process.env.BUILD_TARGET === 'admin';

  return {
    plugins: [react()],
    root: isAdmin ? 'admin' : '.',
    base: isAdmin ? '/admin/' : '/',
    build: {
      outDir: isAdmin ? resolve(process.cwd(), 'dist/admin') : resolve(process.cwd(), 'dist'),
      emptyOutDir: true,
    },
    server: {
      host: '0.0.0.0',
      port: isAdmin ? 3001 : 3000,
    },
  };
});
