import {http} from "@/utils/http";
import {PaginationInter} from "../type";

//-----------------广告管理-------------------------

/**
 * 广告分页
 */
interface AdPageInter {
  page: PaginationInter;
  search: {
    cityCodeEq: string | null;
  };
}

export function getAdPage(data: AdPageInter) {
  return http.request({
    url: "/openCityAdvertisement/page",
    method: "post",
    data: data,
  });
}

/**
 * 新增广告
 */
interface AdvertisementInter {
  openCityAdvertisementId?: string | null;
  cityCode: string | null;
  advertisementTitle: string | null;
  advertisementImageUrl: string | null;
  advertisementH5Url: string | null;
  advertisementEffectiveTimeBegin: string | null;
  advertisementEffectiveTimeEnd: string | null;
}

export function addAdvertisement(data: AdvertisementInter) {
  return http.request({
    url: "/openCityAdvertisement/add",
    method: "post",
    data: data,
  });
}

/**
 * 编辑广告
 */
export function editAdvertisement(data: AdvertisementInter) {
  return http.request({
    url: "/openCityAdvertisement/edit",
    method: "post",
    data: data,
  });
}

/**
 * 广告详情
 */
export function getAdDetail(data: { openCityAdvertisementId: string }) {
  return http.request({
    url: "/openCityAdvertisement/detail",
    method: "post",
    data: data,
  });
}

/**
 * 删除
 */
export function removeAd(data: { openCityAdvertisementId: string }) {
  return http.request({
    url: "/openCityAdvertisement/delete",
    method: "post",
    data: data,
  });
}

/**
 * 城市广告序列前移
 */
export function upAdvertisement(data: { openCityAdvertisementId: string }) {
  return http.request({
    url: "/openCityAdvertisement/upgradeAdvertisementSeq",
    method: "post",
    data: data,
  });
}

/**
 * 城市广告序列后移
 */
export function downAdvertisement(data: { openCityAdvertisementId: string }) {
  return http.request({
    url: "/openCityAdvertisement/lowerAdvertisementSeq",
    method: "post",
    data: data,
  });
}

//-----------------代金券消费规则配置-------------------------

/**
 * 代金券分页
 */
interface CouponRulePageInter {
  page: PaginationInter;
  search: {
    customerCouponConsumeRuleNameLike: string | null;
    couponUsedCityCodesLike: string | null;
    couponUsedOrderTypesLike: string | null;
  };
}

export function getCouponConsumeRulePage(data: CouponRulePageInter) {
  return http.request({
    url: "/customerCouponConsumeRule/page",
    method: "post",
    data: data,
  });
}

/**
 * 代金券消费规则集合
 */
export function customerCouponConsumeRuleList() {
  return http.request({
    url: "/customerCouponConsumeRule/list",
    method: "post"
  });
}

export function customerCouponConsumeRuleDetail(data: { customerCouponConsumeRuleId: string }) {
  return http.request({
    url: "/customerCouponConsumeRule/details",
    method: "post",
    data: data
  })
}

/**
 * 代金券消费规则新增
 */
interface CouponInter {
  customerCouponConsumeRuleId?: string | null;
  customerCouponConsumeRuleName: string | null;
  couponLimitedAmount: string | null;
  couponUsedCityCodes: string[] | null;
  couponUsedOrderTypes: string[] | null;
  couponUsedVehicleTypeIds: string[] | null;
}

export function addCoupon(data: CouponInter) {
  return http.request({
    url: "/customerCouponConsumeRule/add",
    method: "post",
    data: data,
  });
}

/**
 * 编辑代金券消费规则
 */
export function editCoupon(data: CouponInter) {
  return http.request({
    url: "/customerCouponConsumeRule/edit",
    method: "post",
    data: data,
  });
}

/**
 * 代金券消费规则删除
 */
export function removeCoupon(data: { customerCouponConsumeRuleId: string }) {
  return http.request({
    url: "/customerCouponConsumeRule/delete",
    method: "post",
    data: data,
  });
}

//-----------------代金券管理-------------------------

/**
 * 代金券分页
 */
interface CouponPageInter {
  page: PaginationInter;
  search: {
    couponNameLike: string | null;
    customerPhoneLike: string | null;
    couponAchieveTimeGe: string | null;
    couponAchieveTimeLe: string | null;
    couponAchieveOpportunityEq: string | null;
    couponUseStateEq: string | null;
  };
}

export function getCouponPage(data: CouponPageInter) {
  return http.request({
    url: "/customerCoupon/page",
    method: "post",
    data: data,
  });
}

/**
 * 代金券详情
 */
export function getCouponDetail(data: { customerCouponId: string }) {
  return http.request({
    url: "/customerCoupon/detail",
    method: "post",
    data: data,
  });
}

/**
 * 代金券详情
 */
interface GiftCouponInter {
  customerId: string | null
  couponName: string | null
  customerCouponConsumeRuleId: string | null
  couponDenomination: string | null
  couponEffectiveTimeBegin: string | null
  couponEffectiveTimeEnd: string | null
  couponCount: string | null
}

export function giftCoupon(data: GiftCouponInter) {
  return http.request({
    url: "/customerCoupon/giftCoupon",
    method: "post",
    data: data,
  });
}

//-----------------兑换码管理-------------------------

/**
 * 兑换码分页
 */
interface ExchangeCodePageInter {
  page: PaginationInter;
  search: {
    exchangeCodeLike: string | null;
    exchangeCodeExchangeTypeEq: string | null;
    exchangeCodeCreateTimeGe: string | null;
    exchangeCodeCreateTimeLe: string | null;
  };
}

export function getExchangeCodePage(data: ExchangeCodePageInter) {
  return http.request({
    url: "/exchangeCode/page",
    method: "post",
    data: data,
  });
}

// 兑换码详情
export function getExchangeCodeDetail(data: { exchangeCodeId: string }) {
  return http.request({
    url: "/exchangeCode/detail",
    method: "post",
    data: data,
  });
}

/**
 * 添加代金券兑换码
 */
interface CouponListInter {
  couponName: string | null,
  couponDenomination: number | null,
  couponEffectiveDays: number | null,
  customerCouponConsumeRuleId: string | null,
  couponCount: number | null
}
interface AddExchangeCodeCouponInter {
  exchangeCode: string | null,
  exchangeCodeEffectiveTimeBegin: string | null,
  exchangeCodeEffectiveTimeEnd: string | null,
  exchangeCodeUsableCount: number | null,
  couponList:Array<CouponListInter>
}

export function addExchangeCodeCoupon(data: AddExchangeCodeCouponInter) {
  return http.request({
    url: "/exchangeCode/addExchangeCodeCoupon",
    method: "post",
    data: data,
  })
}

/**
 * 批量添加代金券兑换码
 */
interface AddExchangeCodeCouponBatchInter {
  taskName: string | null,
  exchangeCodeCount: number | null,
  exchangeCodeEffectiveTimeBegin: string | null,
  exchangeCodeEffectiveTimeEnd: string | null,
  exchangeCodeUsableCount: number | null,
  couponList: Array<CouponListInter>
}

export function addExchangeCodeCouponBatch(data: AddExchangeCodeCouponBatchInter) {
  return http.request({
    url: "/exchangeCode/addExchangeCodeCouponBatch",
    method: "post",
    data: data,
  })
}

/**
 * 兑换码兑换分页
 */
interface RecordPageInter {
  page: PaginationInter;
  search: {
    exchangeCodeIdEq: string | null;
    customerPhoneLike: string | null;
  };
}

export function getRecordPagePage(data: RecordPageInter) {
  return http.request({
    url: "/exchangeCode/recordPage",
    method: "post",
    data: data,
  });
}

/**
 * 兑换码兑换金额
 */
interface AddExchangeCodeWalletAmountInter {
  exchangeCode: string | null,
  exchangeCodeEffectiveTimeBegin: string | null,
  exchangeCodeEffectiveTimeEnd: string | null,
  exchangeCodeUsableCount: number | null,
  walletAmount: {
    exchangeRechargeAmount: number | null,
    exchangeGiftAmount: number | null
  }
}

export function addExchangeCodeWalletAmount(data: AddExchangeCodeWalletAmountInter) {
  return http.request({
    url: "/exchangeCode/addExchangeCodeWalletAmount",
    method: "post",
    data: data,
  });
}

interface AddExchangeCodeWalletAmountBatchInter {
  taskName: string | null,
  exchangeCodeCount: number | null,
  exchangeCode: string | null,
  exchangeCodeEffectiveTimeBegin: string | null,
  exchangeCodeEffectiveTimeEnd: string | null,
  exchangeCodeUsableCount: number | null,
  walletAmount: {
    exchangeRechargeAmount: number | null,
    exchangeGiftAmount: number | null
  }
}

export function addExchangeCodeWalletAmountBatch(data: AddExchangeCodeWalletAmountBatchInter) {
  return http.request({
    url: "/exchangeCode/addExchangeCodeWalletAmountBatch",
    method: "post",
    data: data,
  });
}

//检验兑换码是否重复
export function uniqueExchangeCode(data: { exchangeCode: string }) {
  return http.request({
    url: "/exchangeCode/uniqueExchangeCode",
    method: "post",
    data: data,
  });
}

//-----------------钱包充值活动管理-------------------------

/**
 * 钱包充值活动分页
 */
interface WalletRechargeActivityPageInter {
  page: PaginationInter;
  search: {
    paymentChannelTypeEq: string | null;
  };
}

export function getWalletRechargeActivityPage(data: WalletRechargeActivityPageInter) {
  return http.request({
    url: "/customerWalletRechargeActivity/page",
    method: "post",
    data: data,
  });
}

// 详情
export function getRechargeDetail(data: { customerWalletRechargeActivityId: string }) {
  return http.request({
    url: "/customerWalletRechargeActivity/detail",
    method: "post",
    data: data,
  });
}

/**
 * 新增充值活动
 */
interface RechargeActivityInter {
  customerWalletRechargeActivityId?: string | null
  paymentChannelType: string | null;
  rechargeRate: number | null;
  minimumRechargeAmount: number | null;
  cumulativeRechargeAmount: number | null;
  activityBeginTime: string | null;
  activityEndTime: string | null;
  activityDesc: string | null;
}

export function addRechargeActivity(data: RechargeActivityInter) {
  return http.request({
    url: "/customerWalletRechargeActivity/add",
    method: "post",
    data: data,
  });
}

/**
 * 编辑充值活动
 */
export function editRechargeActivity(data: RechargeActivityInter) {
  return http.request({
    url: "/customerWalletRechargeActivity/edit",
    method: "post",
    data: data,
  });
}

//-----------------订单支付渠道-------------------------

/**
 * 获取订单支付渠道列表
 */
interface ActivityInter {
  deviceChannelType: string | null;
  orderBusinessType: string | null;
}

export function getOrderPayChannelList(data: ActivityInter) {
  return http.request({
    url: "/orderPayChannelTypeShow/list",
    method: "post",
    data: data,
  });
}

/**
 * 订单支付详情
 */
export function getOrderPayDetail(data: { orderPayChannelTypeShowId: string }) {
  return http.request({
    url: "/orderPayChannelTypeShow/detail",
    method: "post",
    data: data,
  });
}

/**
 * 新增订单支付渠道
 */
interface PayChannelInter {
  orderPayChannelTypeShowId?: string | null;
  orderPayChannelTypeShowName: string | null;
  paymentChannelType: string | null;
  orderPayChannelTypeShowDesc: string | null;
  orderPayChannelTypeLock: number | null;
}

export function addPayChannelType(data: PayChannelInter) {
  return http.request({
    url: "/orderPayChannelTypeShow/add",
    method: "post",
    data: data,
  });
}

/**
 * 编辑订单支付渠道
 */
export function editPayChannelType(data: PayChannelInter) {
  return http.request({
    url: "/orderPayChannelTypeShow/edit",
    method: "post",
    data: data,
  });
}

/**
 * 订单支付渠道序列前移
 */
export function upgradeSeq(data: { orderPayChannelTypeShowId: string }) {
  return http.request({
    url: "/orderPayChannelTypeShow/upgradeSeq",
    method: "post",
    data: data,
  });
}

/**
 * 订单支付渠道序列后移
 */
export function lowerSeq(data: { orderPayChannelTypeShowId: string }) {
  return http.request({
    url: "/orderPayChannelTypeShow/lowerSeq",
    method: "post",
    data: data,
  });
}

//-----------------预付款支付渠道-------------------------

/**
 * 获取订单支付渠道列表
 */

export function getAdvanceList(data: { deviceChannelType: string }) {
  return http.request({
    url: "/orderAdvancePayChannelTypeShow/list",
    method: "post",
    data: data,
  });
}

/**
 * 预付款支付详情
 */
export function getAdvancePayDetail(data: { orderAdvancePayChannelTypeShowId: string }) {
  return http.request({
    url: "/orderAdvancePayChannelTypeShow/detail",
    method: "post",
    data: data,
  });
}

/**
 * 新增预付款支付渠道
 */
interface AdvancePayChannelInter {
  orderAdvancePayChannelTypeShowId?: string | null
  orderAdvancePayChannelTypeShowName: string | null;
  paymentChannelType: string | null;
  deviceChannelType: string | null;
  orderAdvancePayChannelTypeShowDesc: string | null;
  orderAdvancePayChannelTypeLock: number | null;
}

export function addAdvancePayChannelType(data: AdvancePayChannelInter) {
  return http.request({
    url: "/orderPayChannelTypeShow/add",
    method: "post",
    data: data,
  });
}

/**
 * 编辑预付款支付渠道
 */
export function editAdvancePayChannelType(data: AdvancePayChannelInter) {
  return http.request({
    url: "/orderPayChannelTypeShow/edit",
    method: "post",
    data: data,
  });
}

/**
 * 预付款支付渠道序列前移
 */
export function upgradeAdvanceSeq(data: { orderAdvancePayChannelTypeShowId: string }) {
  return http.request({
    url: "/orderAdvancePayChannelTypeShow/upgradeSeq",
    method: "post",
    data: data,
  });
}

/**
 * 预付款支付渠道序列后移
 */
export function lowerAdvanceSeq(data: { orderAdvancePayChannelTypeShowId: string }) {
  return http.request({
    url: "/orderAdvancePayChannelTypeShow/lowerSeq",
    method: "post",
    data: data,
  });
}
