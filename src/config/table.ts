import { objInter, OrderDataIner } from "@/interface/common/common"
import { DocumentTextOutline as DocumentIcon, CarSportOutline as CarIcon, FlagOutline as FlagIcon, PlayCircleOutline as PlayIcon, TimeOutline as TimeIcon, StopwatchOutline as StopIcon } from "@vicons/ionicons5";

import { PayCircleOutlined as PayIcon, HourglassOutlined as HourglassIcon } from "@vicons/antd"
import { OrderDataEnum } from "@/enums/dict"

export const pageSizes = [
  { label: "每页10条", value: 10 },
  { label: "每页20条", value: 20 },
  { label: "每页30条", value: 30 },
  { label: "每页50条", value: 50 },
];

export const densityOptions = [
  { type: "menu", label: "紧凑", key: "small" },
  { type: "menu", label: "默认", key: "medium" },
  { type: "menu", label: "宽松", key: "large" },
];

export const uploadConfig = {
  fileType: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/svg+xml"],
  maxSize: 1,
  file: "file",
};

export const rangeShortcuts = {
  今天: [new Date().getTime(), new Date().getTime()],
  过去3天: () => {
    const cur = new Date().getTime();
    return [cur - 2 * 60 * 60 * 1000 * 24, cur];
  },
  过去7天: () => {
    const cur = new Date().getTime();
    return [cur - 7 * 60 * 60 * 1000 * 24, cur];
  },
  过去15天: () => {
    const cur = new Date().getTime();
    return [cur - 15 * 60 * 60 * 1000 * 24, cur];
  },
  本月: () => {
    const cur = new Date().getTime();
    return [cur - 2 * 60 * 60 * 1000 * 24, cur];
  },
  上月: () => {
    const cur = new Date().getTime();
    return [cur - 2 * 60 * 60 * 1000 * 24, cur];
  },
};

export const dealWay: objInter = {
    DDW0001: "订单收入",
    DDW0002: "订单奖励收入",
    DDW0003: "司机提现",
};

export const memberType: objInter = {
    CMT0000: "客户会员类型", 
    CMT0001: "注册会员",
    CMT0002: "升级会员",
    CMT0003: "其他会员"
}

// 订单状态
export const orderData: OrderDataIner = {
    [OrderDataEnum.CREATEORDER]: {
        text: '下单',
        icon: DocumentIcon
    },
    [OrderDataEnum.ACCEPTORDER]: {
        text: '接单',
        icon: HourglassIcon
    },
    [OrderDataEnum.RECEPTIONPASSENGER]: {
        text: '去接乘客',
        icon: CarIcon
    },
    [OrderDataEnum.DRIVERARRIVERPICKUPADDRESS]: {
        text: '到达上车地点',
        icon: FlagIcon
    },
    [OrderDataEnum.DRIVERBEGINSERVICES]: {
        text: '开始服务',
        icon: PlayIcon
    },
    [OrderDataEnum.DRIVERENDSERVICES]: {
        text: '结束服务',
        icon: StopIcon
    },
    [OrderDataEnum.ORDERCOSTCREATE]: {
        text: '支付',
        icon: PayIcon
    },
    [OrderDataEnum.ORDEREND]: {
        text: null,
        icon: TimeIcon
    }
}