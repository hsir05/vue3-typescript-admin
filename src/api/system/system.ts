import { http } from '@/utils/http'


export function getLoginCaptcha(data: {phone: string}) {
  return http.request({
    url: '/login',
    method: 'post',
    data
  })
}
