import { http } from '@/utils/http';
import { loginState } from "../interface"

//获取验证码
export function getConsoleInfo() {
  return http.request({
    url: '/captch',
    method: 'get',
  });
}
// 登录
export function login(data: loginState) {
  return http.request({
    url: '/login',
    method: 'post',
    data: {
        ...data
    }
  });   
}