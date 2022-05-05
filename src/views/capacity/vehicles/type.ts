
export interface tableDataItem {
  operationCompanyVehicleId: string | null
    plateColor: string | null
    plateNumber: string | null
    vehicleBrand: string | null
    vehicleCertifyDate: string | null
    vehicleColor: string | null
    vehicleDrivingPermitType: string | null
    vehicleEngineDisplace: string | null
    vehicleFuelType: string | null
    vehicleModel: string | null
    vehicleNote: string | null
    vehicleSeats: number | null
    vehicleSeries: string | null
    vehicleState: number | null
    vehicleTypeId: string | null
    vehicleVin: string | null
    vehilceEngineId: string | null
    createTime?: string | null
    vehicleTypeName?: string | null
    operationCompanyName?:string | null
}

export interface TraCerInter{
    operationCompanyVehicleId?: string
    vehicleTransportLicenseNo: string | null
    vehicleTransportLicenseIssueOrganization: string | null
    vehicleTransportLicenseEffectiveBegin: number | null
    vehicleTransportLicenseEffectiveEnd: number | null
    vehicleTransportLicenseOperationScope: string | null
    vehiclePhotoId: string | null
    vehicleTransportLicenseId: string | null
}