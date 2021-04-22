<script lang="ts">
    import { getContext } from "./Map.svelte"
    import { onMount, onDestroy, createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()
    const { getMaps, getMap } = getContext()
    const maps = getMaps()
    const map = getMap()

    export let options: google.maps.InfoWindowOptions = {}
    export let marker: google.maps.Marker

    let infoWindow: google.maps.InfoWindow
    let closeListener: google.maps.MapsEventListener

    onMount(() => {
        infoWindow = new maps.InfoWindow(options)
        closeListener = maps.event.addListener(infoWindow, "closeclick", () => {
            dispatch("closeclick", { infoWindow })
        })
        infoWindow.open(map, marker)
    })

    onDestroy(() => {
        infoWindow?.close()
        closeListener.remove()
    })
</script>
