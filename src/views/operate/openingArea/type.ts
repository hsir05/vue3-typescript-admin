

export interface TableItemInter {
    areaName: string | null;
    areaCode: string | null;
    areaLock: number | null;
    cityCode: string | null
}

export interface OpenAreaFormInter {
    cityName: string | null;
    cityCode: string | null;
    lng: number | null;
    lat: number | null;
}

export interface NonEditAreaPonitsInter {
    lngMin: number,
    lngMax: number,
    latMin: number,
    latMax: number,
}

export interface NonDataInter {
    areaCode: string
    lat: number
    lng: number
}