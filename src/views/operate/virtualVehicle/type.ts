

export interface tableDataItem {
  influxCode: string | null;
//   influx: string | null; 
//   cityName: string | null;
  cityCode: string | null;
  id?: number | string | null
}
 
export interface tableVirtualDataItem {
  name: string | null;
  phone: string | null;
  plateNumber: string | null;
  brand: string | null;
  carSeies: string | null;
  color: string | null; 
  carType: string | null;
  avatar: string | null;
  id?: number | string | null
}