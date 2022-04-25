

export interface tableItemProps {
    id: string | number
}

export interface tableDataItem {
  id?: string | null;
  areaName: string | null;
  areaCode: string | null;
  areaLock?: number | null;
}

export interface formState {
  id?: string | null;
  cityName: string | null;
  cityCode: string | null;
  lng: number | null;
  lat: number | null;
}