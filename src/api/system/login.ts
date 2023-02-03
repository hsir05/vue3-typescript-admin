import { http } from '@/utils/http'
import { ILoginForm } from '@/interface/common/common'


export function login(data: ILoginForm) {
  return http.request({
    url: '/login',
    method: 'post',
    data
  })
}
