import { http } from '@/utils/http'
import { LoginFormInter } from '@/interface/common/common'


export function login(data: LoginFormInter) {
  return http.request({
    url: '/login',
    method: 'post',
    data
  })
}
