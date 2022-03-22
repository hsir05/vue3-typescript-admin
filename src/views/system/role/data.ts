
export const data = [
  {
    id: 131123,
    parentId: 'superAdmin',
    name: "admin",
    create_time: "2022-03-13",
    status: 0,
    descript: '这是一个管理员'
  },
];

export const parentOptions = [
    {
        label: '开发人员',
        value: 123123123
    }
]



export const rules = {
  name: { required: true, trigger: ["blur", "input"], message: "请输入角色名称", min:2, max: 9 },
  parentId: { required: true, type: "string", trigger: ["blur", "change"], message: "请选择父级" },

};
