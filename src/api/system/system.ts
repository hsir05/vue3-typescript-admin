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
export function modifyRoleState(data: {roleId: string}) {
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
    url: '/admin/add',
    method: 'post',
    data
  });
}
/***
 * 编辑用户
*/
export function editUser(data: UserInter) {
  return http.request({
    url: '/admin/edit',
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

/***
 * 修改用户状态
*/
export function modifyUserState(data: {adminId: string | null;}) {
  return http.request({
    url: '/admin/modifyState',
    method: 'post', 
    data
  });
}

//-----------------------------系统权限------------------------ 
/**
 * 获取权限分页
*/
interface AuthPageInter {
  page: PaginationInter;
  search: {
    nameLike: string | null;
    codeLike: string | null;
    urlLike: string | null;
    stateEq: string | null;
    createTimeGe: string | null;
    createTimeLe: string | null;
  };
}
export function getAuthPage(data: AuthPageInter) {
  return http.request({
    url: '/authority/page',
    method: 'post',
    data:data
  });
}
/***
 * 添加权限
*/
interface AuthAddInter{
    authorityId?: string | null
    name: string | null
    code: string | null
    url: string | null
    state: number | null
}
export function addAuth(data: AuthAddInter) {
  return http.request({
    url: '/authority/add',
    method: 'post',
    data
  });
}
/***
 * 编辑权限
*/
export function editAuth(data: AuthAddInter) {
  return http.request({
    url: '/authority/edit',
    method: 'post',
    data
  });
}
/***
 * 权限详情
*/
export function getAuthDetail(data: {authorityId:string}) {
  return http.request({
    url: '/authority/detail',
    method: 'post',
    data
  });
}
/***
 * 删除权限
*/
export function removeAuth(data: {authorityId:string}) {
  return http.request({
    url: '/authority/delete',
    method: 'post',
    data
  });
}

/***
 * 权限名称去重
*/
export function authNameUniqueCheck(data: {name: string | null;}) {
  return http.request({
    url: '/authority/nameUniqueCheck',
    method: 'post',
    data
  });
}
/***
 * 权限编码去重
*/
export function codeUniqueCheck(data: {code: string | null;}) {
  return http.request({
    url: '/authority/codeUniqueCheck',
    method: 'post',
    data
  });
}
/***
 * 权限url去重
*/
export function urlUniqueCheck(data: {url: string | null;}) {
  return http.request({
    url: '/authority/urlUniqueCheck',
    method: 'post',
    data
  });
}
/***
 * 修改权限状态
*/
export function modifyAuthState(data: {authorityId: string | null;}) {
  return http.request({
    url: '/authority/modifyState',
    method: 'post',
    data
  });
}
/***
 * 指定角色权限列表查询
*/
export function listViaRole(data: {roleId: string | null;}) {
  return http.request({
    url: '/authority/listViaRole',
    method: 'post',
    data
  });
}
/***
 * 指定管理员权限列表查询
*/
export function listViaAdmin(data: {adminId: string | null;}) {
  return http.request({
    url: '/authority/listViaAdmin',
    method: 'post',
    data
  });
}
/***
 * 角色赋权
*/
interface AuthToRoleInter {
    authorityIdList: string[]
    roleId:string | null
}
export function grantToRole(data: AuthToRoleInter) {
  return http.request({
    url: '/authority/grantToRole',
    method: 'post',
    data
  });
}
/***
 * 角色权限回收
*/
interface RevokeFromRoleInter {
    authorityIdList: string[]
    roleId:string
}
export function revokeFromRole(data: RevokeFromRoleInter) {
  return http.request({
    url: '/authority/revokeFromRole',
    method: 'post',
    data
  });
}