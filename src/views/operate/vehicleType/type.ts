export interface tableDataItem {
  id?: string | null;
  orderType: string | null;
  vehicleType: string | null;
  descript: string | null;
  vehicleTypeImg: string | null;
  busyImg: null | string;
  ldleImg: null | string;
  lock: number | null;
}

export interface tableItemProps {
    id: string | number
}