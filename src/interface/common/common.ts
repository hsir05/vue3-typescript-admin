export interface itemState {
  cityName: string;
  cityCode: string;
  lng: number;
  lat: number;
}

export interface CommonItemInter {
  label: string;
  value: string;
}

export interface objInter { 
  [symbol: string]: string;
}

// 订单
interface ItemInter {
    text: string | null
    icon: Object
}
export interface OrderDataIner {
    [symbol: string]: ItemInter;
}
