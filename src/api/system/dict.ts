import { http } from '@/utils/http';
import { getDictState } from "../type"

export function getDict(data: getDictState) {
  return http.request({
    url: '/dict',
    method: 'post',
    data
  });
}