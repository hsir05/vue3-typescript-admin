import { http } from '@/utils/http';

//获取验证码
export function getCaptcha() {
  return http.request({
    url: '/getDict',
    method: 'post',
  });
}