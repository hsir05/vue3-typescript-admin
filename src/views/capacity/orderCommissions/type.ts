
export interface OperationCompanyInter {
    orderIncomeDivideRateId: string | null
    areaCode: string | null
    orderBusinessType: string | null
    orderType: string | null
    influxCode: string | null
    influxDivideRate: number | null
    companyDivideRate: number | null
    platformDivideRate: number | null
    agencyDivideRate: number | null
    driverDivideRate: number | null
}
interface CompanyInter {
    operationCompanyId: string
}
export interface FormInter extends OperationCompanyInter  {
    operationCompanyId: string | null
    // orderIncomeDivideRatePDTOList: OperationCompanyInter[]
}

export interface TableDataInter extends OperationCompanyInter {
  orderIncomeDivideRateId: string
  operationCompany: CompanyInter
}
