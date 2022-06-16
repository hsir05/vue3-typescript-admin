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
// 中文姓名验证
export const verifyCN = (_: FormItemRule, value: string) => {
    if (!value) {
        return false
    }
  return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value);
};
// 英文帐号
export const verifyEN = (_: FormItemRule, value: string) => {
    if (!value) {
        return false
    }
  return /^[0-9a-zA-Z_]{1,}$/.test(value);
};
// 英文帐号
export const verifyCharNumber = (_: FormItemRule, value: string) => {
  if (!value) {
    return false
  }
  return /^([a-zA-Z0-9]+)$/.test(value);
};
//正整数
export const positiveInteger = (_:FormItemRule,value:string) =>{
  return /^[0-9]*[1-9][0-9]*$/.test(value);
}
//正小数或0
export const positiveDecimal =(_:FormItemRule,value:string) =>{
  let positiveDecimal = /^[1-9]+\d*$/;
  let positiveDecima2 = /^\d+\.\d{1,2}$/;
  let positiveDecima3 = /^0$/;

  return  (positiveDecimal.test(value)) || (positiveDecima2.test(value)) || (positiveDecima3.test(value));
}
