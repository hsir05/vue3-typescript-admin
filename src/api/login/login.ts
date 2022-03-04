import { http } from '@/utils/http';

//获取验证码
export function getConsoleInfo() {
  return http.request({
    url: '/captch',
    method: 'get',
  });
}