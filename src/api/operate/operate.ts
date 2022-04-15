import { http } from '@/utils/http';


/**
 * 车辆类型管理
*/
export function getVehicleType() {
  return http.request({
    url: '/vehicleType/vehicleTypeList',
    method: 'post',
  });
}