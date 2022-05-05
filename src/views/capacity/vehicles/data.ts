
export const rules = {
  plateNumber: { required: true, trigger: ["blur", "input"], message: "请输入车牌号" },
  vehicleBrand: { required: true, trigger: ["blur", "input"], message: "请输入车辆品牌" },
  plateColor: { required: true, trigger: ["blur", "input"], message: "请输入车牌颜色" },
  vehicleDrivingPermitType: { required: true, trigger: ["blur", "input"], message: "请输入行驶证类型" },
  vehicleEngineDisplace: { required: true, trigger: ["blur", "input"], message: "请输入发动机排量" },
  vehicleFuelType: { required: true, trigger: ["blur", "change"], message: "请输入燃料类型" },
  vehicleModel: { required: true, trigger: ["blur", "change"], message: "请输入车辆型号" },
  vehicleSeats: { required: true, trigger: ["blur", "change"], message: "请输入座位" },
  vehicleState: { required: true, trigger: ["blur", "change"], message: "请选择车辆状态" },
  vehicleVin: { required: true, trigger: ["blur", "change"], message: "请输入车辆VIN码" },
  vehilceEngineId: { required: true, trigger: ["blur", "change"], message: "请输入发动机编号" },
  vehicleTypeId: { required: true, trigger: ["blur", "change"], message: "请选择车辆类型" },
  vehicleCertifyDate: { required: true, trigger: ["blur", "change"], message: "请选择车辆注册日期" },
  vehicleSeries: { required: true, trigger: ["blur", "change"], message: "请输入车系" },
};

export const trcRules = {
    vehicleTransportLicenseNo: { required: true, trigger: ["blur", "input"], message: "请输入运输证字号" },
  vehicleTransportLicenseIssueOrganization: { required: true, trigger: ["blur", "input"], message: "请输入运输证发证机关" },
  vehicleTransportLicenseEffectiveBegin: { required: true,type: "number", trigger: ["blur", "input"], message: "请选择运输证有效期开始时间" },
  vehicleTransportLicenseEffectiveEnd: { required: true,type: "number", trigger: ["blur", "input"], message: "请选择运输证有效期结束时间" },
  vehicleTransportLicenseOperationScope: { required: true, trigger: ["blur", "input"], message: "请输入运输证经营范围 " },
  vehiclePhotoId: { required: true,  trigger: ["blur", "change"], message: "请上传车辆照片" },
  vehicleTransportLicenseId: { required: true,  trigger: ["blur", "change"], message: "请上传运输证照片" },

}