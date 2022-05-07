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

export interface certificatesState {
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

  //   driverIdentityFaceSide: FiledInter;
  //   driverIdentityOtherSide: FiledInter;
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

interface DataInter {
  driverId: string;
  driverIdentityCardNo: string;
  driverIdentityCardIssueOrganization: string;
  driverIdentityCardEffectiveDateBegin: number;
  driverIdentityCardEffectiveDateEnd: number;
}
export interface IdentFormInter extends DataInter {
  driverIdentityFaceSide: string;
  driverIdentityOtherSide: string;
}

export interface RecordInter extends DataInter {
  driverIdentityFaceSide: FileInter;
  driverIdentityOtherSide: FileInter;
}
