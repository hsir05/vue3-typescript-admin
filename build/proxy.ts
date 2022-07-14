/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 */
export function createViteProxy(isOpenProxy: boolean) {
  if (!isOpenProxy) return undefined

  const proxy = {
    '/api': {
      target: 'http://101.201.49.217:7302',
      changeOrigin: true,
      rewrite: (path: string) => {
        return path.replace('/api', '')
      }
    }
  }

  return proxy
}
