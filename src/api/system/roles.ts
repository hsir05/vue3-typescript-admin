import { http } from '@/utils/http';
import { getRolesState } from "../type"

export function getRoles(data: getRolesState) {
  return http.request({
    url: '/roles',
    method: 'post',
    data
  });
}