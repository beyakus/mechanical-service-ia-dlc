import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.property.test.ts'],
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': './src',
      '@visits/shared': '../shared/src/index.ts',
    },
  },
});
