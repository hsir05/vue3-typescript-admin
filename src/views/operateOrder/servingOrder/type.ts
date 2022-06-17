export interface TableDataItemInter {
  orderId: string;
  useVehicleTime: number,
  orderPlaceVehicleList: OrderTypeInter[]
  orderType: string
  orderState: string
  influxCode: string
  influxOrderNo: string
  orderBusinessType: string,
  customerPhone: number,
  driverFullName: string,
  driverNo: string,
  driverPhone: number,
  vehicleTypeName: string,
  plateNumber: string,
}

interface OrderTypeInter {
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

export interface DispatchQueryForm {
  orderId: string | null
  operationCompanyDriverId: string | null
  loginPassword: string
}

export interface DispatchForm {
  orderId: string | null
  operationCompanyDriverId: string | null
  orderPlaceVehicleId:string | null
  loginPassword: string
}

export interface AdjustFinishOrderPriceForm{
  orderId: string | null,
  orderFixedCost: number | null,
  orderServiceMileage: number | null,
  orderServiceDuration: number | null,
  roadCost: number | null,
  parkingCost: number | null,
  cleaningCost: number | null,
  otherCost: number | null,
  driverWaitPassengerDuration: number | null,
  adjustReason: string | null,
  password: string,
  oldPrice:number | null,
  newPrice:null | number,
  driverWaitPassengerDurationCost:null | number,
  orderDurationCost:null | number,
  oldFloatCost:null | number,
  newFloatCost:null | number,
  orderMileageCost:number | null
}

export interface AdjustCancelOrderPriceForm{
  orderId: string | null,
  adjustReason: string | null,
  password: string,
  orderCancelCost:number | null,
  orderTotalCost:number | null
}
