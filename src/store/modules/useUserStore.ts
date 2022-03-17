import { defineStore } from "pinia";
import { locStorage } from "@/utils/storage";
import { ACCESS_TOKEN_KEY, USER_INFO_KEY } from "@/config/constant";
// import { login } from "@/api/login/login";
// import { loginState } from "@/api/interface";
// import { ResultEnum } from "@/enums/httpEnum";

interface UserState {
  token: string;
  username: string;
  avatar: string;
  role: string;
  info: any;
  permissions: string[]
}

export const useAppUserStore = defineStore({
  id: "app-user",
  state: (): UserState => ({
    token: locStorage.get(ACCESS_TOKEN_KEY),
    username: "Admin",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    role: "",
    info: "",
    permissions: ["dict001", "dict002"]
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getUsername(): string {
      return this.username;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getRole(): string {
      return this.role;
    },
    getPermissions(): string[] {
      return this.permissions;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setRole(role: string) {
      this.role = role;
    },
    // login(userInfo: loginState) {
    //     login(userInfo).then((res) => {
    //         const { result, code, expire } = res;
    //         if (code === ResultEnum.SUCCESS) {
    //         locStorage.set(ACCESS_TOKEN_KEY, result.token, expire);
    //         locStorage.set(USER_INFO_KEY, result, expire);
    //         this.setToken(result.token);
    //         return Promise.resolve(res);
    //     }
    //     }).catch((e) => {
    //         return Promise.reject(e);
    //     })
    // },
    logout() {
      this.setRole("");
      locStorage.remove(ACCESS_TOKEN_KEY);
      locStorage.remove(USER_INFO_KEY);
      return Promise.resolve();
    },
  },
});
