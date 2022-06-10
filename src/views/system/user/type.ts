

export interface RoleInfoInter{
    roleId: string
    roleName: string
}
export interface TableItemInter {
  adminId: string;
  name: string;
  
  account: string;
  phone: string;
  sex: number;
  createTime: string;
  email: string | null;
  state: number;
  roles: RoleInfoInter[]
}
export interface UserFormInter{
    adminId?: string | null 
    pwd: string | null
    name: string | null
    sex: number | null
    phone: string | null
    account: string | null
    email: string | null
    roleIds: string[] | null
    state: number | null
}