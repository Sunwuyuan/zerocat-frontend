// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, {transformAssetUrls} from "vite-plugin-vuetify";
import {PrimeVueResolver} from "@primevue/auto-import-resolver";
import {viteStaticCopy} from 'vite-plugin-static-copy';
import * as sass from "sass";

// Utilities
import {defineConfig} from "vite";
import {fileURLToPath, URL} from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern",
                importers: [
                    new sass.NodePackageImporter()
                ]
            },
            sass: {
                api: "modern",
                importers: [
                    new sass.NodePackageImporter()
                ]
            },
        }
    },
    plugins: [
        VueRouter(),
        Layouts(),
        Vue({
            template: {transformAssetUrls},
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: "src/styles/settings.scss",
            },
        }),
        Components(),
        Fonts({
            google: {
                families: [
                    {
                        name: "Roboto",
                        styles: "wght@100;300;400;500;700;900",
                    },
                ],
            },
        }),
        AutoImport({
            imports: ["vue", "vue-router"],
            eslintrc: {
                enabled: true,
            },
            vueTemplate: true,
        }),
        PrimeVueResolver(),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/monaco-editor/min/vs',
                    dest: 'monaco-editor/min'
                }
            ]
        }),
        /*copyPlugin(
          {
            targets: [{ src: "scratch-gui/build", dest: "dist" }],
            verbose: true,
            hook: "writeBundle",
          },
          {
            targets: [{ src: "scratch-gui/build", dest: "dist" }],
            verbose: true,
            hook: "buildEnd",
          }
        ),*/
    ],
    define: {"process.env": {}},
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
        port: 3000,
    },
    base: '/',
});
