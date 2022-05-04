export interface tableDataItem {
  driverId?: string | null;
  number: string | null;
  firstName?: null;
  secondName?: null;
  name?: string | null;
  sex: number | null;
  phone: string | null;
  nation: string | null;
  education: string | null;
  companyName: string | null;
  driverLock: number | null;
  driverState: string | null;
  createTime?: string | null;
  address?: string | null;
  contacts?: string | null;
  maritalStatus?: string | null;
  birthDay?: null | string
}

export interface addressState {
    address: null;
    lat: number | null;
    lng: number | null;
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