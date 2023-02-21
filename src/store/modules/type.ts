
export interface IRole {
    roleId: string;
    roleName: string;
}
export interface IUserInfo {
    account: string;
    adminId: string;
    name: string;
    sex: number | null;
    email: string;
    avatar?: string;
    roles: IRole[];
}
export interface IUser {
    token: string;
    userInfo: IUserInfo;
    permissions: string[];
}