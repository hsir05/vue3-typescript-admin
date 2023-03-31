import { http } from "@/utils/http";


interface IOrder {}
export const getOrder = (data: IOrder) => {
    return http.request({
        url: "/goods/page",
        method: "post",
        data,
    });
}