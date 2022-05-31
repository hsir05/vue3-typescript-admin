

export interface TableItemInter {
    openCityAirportId: string;
    cityCode: string;
    airportLng: number;
    airportLat: number;
    airportAddressDetail: string;
    openLock: number;
    airportName: string;
}

export interface OpenAreaFormInter {
    cityName: string | null;
    cityCode: string | null;
    lng: number | null;
    lat: number | null;
}

export interface EditFormInter {
    openCityAirportId: string | null;
    cityCode: string | null;
    airportLng: number | null;
    airportLat: number | null;
    airportAddressDetail: string | null;
    openLock: number | null;
    airportName: string | null;
}