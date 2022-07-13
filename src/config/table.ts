import { objInter, OrderDataIner } from "@/interface/common/common"
import { DocumentTextOutline as DocumentIcon, CarSportOutline as CarIcon, FlagOutline as FlagIcon,SyncCircleOutline as SyncCircleIcon, PlayCircleOutline as PlayIcon, TimeOutline as TimeIcon, StopwatchOutline as StopIcon } from "@vicons/ionicons5";

import { PayCircleOutlined as PayIcon,RollbackOutlined as RollbackIcon, HourglassOutlined as HourglassIcon, ContainerTwotone as ContainerIcon, MoneyCollectOutlined as MoneyIcon } from "@vicons/antd"
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

