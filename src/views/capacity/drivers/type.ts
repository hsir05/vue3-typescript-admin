export interface tableDataItem {
  id?: string | null;
  number: null | string;
  firstName?: null;
  secondName?: null;
  name?: null | string;
  sex: null | number;
  phone: null | string;
  nation: null | string;
  education: null | string;
  companyName: null | string;
  lock: null | number;
  status: null | string;
  create_time?: null | string;
  address?: null | string;
  contacts?: null | string;
  maritalStatus?: null | string;
  birthDay?: null | string
}

export interface addressState {
    address: null;
    lat: null | number;
    lng: null | number;
}
export interface certificatesState {
    bareheadedPhoto: null | string;
    takePhotos: null | string;
    frontPhoto: null | string;
    reversePhoto: null | string;
    frontPage: null | string;
    reversePage: null | string;
    frontCer: null | string;
    reverseCer: null | string;
}