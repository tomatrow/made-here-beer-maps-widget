const svelte = require("@sveltejs/vite-plugin-svelte")
const { defineConfig } = require("vite")
const zenFormat = require("@tomatrow/zen-format")
const svelteConfig = require("./svelte.config")
const { resolve } = require("path")

module.exports = defineConfig(({ mode }) => {
    const production = mode === "production"
    return {
        plugins: [
            zenFormat({
                load: true // I think this fixes certain issues
            }),
            svelte({
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production
                },
                preprocess: svelteConfig.createPreprocessors(!production)
            })
        ],
        build: {
            minify: production,
            terserOptions: {
                format: {
                    comments: false
                }
            },
            lib: {
                entry: resolve(__dirname, 'src/App.svelte'),
                name: "MadeHereBeerMapsWidget",
                formats: ["es"]
            },
            rollupOptions: {
                output: {
                    assetFileNames() {
                        return "bundle.css"
                    },
                    entryFileNames() {
                        return "bundle.js"
                    },
                    manualChunks() {
                        return "bundle"
                    }
                }
            }
        }
    }
})
