import { resolve } from 'path';
import { defineConfig } from 'vite';
import { builtinModules } from 'module';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/bamboo-reporter.ts'),
      name: 'BambooReporter',
      fileName: 'bamboo-reporter',
    },
    rollupOptions: {
      external: builtinModules,
    },
  },
});
