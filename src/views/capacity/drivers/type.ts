export interface tableDataItem {
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
  createTime?: number | null;
}

export interface DriverAddressInter{
    driverId: string | null
    driverHomeAddress: string | null
    driverHomeAddressDetail: string | null
    lng: number | null
    lat: number | null
}

export interface CertificatesState {
  bareheadedPhoto: string | null;
  takePhotos: string | null;
  frontPhoto: string | null;
  reversePhoto: string | null;
  frontPage: string | null;
  reversePage: string | null;
  frontCer: string | null;
  reverseCer: string | null;
}

// interface FiledInter {
//   field: string;
// }
export interface FileInter {
  fileId: string;
  filePath: string;
}
export interface FormInter {
  driverId: string | null;
  driverIdentityCardNo: string | null;
  driverIdentityCardIssueOrganization: string | null;
  driverIdentityCardEffectiveDateBegin: string | null;
  driverIdentityCardEffectiveDateEnd: string | null;
  driverIdentityFaceSide: string | null;
  driverIdentityOtherSide: string | null;
}
export interface CertificateInter {
  driverId: string;
  driverNetworkVehicleCertificateNo: string;
  driverNetworkVehicleCertificateIssueOrganization: string;
  driverNetworkVehicleCertificateGetDate: string;
  driverNetworkVehicleCertificateEffectiveDateBegin: string;
  driverNetworkVehicleCertificateEffectiveDateEnd: string;
  driverNetworkVehicleCertificateFaceSide: string;
  driverNetworkVehicleCertificateOtherSide: string;
}

interface IdentDataInter {
  driverId: string;
  driverIdentityCardNo: string;
  driverIdentityCardIssueOrganization: string;
  driverIdentityCardEffectiveDateBegin: number;
  driverIdentityCardEffectiveDateEnd: number;
}
export interface IdentFormInter extends IdentDataInter {
  driverIdentityFaceSide: string;
  driverIdentityOtherSide: string;
}

export interface IdentRecordInter extends IdentDataInter {
  driverIdentityFaceSide: FileInter;
  driverIdentityOtherSide: FileInter;
}
// 驾驶证件
interface LienceDataInter {
  driverId: string;
  driverLicenseNo: string;
  driverLicenseArchivesNo: string;
  driverPermitVehicleModel: string;
  driverLicenseGetDate: number;
  driverLicenseEffectiveDateBegin: number;
  driverLicenseEffectiveDateEnd: number;
}
export interface LienceFormInter extends LienceDataInter {
  driverLicenseFaceSide: string;
  driverLicenseOtherSide: string;
}

export interface LienceRecordInter extends LienceDataInter {
  driverLicenseFaceSide: FileInter;
  driverLicenseOtherSide: FileInter;
}
//----

interface CertDataInter {
  driverId: string;
  driverNetworkVehicleCertificateNo: string;
  driverNetworkVehicleCertificateIssueOrganization: string;
  driverNetworkVehicleCertificateGetDate: number;
  driverNetworkVehicleCertificateEffectiveDateBegin: number;
  driverNetworkVehicleCertificateEffectiveDateEnd: number;
}
export interface CertInter extends CertDataInter {
  driverNetworkVehicleCertificateFaceSide: string;
  driverNetworkVehicleCertificateOtherSide: string;
}

export interface CertRecordInter extends CertDataInter {
  driverNetworkVehicleCertificateFaceSide: FileInter;
  driverNetworkVehicleCertificateOtherSide: FileInter;
}
