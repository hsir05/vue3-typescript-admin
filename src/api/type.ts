
export interface loginState {
    username: string;
    password: string;
    captcha: string;
}

export interface PaginationState {
    page: number,
    pageSize: number
}

// 系统管理 - 字典管理
export interface getDictState extends PaginationState {
    // id?: null | string | number;
    name: null | string;
    // code: null | string;
    // sort: number | null;
    // isChild: number | null;
    // status: number | null;
}

// 系统管理 - 用户管理
export interface getUsersDataState extends PaginationState {
    id?: null | string | number;
    account: null | string;
    name: null | string;
    phone: null | string;
    status: number | null;
}
// 系统管理 - 角色管理
export interface getRolesState {
    id?: null | string | number;
    name: null | string;
    status: null | string;
}

export interface getOderState {
    cityCode: string
    beginDate: string
    endDate: string
}