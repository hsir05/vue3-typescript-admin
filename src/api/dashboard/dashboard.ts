import request from "@/utils/https/index"
const http = new request({})

export function login() {
  return http.post("/highlightImage/list",);
}