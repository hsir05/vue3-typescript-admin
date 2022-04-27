import { FormItemRule } from "naive-ui";

export const rules = {
  operationCompanyName: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入运营企业名称",
  },

  unifiedSocialCreditCode: {
    required: true,
    trigger: ["blur", "input"],
    min: 10,
    max: 20,
    message: "请输入社会统一信用代码",
  },
  operationCompanyCode: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入运营企业编号",
  },
  operationCityCode: { required: true, trigger: ["blur", "input"], message: "选择运营城市" },
  operationCompanyManagerName: {
    required: true,
    trigger: ["blur", "input"],
    min: 2,
    maxLength: 4,
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^[\u4e00-\u9fa5]+$/.test(value);
    },
    message: "请输入中文管理名称",
  },
  operationCompanyManagerGender: {
    required: true,
    type: "number",
    trigger: ["blur", "change"],
    message: "请选择管理员性别",
  },
  operationCompanyManagerPhone: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^1\d{10}$/.test(value);
    },
    message: "请输入正确格式的电话号码",
  },
};
