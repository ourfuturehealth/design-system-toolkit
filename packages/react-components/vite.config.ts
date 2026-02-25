import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  const themeMode = process.env.OFH_THEME_MODE || 'participant';
  const isParticipantTheme = themeMode === 'participant';

  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        exclude: ['**/*.test.tsx', '**/*.spec.tsx', 'src/dev.tsx'],
      }),
    ],
    server: {
      port: 5173,
    },
    build: {
      emptyOutDir: isParticipantTheme,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'OFHDesignSystemReact',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return isParticipantTheme
                ? 'ofh-design-system-react.css'
                : `ofh-design-system-react-${themeMode}.css`;
            }
            return assetInfo.name || '';
          },
        },
      },
      sourcemap: true,
      cssCodeSplit: false, // Important for single CSS output, bundle CSS with JS for library
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `$ofh-theme-mode: ${themeMode};`,
          // Allow importing from node_modules and workspace packages
          loadPaths: ['node_modules'],
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
