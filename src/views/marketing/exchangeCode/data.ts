

export const rules = {
  exchangeCode: {
    required: true,
    trigger: ["blur", "input"],
    validator: (value: string) => {
      return /^([a-zA-Z0-9]+)$/.test(value);
    },
    message: "请输入10位字符数字"},
  exchangeCodeEffectiveTimeBegin: {required: true, trigger: ["blur", "input"], message: "请选择生效时间"},
  exchangeCodeEffectiveTimeEnd: {required: true, trigger: ["blur", "input"], message: "请选择失效时间"},
  exchangeCodeUsableCount: {
    required: true,
    type: "number",
    min: 1,
    max: 9999999999,
    trigger: ["blur", "change"],
    message: "请输入可兑换次数"
  },
  walletAmount: {
    exchangeRechargeAmount: {
      required: true,
      type: "number",
      trigger: ["blur", "change"],
      min: 0.01,
      max: 99999999.99,
      message: "请输入兑换实充金额"
    },
    exchangeGiftAmount: {
      required: true,
      digits: true,
      type: "number",
      trigger: ["blur", "change"],
      min: 0.01,
      max: 99999999.99,
      message: "请输入兑换赠送金额"
    },
  }
};
