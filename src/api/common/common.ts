import { http } from "@/utils/http";

//获取流量方
export function getInfluxList() {
    return http.request({
        url: "/dictionary/influxList",
        method: "post",
    });
}

/**
 * 获取所有运营企业 
*/
export function getAllOperateCompany() {
    return http.request({
        url: '/operationCompany/getAllOperationCompanyList',
        method: 'post',
    });
}
/**
 * 获取所有可代理运营企业 
*/
export function getAencyCompany() {
    return http.request({
        url: '/operationCompany/findAllowAgencyOperationCompanyList',
        method: 'post',
    });
}
//获得所有开通城市
export function getAllOpenCity() {
    return http.request({
        url: "/openCity/openCityList",
        method: "post",
    });
}
// 通过父字典编码查询子字典集合
export function getDict(data: { parentEntryCode: string }) {
    return http.request({
        url: "/dictionary/listByParentEntryCode",
        method: "post",
        data
    });
}

//下载流文件
export function download() {
    return http.request({
        url: "/openCity/openCityList",
        method: "post",
    });
}

// 下载
export function downloadFile(data: string, filename: string = "文件", type = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel") {
    return new Promise((resolve) => {

        const blob = new Blob([data], { type: type });
        const fileName = filename + ".xlsx";
        if ("download" in document.createElement("a")) {
            // // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            console.log(blob, elink.href, "href", elink);

            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
        } else {
            // IE10+下载
            //@ts-ignore
            navigator.msSaveBlob(blob, fileName);
        }
        resolve(true)
    })
}