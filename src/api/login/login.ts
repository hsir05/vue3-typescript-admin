import { http } from '@/utils/http';
import { loginState } from "../type"

//获取验证码
export function getCaptcha(data: {account: string, password: string}) {
    console.log(data);
    
  return http.request({
    url: '/captcha',
    method: 'post',
    data: data
  });
}
// 登录
export function login(data: loginState) {
  return http.request({
    url: '/login',
    method: 'post',
    data
  });   
}