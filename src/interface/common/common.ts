export interface itemState {
  cityName: string;
  cityCode: string;
  lng: number;
  lat: number;
}

export interface CityItemInter {
  label: string;
  value: string;
}

export interface objIner { 
  [symbol: string]: string;
}

// 订单
interface ItemInter {
    text: string
    icon: Object
}
export interface OrderDataIner {
    [symbol: string]: ItemInter;
}
