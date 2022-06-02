

export enum sexEnum {
    "女",
    "男",
    "未知"
} 
// * 申请状态 DRS0004 = 平台未审核
 //  DRS0005 = 平台审核未通过
 //  DRS0006 = 平台审核通过
export enum registerStateEnum {
    DRS0004,
    DRS0005,
    DRS0006,
}
// 订单状态
export enum OrderDataEnum {
    CREATEORDER = 'createOrderState',//下单
    ACCEPTORDER = 'acceptOrderState', //接单
    RECEPTIONPASSENGER = 'receptionPassengerState', //去接乘客 
    DRIVERARRIVERPICKUPADDRESS = 'driverArrivePickupAddressState', //到达上车地点
    DRIVERBEGINSERVICES = 'driverBeginServiceState', //开始服务 
    DRIVERENDSERVICES = 'driverEndServiceState', // 结束服务 
    DRIVERSUBMISSIONCOST = 'driverSubmissionCostState', // 提交费用
    ORDERCOSTCREATE = 'orderCostCreateState', // 支付
    ORDEREND = 'orderEndState', // 结束
}

export enum Dict {
    // 附件数据类型 AFT0000
    AFT0000 = "AFT0000" 
    // 预付款出账类型 AOT0000
    // 权限类型 AT00000
    // 客户登录类型 CLT0000
    // 客户会员类型 CMT0000
    // 代金券获得时机 COT0000
    // 代金券状态 CS00000
    // 客户钱包类型 CWT0000
    // 终端频道类型 DCT0000
    // 司机钱包交易方式 DDW0000
    // 司机登录类型 DLT0000
    // 司机会员产品类型 DMG0000
    // 司机消息类型 DMT0000
    // 司机作息类型 DRT0000
    // 注册司机学历 DRT1000
    // 注册司机驾照类型 DRT2000
    // 注册司机车辆燃料类型 DRT3000
    // 注册司机车辆类型 DRT4000
    // 注册司机车辆行驶证车辆类型 DRT5000
    // 注册司机车辆使用性质 DRT6000
    // 注册司机车辆使用性质 DRT6000
    // 司机状态 DS00000
    // 司机服务状态 DSS0000
    // 兑换码获得时机 EAO0000
    // 兑换码状态 ECS0000
    // 兑换码兑换类型 EXT0000
    // 结单方式 FOT0000
    // 集团员工职能类型 GEF0000
    // 集团客户登录类型 GLT0000
    // 集团客户会员类型 GMT0000
    // 集团钱包入账类型 GWI0000
    // 集团钱包出账类型 GWO0000
    // 集团钱包充值类型 GWR0000
    // 发票申请类型 IAT0000
    // 流量方 IFT0000
    // 订单业务类型 OBT0000
    // 订单下单入口 OCE0000
    // 订单算费类型 OCT0000
    // 派单类型 ODT0000
    // 订单状态 OS00000
    // 订单类型 OT00000
    // 网络支付业务类型 PBT0000
    // 支付渠道类型 PCT0000
    // 推送类型 PT00000
    // 退款业务类型 RBT0000
    // 短信发送类型 SMT0000
    // 短信平台类型 SPT0000
    // 字典结构树 TR00000
    // 提现渠道类型 WCT0000
    // 客户钱包入账类型 WFT0000
    // 客户钱包出账类型 WOT0000
    // 客户钱包充值类型 WRT0000 
   
}