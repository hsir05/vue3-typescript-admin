export interface IObj { 
  [symbol: string]: string;
}
// 登录
export interface ILoginForm {
  principal: string | null
  credentials: string | null
}
export interface IPagination {
    pageIndex?: number
    pageSize?: number
}