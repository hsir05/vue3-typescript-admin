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
  driverLock: string | null;
  createTime?: number | null
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
