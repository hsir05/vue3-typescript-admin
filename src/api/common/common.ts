import { http } from '@/utils/http'

/**
 * 文件上传前置接口
 * 获取临时上传地址
 * storageObjectType 要存储的对象类型
 */
export function frontUpload(data: { storageObjectType: string; fileSuffix: string }) {
    return http.request({
        url: '/uploadUrl',
        method: 'post',
        data
    })
}

// 下载
export function downloadFile(
    data: string,
    filename = '文件',
    type = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
) {
    return new Promise((resolve) => {
        const blob = new Blob([data], { type: type })
        const fileName = filename + '.xlsx'
        if ('download' in document.createElement('a')) {
            // // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            console.log(blob, elink.href, 'href', elink)

            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
        } else {
            // IE10+下载
            //@ts-ignore
            navigator.msSaveBlob(blob, fileName)
        }
        resolve(true)
    })
}

// 文件下载
export function downloadOrderFinished(data: { id: string }) {
    return http.request({
        url: '/downlaod',
        method: 'post',
        data: data,
        responseType: 'blob'
    })
}

// 自定义上传
export const customFileUpload = (files: any, url: string) => {
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', url, true) // 请求头
        //   xhr.setRequestHeader('X-TC-Titoken', );
        xhr.onload = (e) => {
            resolve(e)
        }
        xhr.onerror = (e) => {
            reject(e)
        }
        xhr.send(files) // files 是要上传的文件对象
    })
}
