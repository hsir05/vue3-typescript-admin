import { FormItemRule } from "naive-ui";
import { verifyPhone, verifyEmail } from "@/utils/verify";

export const rules = {
  account: {
    required: true,
   pattern:  /^[0-9a-zA-Z_]{6,20}$/,
    trigger: ["blur", "input"],
    message: "请输入6到20位的英文字母下划线数字的组合",
  },
  name: { required: true, pattern:/^[\u4E00-\u9FA5]*$/, trigger: ["blur", "input"], message: "请输入6到20位的用户名称" },
  pwd: { required: true,min:6, max:10, trigger: ["blur", "input"], message: "请输入密码" },
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
