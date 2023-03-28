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

export interface IState {
    [Symbol: string | number]: {
        text: string
        color: string
    }
}