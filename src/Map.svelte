<script lang="ts" context="module">
    import { getContext as _getContext, setContext as _setContext } from "svelte"

    const key = Symbol("map-context-key")

    interface MapContext {
        getMap: () => google.maps.Map
        getClusterer: () => MarkerClusterer
        getMaps: () => typeof google.maps
    }

    export function setContext(context: MapContext) {
        _setContext(key, context)
    }

    export function getContext() {
        return _getContext(key) as MapContext
    }
</script>

<script lang="ts">
    import MarkerClusterer from "@googlemaps/markerclustererplus"
    import { onMount } from "svelte"

    export let map: google.maps.Map = undefined
    export let maps: typeof google.maps = undefined
    export let container: HTMLElement = undefined
    export let clusterer: MarkerClusterer = undefined
    export let center: google.maps.LatLng = undefined

    setContext({
        getMap() {
            return map
        },
        getClusterer() {
            return clusterer
        },
        getMaps() {
            return maps
        }
    })

    onMount(() => {
        maps = window.google.maps
        map = new maps.Map(container, {
            zoom: 5
        })
        map.addListener("center_changed", () => (center = map.getCenter()))
        clusterer = new MarkerClusterer(map, [], {
            imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        })
    })

    $: if (center && !center.equals(map.getCenter())) {
        map.setCenter(center)
    }
</script>

<div {...$$restProps} bind:this={container}>
    {#if map && clusterer}
        <slot />
    {/if}
</div>
