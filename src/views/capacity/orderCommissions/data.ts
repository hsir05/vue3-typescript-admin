export const rules = {
  influxDivideRate: { type:'number', required: true, trigger: ["blur", "input"], message: "请输入流量方比率" },
  platformDivideRate: { type:'number', required: true, trigger: ["blur", "input"], message: "请输入平台比率" },
  agencyDivideRate: { type:'number', required: true, trigger: ["blur", "input"], message: "请输入代理商比率" },
  companyDivideRate: { type:'number', required: true, trigger: ["blur", "input"], message: "请输入企业比率" },
  driverDivideRate: { type:'number', required: true, trigger: ["blur", "input"], message: "请输入司机比率" },
};
