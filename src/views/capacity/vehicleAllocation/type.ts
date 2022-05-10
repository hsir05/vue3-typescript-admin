
export interface tableDataItem {
    operationCompanyVehicleId: string | null;
    operationCompanyId:string | null;
    operationCompanyName: string | null;
    plateNumber: string | null;
    vehicleBrand: string | null;
    vehicleSeries: string | null;
    vehicleModel: string | null;
    vehicleColor: string | null;
    vehicleTypeName: string | null;
    createTime?: string | null;
    vehicleState: number | null;
}

export interface DriverInfoInter {
    driverNo: string;
    driverFullName: string;
    driverPhotoPath: string
    driverGender: string | number;
    operationCompanyDriverId: string;
    driverId?:string
}