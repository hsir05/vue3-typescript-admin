import { FormItemRule } from "naive-ui";

export const data = [
  {
    id: 131123,
    account: "zhangsan",
    name: "张三",
    sex: 1,
    phone: "18098765678",
    create_time: "2022-03-13",
    status: 0,
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
  account: { required: true, trigger: ["blur", "input"], message: "请输入帐号" },
  name: { required: true, trigger: ["blur", "input"], message: "请输入用户名称" },
  sex: { required: true, type: "number", trigger: ["blur", "change"], message: "请选择性别" },
  phone: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^1\d{10}$/.test(value);
    },
    message: "请输入电话号码",
  },
  email: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/.test(
        value
      );
    },
    message: "请输入正确的邮箱地址",
  },
};
