export interface tableDataItem{
    openCityAdvertisementId?: string
    advertisementTitle: string | null;
    advertisementImageUrl: string | null
    cityName: string | null
    cityCode: string | null
    advertisementEffectiveTimeBegin: number | null
    advertisementEffectiveTimeEnd: number | null
    advertisementH5Url: string | null;
    advertisementSeq: number | null
}
export  interface CityItemInter {
            label: string;
            value: string
        }