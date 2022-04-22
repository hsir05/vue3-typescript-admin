

export const rules = {
  vehicleTypeDesc: { required: true, trigger: ["blur", "input"], message: "请输入车辆类型描述" },
  vehicleTypeLock: { required: true, trigger: ["blur", "input"], message: "请选择是否锁定" },
  vehicleTypeImageId: { required: true, trigger: ["blur", "input"], message: "请上传车辆类型图片" },
  vehicleTypeBusyIconId: { required: true, trigger: ["blur", "input"], message: "请上传车辆忙碌类型图片" },
  vehicleTypeFreeIconId: { required: true, trigger: ["blur", "input"], message: "请上传车辆空闲类型图片" },
}