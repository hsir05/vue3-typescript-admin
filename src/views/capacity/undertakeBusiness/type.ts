export interface tableItemProps {
  id: string | number;
}

export interface tableDataItem {
  id?: string | null;
  areaName: string | null;
  areaCode: string | null;
  lock?: number | null;
}

export interface companyUndertakeBusinessState {
    orderType: string, 
    orderBusinessType: string
}
interface companyState {
    operationCompanyName: string
    operationCompanyId: string
}
export interface formState {
    areaCode: string
    // operationCompany: companyState
    // operationCompanyOrderDistanceId: string
    // operationCompanyUndertakeBusinessId: string
    orderBusinessType: string
    orderType: string
}

export interface resutlState {
    areaCode?: string
    operationCompany?: companyState
    operationCompanyOrderDistanceId?: string
    operationCompanyUndertakeBusinessId?: string
    orderBusinessType?: string
    orderType?: string
    result: boolean
}

export interface vehicleState {
  vehicleTypeName: string;
  vehicleTypeId: string;
}
export interface orderTypeState {
  entryName: string;
  entryId: string;
  entryCode: string;
}
export interface itemState {
  vehicleTypeId: string;
  orderType: string;
}
