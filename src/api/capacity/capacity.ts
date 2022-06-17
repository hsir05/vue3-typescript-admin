import { http } from "@/utils/http";
import { PaginationInter } from "../type";

//-----------------运营企业管理-------------------------

/**
 * 运营企业分页
 */
interface CompanyPageInter {
  page: PaginationInter;
  search: {
    nameLike: string | null;
    operationCompanyCodeLike: string | null;
  };
}
export function getCompanyPage(data: CompanyPageInter) {
  return http.request({
    url: "/operationCompany/page",
    method: "post",
    data: data,
  });
}
/**
 * 新增运营企业及管理员
 */
interface addCompanyInter {
  operationCompanyId?: string | null;
  operationCompanyCode: string | null;
  operationCompanyName: string | null;
  operationCityCode: string | null;
  unifiedSocialCreditCode: string | null;
  operationCompanyAddress: string | null;
  operationCityName: string | null;
  operationCompanyManagerName: string | null;
  operationCompanyManagerGender: number | null;
  lng: number | null;
  lat: number | null;
  operationCompanyManagerPhone: string | null;
}
export function addCompany(data: addCompanyInter) {
  return http.request({
    url: "/operationCompany/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑运营企业及管理员
 */
export function editCompany(data: addCompanyInter) {
  return http.request({
    url: "/operationCompany/edit",
    method: "post",
    data: data,
  });
}

/**
 * 校验运营企业名称唯一
 */
export function uniqueCompanyName(data: { operationCompanyName: string }) {
  return http.request({
    url: "/operationCompany/uniqueOperationCompanyName",
    method: "post",
    data: data,
  });
}
/**
 * 校验运营企业是否有代理商
 */
export function validateIfExistAgency(data: { operationCompanyId: string }) {
  return http.request({
    url: "/operationCompany/validateIfExistAgency",
    method: "post",
    data: data,
  });
}
/**
 * 校验运营企业是否有代理商
 */
export function updateAgentStatus(data: { operationCompanyId: string }) {
  return http.request({
    url: "/operationCompany/modifyAllowAgencyStatus",
    method: "post",
    data: data,
  });
}
//----------------------代理商管理-----------------------
/**
 * 代理商分页
 */
interface AgencyPageInter {
  page: PaginationInter;
  search: {
    operationCompanyAgencyNameLike: string | null;
  };
}
export function getAgencyPage(data: AgencyPageInter) {
  return http.request({
    url: "/operationCompanyAgency/page",
    method: "post",
    data: data,
  });
}
/**
 * 新增代理商
 */

interface AgencyFormInter {
  operationCompanyAgencyId?: string | null;
  operationCompanyAgencyName: string | null;
  loginCredential: string | null;
  operationCompanyAgencyContactName: string | null;
  operationCompanyAgencyContactGender: number | null;
  operationCompanyAgencyContactPhone: string | null;
  operationCompanyIds: null | string[];
}
export function addAgency(data: AgencyFormInter) {
  return http.request({
    url: "/operationCompanyAgency/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑代理商
 */
export function editAgency(data: AgencyFormInter) {
  return http.request({
    url: "/operationCompanyAgency/edit",
    method: "post",
    data: data,
  });
}

/**
 * 修改代理商状态
 */
export function updateAgencyStatus(data: { operationCompanyAgencyId: string }) {
  return http.request({
    url: "/operationCompanyAgency/modifyAgencyStatus",
    method: "post",
    data: data,
  });
}
/**
 * 代理商名称去重
 */
export function uniqueAgencyName(data: { operationCompanyAgencyName: string }) {
  return http.request({
    url: "/operationCompanyAgency/uniqueOperationCompanyAgencyName",
    method: "post",
    data: data,
  });
}
/**
 * 校验代理商登录账号是否重复
 */
export function uniqueAgencyLogin(data: { operationCompanyAgencyName: string }) {
  return http.request({
    url: "/operationCompanyAgency/uniqueOperationCompanyAgencyName",
    method: "post",
    data: data,
  });
}
/**
 * 查询可以代理的企业列表
 */

export function getAllowAgencyCompany() {
  return http.request({
    url: "/operationCompany/findAllowAgencyOperationCompanyList",
    method: "post",
  });
}
/**
 * 校验代理商登录账号是否重复
 */
interface RatioInter {
  operationCompanyAgencyId: string;
  operationCompanyId: string;
}
export function getRatio(data: RatioInter) {
  return http.request({
    url: "/operationCompanyAgency/getNumberByOperationCompanyId",
    method: "post",
    data: data,
  });
}

//----------------------企业承接业务设置-----------------------
/**
 * 通过开通区域查找该区域下的企业承接业务列表
 */

export function getUndertakeBus(data: { areaCode: string }) {
  return http.request({
    url: "/operationCompanyUndertakeBusiness/getUndertakeBusinessListByAreaCode",
    method: "post",
    data: data,
  });
}

/**
 * 按照开通区域和企业查找该区域下的企业承接业务列表
 */

export function getAreaUndertakeBus(data: { areaCode: string; operationCompanyId: string }) {
  return http.request({
    url: "/operationCompanyUndertakeBusiness/getUndertakeBusinessListByAreaCodeAndCompany",
    method: "post",
    data: data,
  });
}

/**
 * 保存企业承接业务
 */
interface CompanyUndertakeBusinessInter {
  orderType: string;
  orderBusinessType: string;
}
interface undertakeState {
  areaCode: string | null;
  operationCompanyId: string | null;
  companyUndertakeBusinessList: CompanyUndertakeBusinessInter[];
}
export function saveUndertakeBus(data: undertakeState) {
  return http.request({
    url: "/operationCompanyUndertakeBusiness/save",
    method: "post",
    data: data,
  });
}
//----------------------订单抽成比率-----------------------
/**
 * 按照企业id和流量code查找订单抽成比率
 */
interface RatePageInter {
  operationCompanyId: string | null;
  areaCode: string | null;
}
export function getRatePage(data: RatePageInter) {
  return http.request({
    url: "/orderIncomeDivideRate/findByCompanyIdAndAreaCode",
    method: "post",
    data: data,
  });
}
/**
 * 批量修改订单抽成比率
 */
interface OperationCompanyInter {
  orderIncomeDivideRateId: string | null;
  areaCode: string | null;
  orderBusinessType: string | null;
  orderType: string | null;
  influxCode: string | null;
  influxDivideRate: number | null;
  companyDivideRate: number | null;
  platformDivideRate: number | null;
  agencyDivideRate: number | null;
  driverDivideRate: number | null;
}
interface UpdateRate {
  operationCompanyId: string;
  orderIncomeDivideRatePDTOList: OperationCompanyInter[];
}
export function updateRate(data: UpdateRate) {
  return http.request({
    url: "/orderIncomeDivideRate/modifyDivideRate",
    method: "post",
    data: data,
  });
}

//----------------------车辆管理-----------------------
/**
 * 车辆分页
 */
interface VehiclePageInter {
  page: PaginationInter;
  search: {
    operationCompanyIdEq: string | null;
    plateNumberLike: string | null;
    vehicleTypeIdEq: string | null;
    vehicleStateEq: string | null;
  };
}
export function getVehiclePage(data: VehiclePageInter) {
  return http.request({
    url: "/vehicle/page",
    method: "post",
    data: data,
  });
}
/**
 * 里程清零
 */
export function initMileage(data: { operationCompanyVehicleId: string }) {
  return http.request({
    url: "/vehicle/initMileage",
    method: "post",
    data: data,
  });
}
/**
 * 车辆编辑
 */

interface VehicleEditInter {
  operationCompanyVehicleId: string | null;
  plateColor: string | null;
  plateNumber: string | null;
  vehicleBrand: string | null;
  vehicleCertifyDate: string | null;
  vehicleColor: string | null;
  vehicleDrivingPermitType: string | null;
  vehicleEngineDisplace: string | null;
  vehicleFuelType: string | null;
  vehicleModel: string | null;
  vehicleNote: string | null;
  vehicleSeats: number | null;
  vehicleSeries: string | null;
  vehicleState: number | null;
  vehicleTypeId: string | null;
  vehicleVin: string | null;
  vehilceEngineId: string | null;
}
export function vehicleEdit(data: VehicleEditInter) {
  return http.request({
    url: "/vehicle/edit",
    method: "post",
    data: data,
  });
}

/**
 * 车辆运输证信息保存
 */
interface TranLicenseInter {}
export function transportLicenseEdit(data: TranLicenseInter) {
  return http.request({
    url: "/vehicle/updateVehicleTransportLicense",
    method: "post",
    data: data,
  });
}
/**
 * 车辆转移所在企业
 */
interface TransferInter {
  operationCompanyVehicleId: string;
  vehicleTransferCompanyId: string;
}
export function transfer(data: TransferInter) {
  return http.request({
    url: "/vehicle/vehicleTransfer",
    method: "post",
    data: data,
  });
}

//----------------------司机管理-----------------------

/**
 * 司机分页
 */
interface DriverPageInter {
  page: PaginationInter;
  search: {
    driverNoLike: string | null;
    operationCompanyIdEq: string | null;
    driverFullNameLike: string | null;
    driverStateEq: string | null;
    driverLockEq: string | null;
  };
}
export function getDriverPage(data: DriverPageInter) {
  return http.request({
    url: "/operationCompanyDriver/page",
    method: "post",
    data: data,
  });
}
/**
 * 重置司机密码
 */
export function initPassword(data: { driverId: string }) {
  return http.request({
    url: "/operationCompanyDriver/initPassword",
    method: "post",
    data: data,
  });
}
/**
 * 保存家庭住址
 */
interface DriverAddress {
    driverId: string
    driverHomeAddress: string
    driverHomeAddressDetail: string
    lng: number
    lat: number
}
export function saveDriverAddress(data: DriverAddress) {
  return http.request({
    url: "/operationCompanyDriver/saveHomeAddress",
    method: "post",
    data: data,
  });
}
/**
 * 司机信息编辑
 */
interface DriverInter {
  driverId: string | null;
  driverLastName: string | null;
  driverFirstName: string | null;
  driverGender: number | null;
  driverPhone: string | null;
  driverNation: string | null;
  driverEducation: string | null;
  driverMaritalStatus: string | null;
  driverBirth: number | null;
  driverRegisteredResidence: string | null;
  driverEmergencyContactName: string | null;
  driverEmergencyContactPhone: string | null;
  driverLock: number | null;
}
export function editDriver(data: DriverInter) {
  return http.request({
    url: "/operationCompanyDriver/save",
    method: "post",
    data: data,
  });
}

/**
 * 司机信息详情
 */
export function getDriverDetail(data: { driverId: string }) {
  return http.request({
    url: "/operationCompanyDriver/detail",
    method: "post",
    data: data,
  });
}

/**
 * 更新司机证件头像----免冠
 */
export function updateDriverPhoto(data: { driverId: string; fileId: string }) {
  return http.request({
    url: "/operationCompanyDriver/uploadDriverIdentificationPhoto",
    method: "post",
    data: data,
  });
}
/**
 * 更新司机人脸采集图像
 */
export function updateDriverFacePhoto(data: { driverId: string; fileId: string }) {
  return http.request({
    url: "/operationCompanyDriver/updateDriverBaiduFaceRecognPhoto",
    method: "post",
    data: data,
  });
}

/**
 * 更新司机身份证照片信息
 */
interface FiledInter {
  fileId: string;
} 
interface IdentityInter {
  driverId: string | null;
  driverIdentityCardNo: string | null;
  driverIdentityCardIssueOrganization: string | null;
  driverIdentityCardEffectiveDateBegin: string | null;
  driverIdentityCardEffectiveDateEnd: string | null;
  driverIdentityFaceSide: FiledInter;
  driverIdentityOtherSide: FiledInter;
}
export function updateDriverIdentity(data: IdentityInter) {
  return http.request({
    url: "/operationCompanyDriver/updateDriverIdentity",
    method: "post",
    data: data,
  });
}
/**
 * 更新司机驾驶证照片信息
 */

interface LicenseInter {
  driverId: string;
  driverLicenseNo: string;
  driverLicenseArchivesNo: string;
  driverPermitVehicleModel: string;
  driverLicenseGetDate: string;
  driverLicenseEffectiveDateBegin: string;
  driverLicenseEffectiveDateEnd: string;
  driverLicenseFaceSide: FiledInter;
  driverLicenseOtherSide: FiledInter;
}
export function updateDriverLicense(data: LicenseInter) {
  return http.request({
    url: "/operationCompanyDriver/updateDriverLicense",
    method: "post",
    data: data,
  });
}

/**
 * 更新司机网约车资格证
 */
interface CertificateInter {
  driverId: string;
  driverNetworkVehicleCertificateNo: string;
  driverNetworkVehicleCertificateIssueOrganization: string;
  driverNetworkVehicleCertificateGetDate: string;
  driverNetworkVehicleCertificateEffectiveDateBegin: string;
  driverNetworkVehicleCertificateEffectiveDateEnd: string;
  driverNetworkVehicleCertificateFaceSide: FiledInter;
  driverNetworkVehicleCertificateOtherSide: FiledInter;
}
export function updateCertificate(data: CertificateInter) {
  return http.request({
    url: "/operationCompanyDriver/updateDriverNetworkVehicleCertificate",
    method: "post",
    data: data,
  });
}
//----------------------车辆分配管理-----------------------
/**
 * 车辆分配分页
 */
interface VehicleBindingInter {
  page: PaginationInter;
  search: {
    plateNumberLike: string | null;
    operationCompanyIdEq: string | null;
    driverFullNameLike: string | null;
    driverNoLike: string | null;
  };
}
export function getVehicleBindingPage(data: VehicleBindingInter) {
  return http.request({
    url: "/operationCompanyVehicleBinding/page",
    method: "post",
    data: data,
  });
}
/**
 * 根据输入的司机工号前4位加企业id查询匹配司机
 */
export function findNoDriver(data: { driverNoHeader: string; operationCompanyId: string }) {
  return http.request({
    url: "/operationCompanyDriver/findByDriverNoHeader",
    method: "post",
    data: data,
  });
}
/**
 * 查找简单的司机信息
 */
export function getDriverSimple(data: { driverId: string }) {
  return http.request({
    url: "/operationCompanyDriver/simpleJsonDetail",
    method: "post",
    data: data,
  });
}
/**
 * 根据车辆id查找该车辆当前绑定的司机列表
 */
export function bindDriverList(data: { operationCompanyVehicleId: string }) {
  return http.request({
    url: "/operationCompanyVehicleBinding/bindDriverList",
    method: "post",
    data: data,
  });
}
/**
 * 车辆和司机绑定
 */

export function bindDriver(data: {
  operationCompanyVehicleId: string;
  operationCompanyDriverId: string;
}) {
  return http.request({
    url: "/operationCompanyVehicleBinding/bindDriver",
    method: "post",
    data: data,
  });
}
/**
 * 司机与车辆解绑
 */

export function unbindDriver(data: {
  operationCompanyVehicleId: string;
  operationCompanyDriverId: string;
}) {
  return http.request({
    url: "/operationCompanyVehicleBinding/unbindDriver",
    method: "post",
    data: data,
  });
}
//----------------------班级管理管理-----------------------

/**
 * 班级管理分页
 */
interface DriverClazzPageInter {
  page: PaginationInter;
  search: {
    operationCompanyDriverClazzEntryLike: string | null;
    operationCompanyIdEq: string | null;
    operationCompanyDriverClazzNameLike: string | null;
  };
}
export function getDriverClazzPage(data: DriverClazzPageInter) {
  return http.request({
    url: "/operationCompanyDriverClazz/page",
    method: "post",
    data: data,
  });
}
/**
 * 班级详情
 */
export function getTeamDetail(data: { operationCompanyDriverClazzId: string }) {
  return http.request({
    url: "/operationCompanyDriverClazz/detail",
    method: "post",
    data: data,
  });
}
/**
 * 班级管理分页
 */
export function getMemberList(data: { operationCompanyDriverClazzId: string }) {
  return http.request({
    url: "/operationCompanyDriverClazz/memberList",
    method: "post",
    data: data,
  });
}
//----------------------企业紧急联系人管理-----------------------
/**
 * 企业紧急联系人分页
 */
interface emeContactSate {
  page: PaginationInter;
  search: {
    operationCompanyIdEq: string | null;
    operationCompanyEmergencyContactNameLike: string | null;
    operationCompanyEmergencyContactPhoneLike: string | null;
  };
}
export function getEmeConactPage(data: emeContactSate) {
  return http.request({
    url: "/operationCompanyEmergencyContact/page",
    method: "post",
    data: data,
  });
}
/**
 * 编辑紧急联系人
 */
interface editorState {
  operationCompanyEmergencyContactId?: string | null;
  operationCompanyId: string | null;
  // oldOperationCompanyEmergencyContactPhone: string | null
  // oldOperationCompanyEmergencyContactEmail: string | null
  operationCompanyEmergencyContactName: string | null;
  operationCompanyEmergencyContactPhone: string | null;
  operationCompanyEmergencyContactEmail: string | null;
  createTime?: string | null;
  dutyTimeBegin: string | null;
  dutyTimeEnd: string | null;
}
export function editEmeContact(data: editorState) {
  return http.request({
    url: "/operationCompanyEmergencyContact/edit",
    method: "post",
    data: data,
  });
}

/**
 * 新增紧急联系人
 */
export function getConactDetail(data: {operationCompanyEmergencyContactId: string}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/detail",
    method: "post",
    data: data,
  });
}
/**
 * 新增紧急联系人
 */
export function addEmeContact(data: editorState) {
  return http.request({
    url: "/operationCompanyEmergencyContact/add",
    method: "post",
    data: data,
  });
}
/**
 * 删除
 */
export function removeEmeContact(data: { operationCompanyEmergencyContactId: string }) {
  return http.request({
    url: "/operationCompanyEmergencyContact/delete",
    method: "post",
    data: data,
  });
}

/**
 * 校验同一企业下紧急联系人手机号不能重复
 */
export function uniqueContactPhone(data: {
  operationCompanyId: string | null;
  operationCompanyEmergencyContactPhone: string | null;
}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/uniqueOperationCompanyEmergencyContactPhone",
    method: "post",
    data: data,
  });
}

/**
 * 校验同一企业下紧急联系人邮箱不能重复
 */
export function uniqueContactEmail(data: {
  operationCompanyId: string | null;
  operationCompanyEmergencyContactEmail: string | null;
}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/uniqueOperationCompanyEmergencyContactEmail",
    method: "post",
    data: data,
  });
}

/**
 * 按照运营企业主键和紧急联系人主键获取值班时间范围
 */
export function getTimeRange(data: {
  operationCompanyId: string | null;
  operationCompanyEmergencyContactId: string | null;
}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/findDutyTimeStrByOprCompanyIdAndContactId",
    method: "post",
    data: data,
  });
}

//-----------------企业值班调度人-------------------------
/**
 * 企业值班调度人分页
 */
interface expendPageState {
  page: PaginationInter;
  search: {
    operationCompanyIdEq: string | null;
    operationCompanyExpendContactNameLike: string | null;
    operationCompanyExpendContactPhoneLike: string | null;
  };
}
export function getExpendPage(data: expendPageState) {
  return http.request({
    url: "/operationCompanyExpendContact/page",
    method: "post",
    data: data,
  });
}

/**
 * 新增企业值班调度人
 */
interface expendContactState {
  operationCompanyExpendContactId?: string | null;
  operationCompanyId: string | null;
  operationCompanyExpendContactName: string | null;
  operationCompanyExpendContactPhone: string | null;
  operationCompanyExpendContactEmail: string | null;
  dutyTimeBegin: string | number | null;
  dutyTimeEnd: string | number | null;
}
export function addExpendContact(data: expendContactState) {
  return http.request({
    url: "/operationCompanyExpendContact/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑企业值班调度人
 */
export function editExpendContact(data: expendContactState) {
  return http.request({
    url: "/operationCompanyExpendContact/edit",
    method: "post",
    data: data,
  });
}

/**
 * 编辑企业值班调度人
 */
export function getCompanyRangeTime(data: {
  operationCompanyId: string;
  operationCompanyExpendContactId: string | null;
}) {
  return http.request({
    url: "/operationCompanyExpendContact/findDutyTimeStrByOprCompanyIdAndContactId",
    method: "post",
    data: data,
  });
}
/**
 * 删除开通城市
 */
export function removeExpendContact(data: { operationCompanyExpendContactId: string }) {
  return http.request({
    url: "/operationCompanyExpendContact/delete",
    method: "post",
    data: data,
  });
}
//----------------------司机注册审核管理-----------------------
/**
 * 司机注册分页
 * 申请状态 DRS0004 = 平台未审核
 * DRS0005 = 平台审核未通过
 * DRS0006 = 平台审核通过
 */
interface DriverRegisterInter {
  page: PaginationInter;
  search: {
    registerStateEq: string | null;
    driverFullNameLike: string | null;
    driverPhoneLike: string | null;
    operationCompanyIdEq: string | null;
    plateNumberLike: string | null;
    driverRegTimeGe: string | null;
    driverRegTimeLe: string | null;
    companyCheckTimeGe: string | null;
    companyCheckTimeLe: string | null;
    platformCheckTimeGe: string | null;
    platformCheckTimeLe: string | null;
  };
}
export function getDriverRegisterPage(data: DriverRegisterInter) {
  return http.request({
    url: "/driverRegister/page",
    method: "post",
    data: data,
  });
}
//----------------------司机会员产品管理-----------------------
/**
 *有司机会员产品的企业分页
 */
interface DriverMemberPageInter {
  page: PaginationInter;
  search: {
    operationCompanyIdEq: string | null;
  };
}
export function getDriverMemberPage(data: DriverMemberPageInter) {
  return http.request({
    url: "/driverMemberGoods/openedCompanyPage",
    method: "post",
    data: data,
  });
}
/**
 *企业下会员产品列表
 */
interface DriverMemberGoodsPageInter {
  page: PaginationInter;
  search: {
    operationCompanyIdEq: string | null;
    goodsNameLike: string | null;
  };
}
export function getDriverMemberGoodsPage(data: DriverMemberGoodsPageInter) {
  return http.request({
    url: "/driverMemberGoods/driverMemberGoodsPage",
    method: "post",
    data: data,
  });
}
/**
 *关闭开通司机会员的企业
 */
export function closeMember(data: { operationCompanyOpenedDriverMemberId: string }) {
  return http.request({
    url: "/driverMemberGoods/deleteOpenedCompany",
    method: "post",
    data: data,
  });
}
/**
 *获取司机会员产品详情
 */
export function getDriverMemberDetail(data: { driverMemberGoodsId: string }) {
  return http.request({
    url: "/driverMemberGoods/detail",
    method: "post",
    data: data,
  });
}
/**
 *更新派单限制开始时间
 */
interface OrderLimitTimeInter{
    operationCompanyOpenedDriverMemberId: string
    dispatchOrderLimitBeginTime: string
}
export function updateOrderLimitTime(data: OrderLimitTimeInter) {
  return http.request({
    url: "/driverMemberGoods/updateDispatchOrderLimitBeginTime",
    method: "post",
    data: data,
  });
}

/**
 * 新增司机会员产品
 */
interface DriverMemberGoodsInter {
  driverMemberGoodsId?: string | null;
  goodsName: string | null;
  companyIds: string[] | null;
  goodsTagPrice: number | null;
  goodsSellingPrice: number | null;
  goodsType: string | null;
  memberEndTime: string | null;
  memberRenewalTimeUnit: number | null;
  memberRenewalCount: number | null;
  purchasableDaysBeforeMemberExpire: number | null;
  effectBeginTime: string | null;
  effectEndTime: string | null;
  goodsRemark: string | null;
  createUser: string | null;
}
export function addDriverMemberGoods(data: DriverMemberGoodsInter) {
  return http.request({
    url: "/driverMemberGoods/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑司机会员产品
 */
export function editDriverMemberGoods(data: DriverMemberGoodsInter) {
  return http.request({
    url: "/driverMemberGoods/edit",
    method: "post",
    data: data,
  });
}
export function getUnOpenCompany() {
  return http.request({
    url: "/operationCompany/findCompaniesHaveNotOperationCompanyOpenedDriverMember",
    method: "post",
  });
}
/**
 * 编辑司机会员产品
 */
interface AddOpenCompanyInter{
    companyIds: string[]
    dispatchOrderLimitBeginTime: string
}
export function addOpenedCompany(data: AddOpenCompanyInter) {
  return http.request({
    url: "/driverMemberGoods/addOpenedCompany",
    method: "post",
    data: data,
  });
}
