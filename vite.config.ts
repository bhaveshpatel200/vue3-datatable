import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            cleanVueFileName: true,
        }),
    ],
    build: {
        cssCodeSplit: true,
        lib: {
            entry: {
                'vue3-datatable': resolve(__dirname, 'src/components/index.ts'),
                'vue3-datatable-css': resolve(__dirname, 'src/assets/css/tailwind.css'),
            },
            name: 'Vue3Datatable',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
