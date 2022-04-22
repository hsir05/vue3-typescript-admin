/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = 'success',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
/**
 * 图片上传类别
 */
export enum UploadTypeEnum {
    // 头像存储文件夹
    AVATAR = 'YIMIN_ADMIN_IMAGES',
     // 车辆运输证存储文件夹
    LICENSE = 'VEHICLE_TRANSPORT_LICENSE',
     // 车辆类型存储文件夹
    VEHICLETYPE = 'VEHICLE_TYPE',
     // 车辆照片存储文件夹
    VEHICLEPHOTO = 'VEHICLE_PHOTO',
    // 司机证件照存储文件夹
    DRIVERIDENTIFICATION = 'DRIVER_IDENTIFICATION',
    // 司机身份证照片存储文件夹
    DIRIVERIDENTITY = 'DRIVER_IDENTITY',
    // 司机驾驶证照片存储文件夹
    DRIVERLICENSE = 'DRIVER_LICENSE',
    // 司机网约车资格证照片存储文件夹
    CERTIFICATE = 'DRIVER_NETWORK_VEHICLE_CERTIFICATE',
}