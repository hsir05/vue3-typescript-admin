import { http } from '@/utils/http';
import { loginInter, DictInter } from "../type"

//-----------------字典管理-------------------------
export function getDict(data: DictInter) {
  return http.request({
    url: '/dict',
    method: 'post',
    data
  });
}

//-----------------------登录管理----------------------------
//获取验证码
export function getCaptcha(data: {account: string, password: string}) {
  return http.request({
    url: '/captcha',
    method: 'post',
    data: data
  });
}
// 登录
export function login(data: loginInter) {
  return http.request({
    url: '/login',
    method: 'post',
    data
  });   
}
// 刷新token
export function refreshToken() {
  return http.request({
    url: '/refreshToken',
    method: 'post'
  });   
}
// 当前登录管理员详情查询 
export function getDetailViaLoginer() {
  return http.request({
    url: '/admin/detailViaLoginer',
    method: 'post'
  });   
}

// 当前登录管理员权限列表查询
export function getLoginerAuth() {
  return http.request({
    url: '/authority/listViaLoginer',
    method: 'post'
  });   
}