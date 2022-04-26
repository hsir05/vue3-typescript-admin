import { http } from "@/utils/http";

/**
 * 查找所有套餐计费规则的列表
 */
export function baseList() {
  return http.request({
    url: "/chargeRule/chargeRuleBaseList",
    method: "post",
  });
}
/**
 * 获取数据
 */
export function getRuleData(type: string) {
  let url = "/chargeRule/chargeRuleBaseList";
  switch (type) {
    case "tab1":
      url = "/chargeRule/chargeRuleBaseList";
      break;
    case "tab2":
      url = "/chargeRule/chargeRuleBaseList";
      break;
    case "tab3":
      url = "/chargeRule/chargeRuleBaseList";
      break;
    case "tab4":
      url = "/chargeRule/chargeRuleBaseList";
      break;
    case "tab5":
      url = "/chargeRule/chargeRuleBaseList";
      break;
    case "tab6":
      url = "/chargeRule/chargeRuleBaseList";
      break;
  }
  return http.request({
    url: url,
    method: "post",
  });
}

/**
 * 查找所有里程计费规则的列表
 */
export function mileageList() {
  return http.request({
    url: "/chargeRule/chargeRuleMileageList",
    method: "post",
  });
}
/**
 * 查找所有时长计费规则的列表
 */
export function durationList() {
  return http.request({
    url: "/chargeRule/chargeRuleDurationList",
    method: "post",
  });
}
/**
 * 查找所有等待计费规则的列表
 */
export function waitList() {
  return http.request({
    url: "/chargeRule/chargeRuleWaitList",
    method: "post",
  });
}
/**
 * 查找所有取消计费规则的列表
 */
export function cancelList() {
  return http.request({
    url: "/chargeRule/chargeRuleCancelList",
    method: "post",
  });
}
/**
 * 查找所有取消计费规则的列表
 */
export function floatList() {
  return http.request({
    url: "/chargeRule/chargeRuleFloatList",
    method: "post",
  });
}

/**
 * 保存套餐计费规则
 */
export function saveChargeRuleBase() {
  return http.request({
    url: "/ChargeRule/saveChargeRuleBase",
    method: "post",
  });
}
/**
 * 保存里程计费规则
 */
export function saveChargeRuleMileage() {
  return http.request({
    url: "/chargeRule/saveChargeRuleMileage",
    method: "post",
  });
}

/**
 * 保存时长计费规则
 */
export function saveChargeRuleDuration() {
  return http.request({
    url: "/chargeRule/saveChargeRuleDuration",
    method: "post",
  });
}
/**
 * 保存等待计费规则
 */
export function saveChargeRuleWait() {
  return http.request({
    url: "/chargeRule/saveChargeRuleWait",
    method: "post",
  });
}

/**
 * 保存取消计费规则
 */
export function saveChargeRuleCancel() {
  return http.request({
    url: "/chargeRule/saveChargeRuleCancel",
    method: "post",
  });
}
/**
 * 保存浮动计费规则
 */
export function saveChargeRuleFloat() {
  return http.request({
    url: "/chargeRule/saveChargeRuleFloat",
    method: "post",
  });
}

/**
 * 向开通区域分配计费规则
 */
interface ruleState {
    ruleId: String | null
    ruleType: String | null
    orderType: String | null
    vehicleType: String | null
    openArea: String | null
}
export function distributionRule(data: ruleState) {
  return http.request({
    url: "/chargeRule/dispatchRuleToOpenBusiness",
    method: "post",
    data
  });
}
