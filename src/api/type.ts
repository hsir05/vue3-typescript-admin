
export interface loginState {
    username: string;
    password: string;
    captcha: string;
}

export interface PaginationState {
    page: number,
    pageSize: number
}

// 系统管理 - 用户管理
export interface getUsersDataState extends PaginationState {
    account: null | string;
    name: null | string;
    phone: null | string;
    status: number | null;
}