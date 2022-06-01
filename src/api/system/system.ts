import { http } from '@/utils/http';
import { PaginationInter, loginInter, DictInter } from "../type"

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
 * 获取角色分页
*/
interface RolesPageInter {
  page: PaginationInter;
  search: {
    nameLike: string | null;
    stateEq: string | null;
    createTimeGe: string | null;
    createTimeLe: string | null;
  };
}
export function getRolesPage(data: RolesPageInter) {
  return http.request({
    url: '/role/page',
    method: 'post',
    data
  });
}

export function getAllRoles() {
  return http.request({
    url: '/role/roleListByAdmin',
    method: 'post',
  });
}
/***
 * 角色详情
*/
export function getRoleDetail(data: {roleId:string}) {
  return http.request({
    url: '/role/detail',
    method: 'post',
    data
  });
}
/***
 * 删除角色
*/
export function removeRole(data: {roleId:string}) {
  return http.request({
    url: '/role/delete',
    method: 'post',
    data
  });
}
/***
 * 添加角色
*/
interface RolesInter{
    roleId?: string | null
    name: string | null
    parentRoleId: string | null
    description: string | null
    state: number | null
}
export function addRole(data: RolesInter) {
  return http.request({
    url: '/role/add',
    method: 'post',
    data
  });
}
/***
 * 编辑角色
*/
export function editRole(data: RolesInter) {
  return http.request({
    url: '/role/edit',
    method: 'post',
    data
  });
}
/***
 * 角色名称去重
*/
export function nameUniqueCheck(data: {name: string | null; parentRoleId:string | null}) {
  return http.request({
    url: '/role/nameUniqueCheck',
    method: 'post',
    data
  });
}
/***
 * 修改角色状态
*/
export function modifyState(data: {roleId: string}) {
  return http.request({
    url: '/role/modifyState',
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
/**
 * 获取用户分页
*/
interface UsersPageInter {
  page: PaginationInter;
  search: {
    nameLike: string | null;
    stateEq: string | null;
    accountLike: string | null;
    createTimeGe: string | null;
    createTimeLe: string | null;
  };
}
export function getUsersPage(data: UsersPageInter) {
  return http.request({
    url: '/admin/page',
    method: 'post',
    data:data
  });
}
/***
 * 添加用户
*/
interface UserInter{
    adminId?: string | null
    name: string | null
    sex: number | null
    phone: string | null
    account: string | null
    email: string | null
    roleIds: string[] | null
    state: number | null
}
export function addUser(data: UserInter) {
  return http.request({
    url: '/role/add',
    method: 'post',
    data
  });
}
/***
 * 编辑用户
*/
export function editUser(data: UserInter) {
  return http.request({
    url: '/role/edit',
    method: 'post',
    data
  });
}
/***
 * 用户详情
*/
export function getUserDetail(data: {adminId:string}) {
  return http.request({
    url: '/admin/detail',
    method: 'post',
    data
  });
}
/***
 * 删除用户
*/
export function removeUser(data: {adminId:string}) {
  return http.request({
    url: '/admin/delete',
    method: 'post',
    data
  });
}