import { FormItemRule } from "naive-ui";

export const data = [
  {
 id: 131123,
    agent: "西安鸿旭阳",
    account: "111@qq.com",
    contacts: '代理商',
    sex: 1,
    phone: '18093765456',
    status: 1,
  },
];

export const statusOptions = [
  {
    label: "正常",
    value: 1,
  },
  {
    label: "锁定",
    value: 0,
  },
];

export const sexOptions = [
  {
    label: "男",
    value: 1,
  },
  {
    label: "女",
    value: 0,
  },
];

export const rules = {
  companyName: { required: true, trigger: ["blur", "input"], message: "请输入运营企业名称" },
  agent: { required: true, trigger: ["blur", "input"], message: "请输入代理商名称" },
  adminName: { required: true, trigger: ["blur", "input"], message: "请输入管理名称" },
  socityCode: { required: true, trigger: ["blur", "input"], message: "请输入社会统一信用代码" },
  companyCode: { required: true, trigger: ["blur", "input"], message: "请输入运营企业编号" },
  cityCode: { required: true, trigger: ["blur", "input"], message: "选择运营城市" },
  sex: { required: true, type: "number", trigger: ["blur", "change"], message: "请选择管理员性别" },
  phone: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^1\d{10}$/.test(value);
    },
    message: "请输入正确格式的电话号码",
  },
};
