
export interface loginInter {
    account: string;
    password: string;
    captcha: string;
}

export interface PaginationInter {
    pageIndex: number,
    pageSize: number,
    sort?: any[]
}

// 系统管理 - 字典管理
export interface DictInter extends PaginationInter {
    name:string| null;
}

// 系统管理 - 用户管理
export interface UsersDataInter extends PaginationInter {
    id?: null | string | number;
    account: null | string;
    name: null | string;
    phone: null | string;
    status: number | null;
}


export interface getCityOderState {
    cityCode: string
    beginDate: string
    endDate: string
}

export interface getCompanyOderState {
    companyId: string
    beginDate: string
    endDate: string
}