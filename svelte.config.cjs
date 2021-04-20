const sveltePreprocess = require("svelte-preprocess")
const postcss = require("./postcss.config.cjs")

// using sourceMap as an example, but could be anything you need dynamically
function createPreprocessors(sourceMap) {
    return sveltePreprocess({
        sourceMap,
        defaults: {
            script: "typescript",
            style: "postcss"
        },
        postcss
    })
}

module.exports = {
    createPreprocessors,
    preprocess: createPreprocessors(true)
}
