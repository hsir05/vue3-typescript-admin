// import { FormItemRule } from "naive-ui";

export const data = [
  {
    id: 131123,
    number: "",
    name: "丰田",
    sex: 1,
    phone: '18098765678',
    nation: "汉",
    education: '本科',
    companyName: '兰州益民',
    lock: 1,
    status: '上班',
    create_time: '2011-12-04',
  },
]; 
//车辆品牌	车系	车辆型号	核定载客位	运营企业	车辆类型	当前里程	是否锁定
export const rules = {
  firstName: { required: true, trigger: ["blur", "input"], message: "请输入司机姓" },
  secondName: { required: true, trigger: ["blur", "input"], message: "请输入司机的名" },
  sex: { required: true, trigger: ["blur", "input"], message: "请选择司机性别" },
  phone: { required: true, trigger: ["blur", "input"], message: "请输入司机电话号码" },
  nation: { required: true, trigger: ["blur", "input"], message: "请选择司机民族" },
  education: { required: true, trigger: ["blur", "input"], message: "选择司机学历" },
  address: { required: true, type: "number", trigger: ["blur", "change"], message: "请输入司机家庭地址" },
  contacts: { required: true, type: "number", trigger: ["blur", "change"], message: "请输入联系人电话" },
};
