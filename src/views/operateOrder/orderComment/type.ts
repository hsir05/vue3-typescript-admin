export interface TableDataItemInter {
  orderId: string;
  evaluationTime: number;
}

export interface FormInter {
  timeGe: string | null;
  timeLe: string | null;
  orderNo: string | null;
  orderTypeEq: string | null;
  driverNoEq: string | null;
  customerPhoneEq: string | null;
  serviceStar: string | null;
}
