<script lang="ts">
    import { fade } from "svelte/transition"
    import Tip from "./Tip.svelte"
    import { scrollTo } from "svelte-scrollto"
    import type { PlusCode, AutocompleteResult, MarkerDetail } from "./index.type"
    import "./app.postcss"
    import { mapsLoaded } from "./stores"
    import type { Location } from "./index.type"
    import Map from "./Map.svelte"
    import GoogleSdk from "./GoogleSdk.svelte"
    import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete.svelte"
    import Marker from "./Marker.svelte"
    import { convertPlusCode } from "./utility"
    import InfoWindow from "./InfoWindow.svelte"
    import { tick } from "svelte"

    export let locations: Location[] = []
    export let apiKey: string

    let center: google.maps.LatLng
    let map: google.maps.Map
    let maps: typeof google.maps
    let container: HTMLElement

    let place: google.maps.places.PlaceResult
    let radius = Number.POSITIVE_INFINITY
    let selection: MarkerDetail
    let results: HTMLElement

    let filteredLocations: Location[]
    $: filteredLocations = locations.filter(({ plusCode }) => {
        if (!place?.geometry.location) return true
        const { location } = place.geometry
        const METERS_PER_MILE = 1609.34
        const coords = new maps.LatLng(convertPlusCode(plusCode))
        return (
            maps.geometry.spherical.computeDistanceBetween(location, coords) <
            radius * METERS_PER_MILE
        )
    })

    function showLocation(plusCode: PlusCode) {
        scrollTo({ element: container })
        selection = null
        map.setCenter(convertPlusCode(plusCode))
        map.setZoom(17)
    }

    function handlePlaceChange(event: CustomEvent<AutocompleteResult>) {
        place = event.detail.place
    }

    async function handleMarkerClick(event: CustomEvent<MarkerDetail>) {
        "#map"
        selection = null
        await tick()
        selection = event.detail
    }

    function contentForSelection({ id }: MarkerDetail) {
        const location = filteredLocations.find(location => location.slug === id)
        const target = document.createElement("div")

        const tip = new Tip({
            target,
            props: {
                title: location.name
            }
        })

        tip.$on("click", async () => {
            const element = document.querySelector(`#search-results #${id}`)
            scrollTo({
                element,
                onDone() {
                    scrollTo({
                        container: "#search-results",
                        element
                    })
                }
            })
        })

        return target
    }

    function removePlace() {
        place = null
        radius = Number.POSITIVE_INFINITY
    }
</script>

<GoogleSdk {apiKey} />
{#if $mapsLoaded}
    <div class="font-montserrat flex flex-col sm:flex-row justify-around">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="space-x-2 flex flex-col sm:flex-row">
            <span class="text-white">Find Near:</span>
            <GooglePlacesAutocomplete
                class="px-2 border"
                on:placeChanged={handlePlaceChange}
                types={["address"]}
            />
        </label>
        <label class="space-x-2 flex flex-col sm:flex-row">
            <span class="text-white">Miles Away:</span>
            <select bind:value={radius}>
                {#each [5, 10, 15, 20, 25, 50, Number.POSITIVE_INFINITY] as value}
                    <option {value}
                        >{value === Number.POSITIVE_INFINITY ? "Unlimited" : value} Miles</option
                    >
                {/each}
            </select>
        </label>
    </div>

    <div class="my-4 text-white" style="min-height: 2rem">
        {#if place}
            <div transition:fade class="space-x-4 flex items-center justify-center">
                <button class="text-primary stroke-2 w-4 h-4 stroke-current" on:click={removePlace}>
                    <svg
                        viewBox="0 0 12 12"
                        version="1.1"
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line x1="1" y1="11" x2="11" y2="1" />
                        <line x1="1" y1="1" x2="11" y2="11" />
                    </svg>
                </button>
                <span>{place.formatted_address}</span>
            </div>
        {/if}
    </div>

    <Map id="map" bind:center bind:map bind:maps bind:container class="h-96 mb-8 w-full">
        {#each filteredLocations as { plusCode, slug } (slug)}
            <Marker
                id={slug}
                cluster
                options={{
                    icon: "/logo.svg",
                    position: convertPlusCode(plusCode)
                }}
                on:click={handleMarkerClick}
            />
        {/each}
        {#if selection}
            <InfoWindow
                marker={selection.marker}
                on:closeclick={() => (selection = null)}
                options={{ content: contentForSelection(selection) }}
            />
        {/if}
    </Map>

    <div
        id="search-results"
        bind:this={results}
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-montserrat max-h-96 overflow-scroll text-white"
    >
        {#each filteredLocations as { name, slug, address, url, phone, plusCode } (slug)}
            <div id={slug} class="flex items-start flex-col py-2 border-b border-white">
                <h3
                    class="font-hammersmith my-2 uppercase font-bold text-2xl cursor-pointer"
                    class:text-primary={selection?.id === slug}
                    on:click={() => showLocation(plusCode)}
                >
                    {name}
                </h3>
                <span class="my-2 text-lg">{address}</span>
                {#if phone}
                    <a class="my-2 text-lg" href="tel:{phone}">{phone}</a>
                {/if}
                {#if url}
                    <a
                        target="_blank"
                        class="paint-button justify-self-end block flex justify-center mt-auto p-2 border border-white uppercase font-bold text-2xl"
                        href={url}>Visit Site</a
                    >
                {/if}
            </div>
        {/each}
    </div>
{/if}

<style global>
    .font-hammersmith {
        font-family: "Hammersmith One", sans-serif;
    }
    .font-montserrat {
        font-family: Montserrat, sans-serif;
    }
    .paint-button {
        min-width: 40%;
        background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.23), rgba(0, 0, 0, 0.23)),
            url("https://assets.website-files.com/602f08612078b10853aaf8e8/603b3408e815e829017a8dff_streaks_0002_Vector-Smart-Object.png");
        background-position: 0 0, 50% 50%;
        background-size: auto, contain;
        background-repeat: repeat, no-repeat;
    }
</style>
