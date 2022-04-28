import { FormItemRule } from "naive-ui";

// 手机号码验证
export const verifyPhone = (_: FormItemRule, value: string) => {
  return /^1\d{10}$/.test(value);
};
//邮箱验证
export const verifyEmail = (_: FormItemRule, value: string) => {
  return /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/.test(
    value
  );
};
// 中文姓名验证
export const verifyCNName = (_: FormItemRule, value: string) => {
    if (!value) {
        return false
    } else if (value.length < 2) {
        return false
    } else if (value.length > 4) {
        return false
    }
  return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value);
};