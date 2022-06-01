interface AdInter {
  advertisementTitle: string | null;
  advertisementImageUrl: string | null;
  cityName?: string | null;
  cityCode: string | null;
  advertisementEffectiveTimeBegin: number | null;
  advertisementEffectiveTimeEnd: number | null;
  advertisementH5Url: string | null;
  advertisementSeq: number | null;
}

export interface TableDataItemInter extends AdInter {
  openCityAdvertisementId: string;
}

export interface FormInter extends AdInter {
  openCityAdvertisementId?: string;
}

