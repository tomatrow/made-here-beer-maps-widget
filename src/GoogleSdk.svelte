<script lang="ts">
    import loader from "@beyonk/async-script-loader"
    import { onMount, createEventDispatcher } from "svelte"
    import { mapsLoaded, mapsLoading } from "./stores"
    import type { Window } from "./index.type"

    const window: Window = globalThis
    const dispatch = createEventDispatcher()

    export let apiKey: string

    $: $mapsLoaded && dispatch("ready")

    onMount(() => {
        window.poppyfieldGmapsReady = () => {
            mapsLoaded.set(true)
            delete window.poppyfieldGmapsReady
        }

        if ($mapsLoaded) dispatch("ready")

        if (!$mapsLoading) {
            const callbackKey: keyof Window = "poppyfieldGmapsReady"
            const url = [
                "//maps.googleapis.com/maps/api/js?",
                apiKey ? `key=${apiKey}&` : "",
                `libraries=places,geometry&callback=${callbackKey}`
            ].join("")
            mapsLoading.set(true)
            loader(
                [{ type: "script", url }],
                () => {
                    return $mapsLoaded
                },
                () => {}
            )
        }
    })
</script>
