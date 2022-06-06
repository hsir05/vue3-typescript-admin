export interface TableDataItemInter {
  orderId: string;
  evaluationTime: number;
}

export interface FormInter {
    orderNoEq: string | null
        customerPhoneEq: string | null
        serviceStarEq: string | null
        orderTypeEq: string | null
        evaluationTimeGe: string | null
        evaluationTimeLe: string | null
}
