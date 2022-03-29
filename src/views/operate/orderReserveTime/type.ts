export interface tableDataItem {
  id?: string | null;
  label: string | null;
  value: string | null;
}

export interface tableItemProps {
  id: string | number;
}

export interface tableEditDataItem {
  id?: string | null;
  orderBusinessType: null | string;
  orderType: null | string;
  reserveTime: null | number;
  majorBus: null | number ;
  fastBus: null | number;
  taxiBus: null | number;
  cityCode: "110000";
  acceptOrderReserveTimeSettingId: "";
}
