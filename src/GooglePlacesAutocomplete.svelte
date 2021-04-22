<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"

    export let id = `gm-autocomplete-${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5)}`
    export let ariaLabel = "location"
    export let placeholder = "Location"
    let clazz = ""
    export { clazz as class }
    export let value: string = null
    export let viewValue: string = null
    export let viewLabel: keyof google.maps.places.PlaceResult = "formatted_address"
    export let fields = ["geometry", viewLabel]
    export let types = ["(regions)"]
    export let options = {}

    let search: HTMLInputElement
    let autocomplete: google.maps.places.Autocomplete
    let currentPlace: google.maps.places.PlaceResult
    let disabled = true

    const dispatch = createEventDispatcher()

    function clear() {
        value = null
        viewValue = null
        currentPlace = null
        dispatch("clear")
    }

    function dropdownVisible() {
        // @ts-ignore
        return !!document.querySelector(".pac-container")?.offsetParent
    }

    function autocompleteKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && dropdownVisible()) event.preventDefault()
    }

    function blur() {
        dispatch("blur")
        if (viewValue !== currentPlace) clear()
    }

    onMount(() => {
        const google = window.google
        autocomplete = new google.maps.places.Autocomplete(search, {
            fields,
            types,
            ...options
        })
        disabled = false
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace()

            if (!place.geometry) return

            viewValue = String(place[viewLabel])
            value = viewValue
            currentPlace = place
            const detail = { place, selectedPrediction: search.value }
            dispatch("placeChanged", detail)
        })

        dispatch("ready")
    })
</script>

<input
    {id}
    aria-label={ariaLabel}
    class={clazz}
    {placeholder}
    bind:this={search}
    type="text"
    {disabled}
    bind:value={viewValue}
    on:blur={blur}
    on:keydown={autocompleteKeydown}
/>
