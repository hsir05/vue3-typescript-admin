export interface TableDataItemInter {
    authorityId:string
    state: number
    createTime: number
}

export interface FormInter{
    authorityId?: string | null
    name: string | null
    code: string | null
    url: string | null
    state: number | null
}