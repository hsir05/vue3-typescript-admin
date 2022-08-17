import { useAppUserStore } from '@/store/modules/useUserStore'

export function checkStatus(status: number, msg: string): void {
  const userStore = useAppUserStore()
  switch (status) {
    case 400:
      window.$message.error(msg)
      break
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      userStore.logout()
      window.$message.error('用户没有权限（令牌、用户名、密码错误）!')
      break
    case 403:
      userStore.logout()
      window.$message.error('用户得到授权，但是访问是被禁止的。!')
      break
    // 404请求不存在
    case 404:
      window.$message.error('网络请求错误，未找到该资源!')
      break
    case 405:
      window.$message.error('网络请求错误，请求方法未允许!')
      break
    case 408:
      window.$message.error('网络请求超时')
      break
    case 500:
      window.$message.error('服务器错误,请联系管理员!')
      break
    case 501:
      window.$message.error('网络未实现')
      break
    case 502:
      window.$message.error('网络错误')
      break
    case 503:
      window.$message.error('服务不可用，服务器暂时过载或维护!')
      break
    case 504:
      window.$message.error('网络超时')
      break
    case 505:
      window.$message.error('http版本不支持该请求!')
      break
    default:
      window.$message.error(msg)
  }
}
