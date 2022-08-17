export interface objInter { 
  [symbol: string]: string;
}
// 登录
export interface LoginFormInter {
  principal: string
  credentials: string
}
interface ItemInter {
    text: string | null
    icon: Object
}
export interface OrderDataIner {
    [symbol: string]: ItemInter;
}
