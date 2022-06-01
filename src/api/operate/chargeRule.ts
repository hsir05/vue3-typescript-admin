import { http } from "@/utils/http";

/**
 * 查找所有套餐计费规则的列表
 */
export function baseList() {
  return http.request({
    url: "/chargeRule/chargeRuleBasePage",
    method: "post",
  });
}
/**
 * 获取数据
 */
export function getRuleData(type: string) {
  let url = "/chargeRule/chargeRuleBasePage";
  switch (type) {
    case "tab1":
      url = "/chargeRule/chargeRuleBasePage";
      break;
    case "tab2":
      url = "/chargeRule/chargeRuleMileageList";
      break;
    case "tab3":
      url = "/chargeRule/chargeRuleDurationList";
      break;
    case "tab4":
      url = "/chargeRule/chargeRuleWaitList";
      break;
    case "tab5":
      url = "/chargeRule/chargeRuleCancelList";
      break;
    case "tab6":
      url = "/chargeRule/chargeRuleFloatList";
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
interface CharageRuleInter{
    packagePrice:number | null
    containMileage:number | null
    containDuration:number | null
}
export function saveChargeRuleBase(data: CharageRuleInter) {
  return http.request({
    url: "/ChargeRule/saveChargeRuleBase",
    method: "post",
    data
  });
}
/**
 * 保存里程计费规则
 */
interface MileageInter{
    overMileage:number | null
    mileagePrice:number | null
}
export function saveChargeRuleMileage(data: MileageInter[]) {
  return http.request({
    url: "/chargeRule/saveChargeRuleMileage",
    method: "post",
    data
  });
}

/**
 * 保存时长计费规则
 */
interface DurationInter{
    overDuration:number | null   
    durationPrice:number | null
}
export function saveChargeRuleDuration(data: DurationInter[]) {
  return http.request({
    url: "/chargeRule/saveChargeRuleDuration",
    method: "post",
    data
  });
}
/**
 * 保存等待计费规则
 */
interface WaitInter{
    waitDuration:number | null   
    durationPrice:number | null
}
export function saveChargeRuleWait(data: WaitInter[]) {
  return http.request({
    url: "/chargeRule/saveChargeRuleWait",
    method: "post",
    data
  });
}
// /**
//  * 保存取消计费规则
//  */
// interface CancelInter{
//     overCancelDuration:number | null   
//     deductBasePricePrecent:number | null
// }
// export function saveChargeRuleCancel(data:CancelInter[]) {
//   return http.request({
//     url: "/chargeRule/saveChargeRuleCancel",
//     method: "post",
//     data
//   });
// }
/**
 * 保存取消计费规则
 */
interface CancelInter{
    overCancelDuration:number | null   
    deductBasePricePrecent:number | null
}
export function saveChargeRuleCancel(data:CancelInter[]) {
  return http.request({
    url: "/chargeRule/saveChargeRuleCancel",
    method: "post",
    data
  });
}
/**
 * 保存浮动计费规则
 */
interface FloatInter{
    overCancelDuration:number | null   
    deductBasePricePrecent:number | null
}
export function saveChargeRuleFloat(data:FloatInter) {
  return http.request({
    url: "/chargeRule/saveChargeRuleFloat",
    method: "post",
    data
  });
}

/**
 * 向开通区域分配计费规则
 */
interface DistributionInter {
    ruleId: string | null
    ruleType: string | null
    orderType: string | null
    vehicleType: string | null
    openArea: string | null
}
export function distributionRule(data: DistributionInter) {
  return http.request({
    url: "/chargeRule/dispatchRuleToOpenBusiness",
    method: "post",
    data
  });
}
