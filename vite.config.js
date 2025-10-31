import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { imagetools } from "vite-imagetools";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath, URL } from "node:url";
var ROBOTS_SITEMAP = "Sitemap: https://swan.org/sitemap.xml\n";
var DISALLOW_ROBOTS = "User-agent: *\nDisallow: /\n\n".concat(ROBOTS_SITEMAP);
var ALLOW_ROBOTS = "User-agent: *\nAllow: /\n\n".concat(ROBOTS_SITEMAP);
var robotsPlugin = function (shouldDisallow) { return ({
    name: "swan-robots",
    configureServer: function (server) {
        server.middlewares.use(function (req, res, next) {
            if (req.url === "/robots.txt") {
                res.setHeader("Content-Type", "text/plain");
                res.end(shouldDisallow ? DISALLOW_ROBOTS : ALLOW_ROBOTS);
                return;
            }
            next();
        });
    },
    generateBundle: function () {
        this.emitFile({
            type: "asset",
            fileName: "robots.txt",
            source: shouldDisallow ? DISALLOW_ROBOTS : ALLOW_ROBOTS,
        });
    },
}); };
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var base = env.VITE_BASE_PATH || "/";
    var analyze = env.ANALYZE === "true" || env.VITE_ANALYZE === "true" || mode === "analyze";
    var isPreview = mode === "development" ||
        env.VERCEL_ENV === "preview" ||
        env.NETLIFY === "true" ||
        env.PREVIEW === "true" ||
        env.VITE_PREVIEW === "true";
    var plugins = [vue(), imagetools(), robotsPlugin(isPreview)];
    if (analyze) {
        plugins.push(visualizer({
            filename: "dist/stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
        }));
    }
    return {
        base: base,
        plugins: plugins,
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
                "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
                "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
                "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
                "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
                "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
                "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["vue", "vue-router", "element-plus"],
                        charts: ["echarts", "echarts/core", "echarts/charts", "echarts/components", "echarts/renderers"],
                        search: ["fuse.js"],
                    },
                },
            },
        },
        server: { host: "localhost", port: 5173 },
    };
});
