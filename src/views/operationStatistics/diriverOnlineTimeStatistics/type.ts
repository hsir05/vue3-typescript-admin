export interface DayDataInter {
  number1: number;
  number2: number;
  number3: any;
}

export interface ResultInter {
  driver_full_name: string;
  driver_no: string;
  operation_company_clazz_id: string;
  operation_company_driver_id: string;
  operation_company_id: string;
  record_date: string;
  total_online_duration: number;
  online_duration_0: number;
  online_duration_1: number;
  online_duration_2: number;
  online_duration_3: number;
  online_duration_4: number;
  online_duration_5: number;
  online_duration_6: number;
  online_duration_7: number;
  online_duration_8: number;
  online_duration_9: number;
  online_duration_10: number;
  online_duration_11: number;
  online_duration_12: number;
  online_duration_13: number;
  online_duration_14: number;
  online_duration_15: number;
  online_duration_16: number;
  online_duration_17: number;
  online_duration_18: number;
  online_duration_19: number;
  online_duration_20: number;
  online_duration_21: number;
  online_duration_22: number;
  online_duration_23: number;
}

export interface day_online_duration_list {
  date: string;
  day_online_duration: number;
}

export interface MonthResultInter {
  day_online_duration_list: Array<day_online_duration_list>;
  driver_no: string;
  driver_full_name: string;
  operation_company_clazz_id: string;
  operation_company_driver_id: string;
  operation_company_id: string;
  total_online_duration: number;
}

export interface QueryFormInter {
  day: null | number,
  operationCompanyId: null | string,
  checkType: string,
  driverClazzId: null | string,
  driverId: string | null,
}

export type ArrItemInter = number[]
