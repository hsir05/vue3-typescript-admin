import { defineStore } from "pinia";
import { locStorage } from "@/utils/storage";
import router from "@/router/index"
// import { ACCESS_TOKEN_KEY, USER_INFO_KEY, PERMISSIONS_KEY } from "@/config/constant";
import { ACCESS_TOKEN_KEY, USER_INFO_KEY } from "@/config/constant";
import { login, getDetailViaLoginer, getLoginerAuth } from "@/api/system/system";
import { loginInter } from "@/api/type";
import Avatar from "@/assets/image/default-avatar.png";

interface RoleInter {
  roleId: string;
  roleName: string;
}
interface userInfoInter {
  account: string;
  adminId: string;
  name: string;
  sex: number | null;
  email: string;
  avatar?: string;
  roles: RoleInter[];
}
interface UserInter {
  token: string;
  userInfo: userInfoInter;
  permissions: string[];
}

export const useAppUserStore = defineStore({
  id: "app-user",
  state: (): UserInter => ({
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
    getUserInfo(): userInfoInter {
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
    getRoles(): RoleInter[] {
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
    setUserInfo(userInfo: userInfoInter) {
      this.userInfo = userInfo;
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    login(form: loginInter) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await login(form);
          const { token, iat, exp } = res.data;
          console.log(iat);
          locStorage.set(ACCESS_TOKEN_KEY, token, exp);
          
          this.setToken(token);
          let userData = await getDetailViaLoginer();
          console.log(userData);
          const { adminId, account, email, name, roles, sex } = userData.data;
          locStorage.set(USER_INFO_KEY,{ adminId, account, email, name, roles, sex, }, exp);
          this.setUserInfo({ adminId, account, email, name, roles, sex });

          let resAuthData = await getLoginerAuth()

          console.log(resAuthData);
          let authData = resAuthData.data.authorityList.map((item: {code: string}) => item.code)
          console.log(authData);
        //   this.setPermissions(authData)
        //   locStorage.set(PERMISSIONS_KEY,authData, exp);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
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
