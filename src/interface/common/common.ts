export interface IObj { 
  [symbol: string]: string;
}
// 登录
export interface ILoginForm {
  principal: string
  credentials: string
}
export interface IPagination {
    pageIndex?: number
    pageSize?: number
}