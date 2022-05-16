 import { http } from '@/utils/http';
import { RolesInter, UsersDataInter, loginInter, DictInter } from "../type"


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
//----------------------角色管理-------------------------
/**
 * 获取角色
*/
export function getRoles(data: RolesInter) {
  return http.request({
    url: '/roles',
    method: 'post',
    data
  });
}

//---------------------菜单管理-----------------------
//获取路由菜单
export function getMenus() {
  return http.request({ 
    url: '/menus',
    method: 'post',
  });
}

//-----------------------用户管理-----------------------------
//获取路由菜单
export function getUsers(data: UsersDataInter) {
    console.log(data);
    
  return http.request({
    url: '/users',
    method: 'post',
    data
  });
}