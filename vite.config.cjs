const svelte = require("@sveltejs/vite-plugin-svelte")
const { defineConfig } = require("vite")
const zenFormat = require("zen-format")
const svelteConfig = require("./svelte.config.cjs")

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
            }),
        ],
        build: {
            minify: production,
            rollupOptions: {
                input: "src/index.ts"
            }
        }
    }
})
