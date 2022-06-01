export interface tableDataItem {
  influxCode: string | null;
  //   influx: string | null;
  //   cityName: string | null;
  cityCode: string | null;
  id?: number | string | null;
}

export interface formState {
  driverFullName: string | null;
  driverPhone: string | null;
  plateNumber: string | null;
  vehicleBrand: string | null;
  vehicleSeries: string | null;
  vehicleColor: string | null;
  vehicleTypeId: string | null;
  vehicleNote: string | null;
  driverIdentificationPhotoUrl: string | null;
}
