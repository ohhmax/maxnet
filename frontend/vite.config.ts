import { promises as fs } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { defineConfig, type Plugin } from 'vite';

function gzipPrecompression(): Plugin {
  return {
    name: 'vite-plugin-gzip-precompression',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      const distDir = path.resolve(import.meta.dirname, '../files/www/dist');
      async function processDir(dir: string): Promise<void> {
        let entries;
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await processDir(fullPath);
          } else if (
            entry.isFile() &&
            /\.(js|css|html|svg|json)$/i.test(entry.name) &&
            !entry.name.endsWith('.gz')
          ) {
            const data = await fs.readFile(fullPath);
            const compressed = zlib.gzipSync(data, { level: 9 });
            await fs.writeFile(`${fullPath}.gz`, compressed);
          }
        }
      }
      await processDir(distDir);
    },
  };
}

export default defineConfig({
  plugins: [gzipPrecompression()],
  build: {
    outDir: '../files/www/dist',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/cgi-bin': {
        target: 'http://10.0.0.1',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://10.0.0.1:7681',
        ws: true,
      },
    },
  },
});
