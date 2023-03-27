import { defineStore } from "pinia";
import { locStorage } from "@/utils/storage";
import router from "@/router/index"
// import { ACCESS_TOKEN_KEY, USER_INFO_KEY, PERMISSIONS_KEY } from "@/config/constant";
// import { ACCESS_TOKEN_KEY, USER_INFO_KEY, EXP_KEY } from "@/config/constant";
import { ACCESS_TOKEN_KEY, USER_INFO_KEY } from "@/config/constant";
// import { login, getDetailViaLoginer, getLoginerAuth, refreshToken } from "@/api/system/system";
import {login} from "@/api/system/login"
import { ILoginForm } from '@/interface/common/common'
import Avatar from "@/assets/image/default-avatar.png";
import { IUser, IUserInfo, IRole } from "./type"


export const useAppUserStore = defineStore({
  id: "app-user",
    state: (): IUser => ({ 
    token: locStorage.get(ACCESS_TOKEN_KEY),
    userInfo: locStorage.get(USER_INFO_KEY) || {
      account: "",
      adminId: "",
      name: "",
      sex: 1,
      email: "",
      avatar: Avatar,
      roles: [],
    },
    permissions: ["dict001", "dict002"],
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
      getUserInfo(): IUserInfo {
      return this.userInfo;
    },
    getAccount(): string {
      return this.userInfo.account;
    },
    getName(): string {
      return this.userInfo.name;
    },
    getAdminId(): string {
      return this.userInfo.adminId;
    },
    getAvatar(): string {
      return this.userInfo.avatar as string;
    },
      getRoles(): IRole[] {
      return this.userInfo.roles;
    },
    getPermissions(): string[] {
      return this.permissions;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
      setUserInfo(userInfo: IUserInfo) {
      this.userInfo = userInfo;
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
      login(form: ILoginForm) {
      return new Promise(async (resolve, reject) => {
        try {
            console.log(form);
            let res = await login(form)
            console.log(res);
       
        //   const { token, iat, exp } = res.data;
        //   console.log(iat);
        //   console.log(exp);
          
        //   // locStorage.set(EXP_KEY, exp);
        //   locStorage.set(EXP_KEY, 1000);
        //   locStorage.set(ACCESS_TOKEN_KEY, token, exp);
          
        //   this.setToken(token);
        //   let userData = await getDetailViaLoginer();
        //   const { adminId, account, email, name, roles, sex } = userData.data;
        //   locStorage.set(USER_INFO_KEY,{ adminId, account, email, name, roles, sex, }, exp);
        //   this.setUserInfo({ adminId, account, email, name, roles, sex });

        //   let resAuthData = await getLoginerAuth()
        //   let authData = resAuthData.data.authorityList.map((item: {code: string}) => item.code)
        //   console.log(authData);
        //   this.setPermissions(authData)
        //   locStorage.set(PERMISSIONS_KEY,authData, exp);
          resolve({});
        } catch (err) {
          reject(err);
        }
      });
    },
    refreshTokenData():Promise<string>{
      return new Promise(async (resolve, reject) => {
        try {
        //   let res = await refreshToken()
        //   console.log(res);
        //   const {token, exp } = res.data
        //   locStorage.set(EXP_KEY, exp);
        //   locStorage.set(ACCESS_TOKEN_KEY, token, exp);
        //   this.setToken(token);
          resolve("token")
        } catch (err) {
          reject(err)
        }
      })
    },
    logout() {
      this.setUserInfo({
        adminId: "",
        account: "",
        email: "",
        name: "",
        roles: [],
        sex: null,
      });
      locStorage.remove(ACCESS_TOKEN_KEY);
      locStorage.remove(USER_INFO_KEY);

           router.push({ path: "/login" });
            // router.push({ path: "/login" ,params:{path: route} });
      return Promise.resolve();
    },
  },
});
