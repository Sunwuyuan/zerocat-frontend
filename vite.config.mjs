// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';
import * as sass from "sass";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

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
      template: { transformAssetUrls },
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
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',
      workbox: {
        // 只预缓存 /assets/ 路径下的特定类型文件
        globPatterns: ['assets/**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2}'],

        // 单页应用的回退页面
        navigateFallback: '/index.html',


        importScripts: ['/pwa-notifications.js'],

        // 忽略不需要缓存的文件
        globIgnores: [
          '**/node_modules/**/*',
          '**/@id/**/*',
          '**/virtual:*',
          '**/?*',
          '**/manifest.webmanifest'
        ],

        // 允许的导航 fallback 路径
        navigateFallbackAllowlist: [/^(?!\/@id).*$/],

        // 运行时缓存：仅缓存 /assets/ 路径下的图片
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 缓存 30 天
              }
            }
          }
        ]
      },
       skipThirdPartyRequests: true,
      manifest: {
        name: 'ZeroCat社区',
        short_name: 'ZeroCat',
        description: 'ZeroCat是新一代开源编程社区！创作、浏览、分享Scratch作品，体验多种不同的编辑器创作。',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['education', 'productivity', 'developer'],
        shortcuts: [
          {
            name: '创建项目',
            short_name: '创建',
            description: '创建新的编程项目',
            url: '/app/create',
            icons: [{ src: '/favicon.png', sizes: '96x96' }]
          },
          {
            name: '通知中心',
            short_name: '通知',
            description: '查看最新通知',
            url: '/app/notifications',
            icons: [{ src: '/favicon.png', sizes: '96x96' }]
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
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
  define: { "process.env": {} },
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
