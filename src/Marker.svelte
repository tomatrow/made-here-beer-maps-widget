<script lang="ts">
    import type { MarkerDetail } from "./index.type"
    import { getContext } from "./Map.svelte"
    import { onMount, onDestroy, createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()
    const { getMap, getClusterer, getMaps } = getContext()
    const map = getMap()
    const clusterer = getClusterer()
    const maps = getMaps()

    export let id: string
    export let cluster = false
    export let options: google.maps.MarkerOptions = {}

    let marker: google.maps.Marker
    let clickListener: google.maps.MapsEventListener

    onMount(() => {
        try {
            marker = new maps.Marker({
                ...options,
                map
            })

            clickListener = maps.event.addListener(marker, "click", () =>
                dispatch("click", { marker, id } as MarkerDetail)
            )

            if (cluster) clusterer.addMarker(marker)
            map.setCenter(options.position)
        } catch (error) {
            console.error(error)
        }
    })

    onDestroy(() => {
        if (!marker) return
        marker.setMap(null)

        if (cluster) clusterer.removeMarker(marker)

        clickListener.remove()
    })
</script>
