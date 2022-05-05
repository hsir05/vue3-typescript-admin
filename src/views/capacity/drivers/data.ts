
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
