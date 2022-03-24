// import { FormItemRule } from "naive-ui";

export const data = [
  {
    id: 131123,
    plageNumber: "京A00002",
    brand: "丰田",
    carSeies: "雷凌",
    color: '黑色',
    carType: "专车-舒适型",
    companyName: '兰州益民',
    vehiclesType: '雷凌',
    lock: 1,
    distance: '1公里',
    plate: '4',
    create_time: '2011-12-04',
  },
]; 
//车辆品牌	车系	车辆型号	核定载客位	运营企业	车辆类型	当前里程	是否锁定
export const rules = {
  plageNumber: { required: true, trigger: ["blur", "input"], message: "请输入车牌号" },
  brand: { required: true, trigger: ["blur", "input"], message: "请输入车辆品牌" },
  adminName: { required: true, trigger: ["blur", "input"], message: "请输入管理名称" },
  socityCode: { required: true, trigger: ["blur", "input"], message: "请输入社会统一信用代码" },
  companyCode: { required: true, trigger: ["blur", "input"], message: "请输入运营企业编号" },
  cityCode: { required: true, trigger: ["blur", "input"], message: "选择运营城市" },
  carType: { required: true, type: "number", trigger: ["blur", "change"], message: "请选择车辆类型" },
};
