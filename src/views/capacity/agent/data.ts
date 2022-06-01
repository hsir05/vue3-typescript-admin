import { FormItemRule } from "naive-ui";
import { verifyPhone } from "@/utils/verify"

export const rules = {
  loginCredential: { required: true, trigger: ["blur", "input"], message: "请输入代理商登陆账号" },
  operationCompanyAgencyName: { required: true, trigger: ["blur", "input"], message: "请输入代理商登陆账号" },
  operationCompanyAgencyContactName: { required: true, trigger: ["blur", "input"], message: "请输入联系人姓名" },
  operationCompanyAgencyContactGender: { required: true, type: "number", trigger: ["blur", "change"], message: "请选择联系人性别" },
  operationCompanyAgencyContactPhone: {
    required: true,
    trigger: ["input"],
    validator: (rule: FormItemRule, value: string) => {
      return verifyPhone(rule,value)
    },
    message: "请输入正确格式的电话号码",
  },
};
