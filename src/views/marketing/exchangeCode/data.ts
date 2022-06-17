import {positiveInteger, verifyCharNumber} from "@/utils/verify"
import {FormItemRule} from "naive-ui";

export const amountRules = {
  taskName: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入正确的任务名称"
  },
  exchangeCodeCount:{
    required: true,
    type: "number",
    min: 1,
    max: 99999,
    trigger: ["blur", "change"],
    validator: (rule: FormItemRule, value: string) => {
      return positiveInteger(rule, value)
    },
    message: "请输入正确兑换码个数"
  },
  exchangeCode: {
    required: true,
    trigger: ["blur", "input"],
    validator: (rule: FormItemRule, value: string) => {
      return verifyCharNumber(rule, value)
    },
    message: "请输入10位字符数字"
  },
  exchangeCodeEffectiveTimeBegin: {
    required: true,
    type: "number",
    trigger: ["blur", "input"],
    message: "请选择生效时间"
  },
  exchangeCodeEffectiveTimeEnd: {
    required: true,
    type: "number",
    trigger: ["blur", "input"],
    message: "请选择失效时间"
  },
  exchangeCodeUsableCount: {
    required: true,
    type: "number",
    min: 1,
    max: 9999999999,
    trigger: ["blur", "change"],
    validator: (rule: FormItemRule, value: string) => {
      return positiveInteger(rule, value)
    },
    message: "请输入正确可兑换次数"
  },
  walletAmount: {
    exchangeRechargeAmount: {
      required: true,
      type: "number",
      trigger: ["blur", "change"],
      min: 0.01,
      max: 99999999.99,
      message: "请输入正确兑换实充金额"
    },
    exchangeGiftAmount: {
      required: true,
      digits: true,
      type: "number",
      trigger: ["blur", "change"],
      min: 0.01,
      max: 99999999.99,
      message: "请输入正确兑换赠送金额"
    },
  }
}

export const codeRules = {
  taskName: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入正确的任务名称"
  },
  exchangeCodeCount:{
    required: true,
    type: "number",
    min: 1,
    max: 99999,
    trigger: ["blur", "change"],
    validator: (rule: FormItemRule, value: string) => {
      return positiveInteger(rule, value)
    },
    message: "请输入正确兑换码个数"
  },
  exchangeCode: {
    required: true,
    trigger: ["blur", "input"],
    validator: (rule: FormItemRule, value: string) => {
      return verifyCharNumber(rule, value)
    },
    message: "请输入10位字符数字"
  },
  exchangeCodeEffectiveTimeBegin: {
    required: true,
    type: "number",
    trigger: ["blur", "input"],
    message: "请选择生效时间"
  },
  exchangeCodeEffectiveTimeEnd: {
    required: true,
    type: "number",
    trigger: ["blur", "input"],
    message: "请选择失效时间"
  },
  exchangeCodeUsableCount: {
    required: true,
    type: "number",
    min: 1,
    max: 9999999999,
    validator: (rule: FormItemRule, value: string) => {
      return positiveInteger(rule, value)
    },
    trigger: ["blur", "change"],
    message: "请输入正确可兑换次数"
  },
}
