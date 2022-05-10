
export const rules = {
  driverLastName: { required: true, trigger: ["blur", "input"], message: "请输入司机姓" },
  driverFirstName: { required: true, trigger: ["blur", "input"], message: "请输入司机的名" },
  driverGender: { required: true,type:"number", trigger: ["blur", "change"], message: "请选择司机性别" },
  driverPhone: { required: true, trigger: ["blur", "input"], message: "请输入司机电话号码" },
  driverNation: { required: true, trigger: ["blur", "change"], message: "请选择司机民族" },
  driverEducation: { required: true, trigger: ["blur", "change"], message: "选择司机学历" },
  driverMaritalStatus: { required: true, trigger: ["blur", "input"], message: "请输入司机婚姻状况" },
  driverRegisteredResidence: { required: true, trigger: ["blur", "input"], message: "请输入司机家庭地址" },
  driverBirth: { required: true, type: "number", trigger: ["blur", "change"], message: "请选择司机生日" },
  driverEmergencyContactName: { required: true, trigger: ["blur", "input"], message: "请输入联系人姓名" },
  driverEmergencyContactPhone: { required: true, trigger: ["blur", "input"], message: "请输入联系人电话" },
};

export const addressRules = {
    driverHomeAddress: {required: true,trigger: ["blur", "input"],message: "请输入司机家庭地址"},
    driverHomeAddressDetail: { required: true, trigger: ["blur", "input"], message: "请输入司机详细家庭地址",}
}


export const identityRules = {
    driverIdentityCardNo:{ required: true, trigger: ["blur", "input"], message: "请输入正确格式的身份证号码" },
    driverIdentityCardIssueOrganization:{ required: true, trigger: ["blur", "input"], message: "请输入身份证签发机关" },
    driverIdentityCardEffectiveDateBegin:{ type:"number", required: true, trigger: ["blur", "change"], message: "请选择身份证有效期开始时间" },
    driverIdentityCardEffectiveDateEnd:{ type:"number", required: true, trigger: ["blur", "change"], message: "请选择身份证有效期结束时间" },
    driverIdentityFaceSide:{ required: true, trigger: ["blur", "change"], message: "请上传身份证头像面" },
    driverIdentityOtherSide:{ required: true, trigger: ["blur", "change"], message: "请上传身份证国徽面" },
}

export const licenseRules = {
    driverLicenseNo:{ required: true, trigger: ["blur", "input"], message: "请输入正确格式的驾驶证号" },
    driverLicenseArchivesNo:{ required: true, trigger: ["blur", "input"], message: "请输入驾驶证档案编号" },
    driverPermitVehicleModel:{ required: true, trigger: ["blur", "change"], message: "请选择准驾车型" },
    driverLicenseGetDate:{ type:"number", required: true, trigger: ["blur", "change"], message: "请选择驾驶证初领日期" },
    driverLicenseEffectiveDateBegin:{ type:"number",required: true, trigger: ["blur", "change"], message: "请选择驾驶证有效期始" },
    driverLicenseEffectiveDateEnd:{ type:"number",required: true, trigger: ["blur", "change"], message: "请选择驾驶证有效期止" },
    driverLicenseFaceSide:{ required: true, trigger: ["blur", "input"], message: "请上传驾驶证正页" },
    driverLicenseOtherSide:{ required: true, trigger: ["blur", "input"], message: "请上传驾驶证副页" },
}

export const certRules = {
    driverNetworkVehicleCertificateNo:{ required: true, trigger: ["blur", "input"], message: "请输入正确格式的网约车资格证号 " },
    driverNetworkVehicleCertificateIssueOrganization:{ required: true, trigger: ["blur", "input"], message: "请输入身份证签发机关" },
    driverNetworkVehicleCertificateGetDate:{ type:"number",required: true, trigger: ["blur", "change"], message: "请选择网约车资格证初领日期 " },
    driverNetworkVehicleCertificateEffectiveDateBegin:{ type:"number", required: true, trigger: ["blur", "change"], message: "请选择网约车资格证有效期始" },
    driverNetworkVehicleCertificateEffectiveDateEnd:{ type:"number",required: true, trigger: ["blur", "change"], message: "请选择网约车资格证有效期止" },
    driverNetworkVehicleCertificateFaceSide:{ required: true, trigger: ["blur", "input"], message: "请上传驾驶证正页" },
    driverNetworkVehicleCertificateOtherSide:{ required: true, trigger: ["blur", "input"], message: "请上传驾驶证副页" },
}