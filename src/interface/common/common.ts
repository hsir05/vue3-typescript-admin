export interface objInter { 
  [symbol: string]: string;
}

interface ItemInter {
    text: string | null
    icon: Object
}
export interface OrderDataIner {
    [symbol: string]: ItemInter;
}
