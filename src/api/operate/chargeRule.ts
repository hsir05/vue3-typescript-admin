import { http } from '@/utils/http';


/**
 * 查找所有套餐计费规则的列表 
*/
export function baseList() {
  return http.request({
    url: '/chargeRule/chargeRuleBaseList',
    method: 'post'
  });
}
/**
 * 查找所有里程计费规则的列表 
*/
export function mileageList() {
  return http.request({
    url: '/chargeRule/chargeRuleMileageList',
    method: 'post'
  });
}
/**
 * 查找所有时长计费规则的列表 
*/
export function durationList() {
  return http.request({
    url: '/chargeRule/chargeRuleDurationList',
    method: 'post'
  });
}
/**
 * 查找所有等待计费规则的列表 
*/
export function waitList() {
  return http.request({
    url: '/chargeRule/chargeRuleWaitList',
    method: 'post'
  });
}
/**
 * 查找所有取消计费规则的列表 
*/
export function cancelList() {
  return http.request({
    url: '/chargeRule/chargeRuleCancelList',
    method: 'post'
  });
}
/**
 * 查找所有取消计费规则的列表 
*/
export function floatList() {
  return http.request({
    url: '/chargeRule/chargeRuleFloatList',
    method: 'post'
  });
}


/**
 * 保存套餐计费规则 
*/
export function saveChargeRuleBase() {
  return http.request({
    url: '/ChargeRule/saveChargeRuleBase',
    method: 'post'
  });
}
/**
 * 保存里程计费规则 
*/
export function saveChargeRuleMileage() {
  return http.request({
    url: '/chargeRule/saveChargeRuleMileage',
    method: 'post'
  });
}