export const driverMemberRules = {
  goodsName: { required: true, trigger: ["blur", "input"], message: "请输入产品名称" },
  goodsType: { required: true, trigger: ["blur", "change"], message: "请选择产品类型" },
  memberEndTime: {type: 'number', required: true, trigger: ["blur", "input"], message: "请选择产品到期时间" },
  goodsTagPrice: { type: 'number', required: true, trigger: ["blur", "input"], message: "请输入产品原价" },
  goodsSellingPrice: { type: 'number', required: true, trigger: ["blur", "input"], message: "请输入产品售价" },
  effectBeginTime: { type: 'number', required: true, trigger: ["blur", "input"], message: "请选择产品生效时间" },
  effectEndTime: { type: 'number', required: true, trigger: ["blur", "input"], message: "请选择产品失效时间" },
  purchasableDaysBeforeMemberExpire: { type: 'number', required: true, trigger: ["blur", "input"], message: "请输入到期前开放购买天数" },
};
