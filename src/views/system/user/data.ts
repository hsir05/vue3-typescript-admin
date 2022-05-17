import { FormItemRule } from "naive-ui";
import { verifyEN, verifyPhone, verifyEmail } from "@/utils/verify";

export const rules = {
  account: {
    required: true,
    validator: (rule: FormItemRule, value: string) => {
      return verifyEN(rule, value);
    },
    trigger: ["blur", "input"],
    message: "请输入帐号",
  },
  name: { required: true, trigger: ["blur", "input"], message: "请输入用户名称" },
  roleIds: { type: "array", required: true, trigger: ["blur", "input"], message: "请选择角色" },
  sex: { required: true, type: "number", trigger: ["blur", "change"], message: "请选择性别" },
  phone: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      return verifyPhone(rule, value);
    },
    message: "请输入电话号码",
  },
  email: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      return verifyEmail(rule, value);
    },
    message: "请输入正确的邮箱地址",
  },
};
