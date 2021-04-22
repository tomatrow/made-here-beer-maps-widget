import OpenLocationCode from "open-location-code-typescript/dist/open-location-code"

export function convertPlusCode(plusCode: string) {
    const { latitudeCenter, longitudeCenter } = OpenLocationCode.decode(plusCode)

    return {
        lat: latitudeCenter,
        lng: longitudeCenter
    } as google.maps.LatLngLiteral
}
