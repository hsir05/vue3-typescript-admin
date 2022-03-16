
export const data = [
  {
    id: "123qerqwe",
    name: "附件数据类型",
    sort: 1,
    isChild: 1,
    code: "AFT0000",
    status: 1,
  },
  {
    id: "123qer2222qwe",
    name: "附件数据类型",
    sort: 1,
    isChild: 1,
    code: "AFT0000",
    status: 1,
  },
];

export const rules = {
  name: { required: true, trigger: ["blur", "input"], message: "请输入词条名称" },
  code: { required: true, trigger: ["blur", "input"], message: "请输入词条编码" },
//   name: { required: true, trigger: ["blur", "input"], message: "请输入词条名称" },

}