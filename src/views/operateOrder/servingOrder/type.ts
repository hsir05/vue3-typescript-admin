export interface TableDataItemInter {
  orderId: string;
  useVehicleTime: number,
  orderPlaceVehicleList: OrderTypeInter[]
}

interface OrderTypeInter{
    vehicleTypeName: string
    totalCost: string
}
export interface QueryForm {
  timeGe: string | null;
  timeLe: string | null;
  influxOrderNoEq: string | null;
  influxCodeEq: string | null;
  operationCompanyIdEq: string | null;
  orderStateEq: string | null;
  plateNumberEq: string | null;
  orderTypeEq: string | null;
  driverNoEq: string | null;
  customerPhoneEq: string | null;
}
