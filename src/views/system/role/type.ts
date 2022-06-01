
export interface TableItemInter {
  roleId: string;
  name: string;
  parentRoleId: string | null;
  description: string | null;
  createTime: number;
  state: number;
}

export interface RoleFormInter {
    roleId?: string | null;
    name: string | null;
    parentRoleId: string | null;
    description: string | null;
    createTime?: number | null;
    state: number | null;
}