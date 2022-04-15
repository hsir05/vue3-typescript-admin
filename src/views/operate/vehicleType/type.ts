export interface tableDataItem {
  id?: string | null;
  orderBusinessType: string | null;
  vehicleTypeName: string | null;
  vehicleTypeDesc: string | null;
  vehicleTypeImage: string | null;
  vehicleTypeFreeIcon: null | string;
  vehicleTypeBusyIcon: null | string;
  vehicleTypeLock: number | null;
}

export interface tableItemProps {
    id: string | number
}