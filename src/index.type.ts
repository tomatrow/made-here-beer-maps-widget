export interface Location {
    name: string
    slug: string
    address: string
    url?: string
    phone?: string
    plusCode: string
}

type GlobalThis = typeof globalThis
export interface Window extends GlobalThis {
    poppyfieldGmapsReady?: () => void
}

export type PlusCode = string

export interface AutocompleteResult {
    place: google.maps.places.PlaceResult
    selectedPrediction: string
}

export interface MarkerDetail {
    id: string
    marker: google.maps.Marker
}