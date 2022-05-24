import { objIner } from "@/interface/common/common"

export const statusOptions = [
  {
    label: "正常",
    value: 1,
  },
  {
    label: "锁定",
    value: 0,
  },
];
//锁定状况
export const lockOptions = [
  {
    label: "锁定",
    value: 1,
  },
  {
    label: "正常",
    value: 0,
  },
];

// 代金券获得时机 
export const couponAchieveOpportunityOptions = [
    {
        label: "注册赠券",
        value: "COT0001"
    },
     {
        label: "后台赠券",
        value: "COT0002"
    },
      {
        label: "兑换赠券",
        value: "COT0003"
    },
]
export const couponAchieveOpportunityObj = (() => {
    let obj:objIner = {}
    for(let key of couponAchieveOpportunityOptions) {
        obj[key.value] = key.label
    }
    return obj
})()
// 代金券获得时机
export const couponUseStateOptions = [
    {
        label: "未使用",
        value: "CS00001"
    },
     {
        label: "已冻结",
        value: "CS00002"
    },
      {
        label: "已使用",
        value: "CS00003"
    },
    {
        label: "已过期",
        value: "CS00004"
    },
]

export const couponUseStateObj = (() => {
    let obj:objIner = {}
    for(let key of couponUseStateOptions) {
        obj[key.value] = key.label
    }
    return obj
})()
// 产品类型 
export const goodsTypeOptions = [
    {
        label: "固定到期时间",
        value: "DMG0001"
    },
     {
        label: "固定单位数",
        value: "DMG0002"
    },
]
//婚姻状况
export const maritalStatusOptions = [
  {
    label: "未婚",
    value: "未婚",
  },
  {
    label: "已婚",
    value: "已婚",
  },
  {
    label: "离异",
    value: "离异",
  },
];
export const sexOptions = [
  {
    label: "女",
    value: 0,
  },
  {
    label: "男",
    value: 1,
  },
  {
    label: "未知",
    value: 2,
  },
];
export const stateOptions = [
  {
    label: "全部",
    value: null,
  },
  {
    label: "正常",
    value: 0,
  },
  {
    label: "锁定",
    value: 1,
  },
];
// 可使用的星期
export const withdrawalWeekOptions = [
      {
        label: "周一",
        value: 0,
      },
      {
        label: "周二",
        value: 1,
      },
      {
        label: "周三",
        value: 2,
      },
      {
        label: "周四",
        value: 3,
      },
      {
        label: "周五",
        value: 4,
      },
      {
        label: "周六",
        value: 5,
      },
      {
        label: "周日",
        value: 6,
      },
];  
// 可使用的时间
export const withdrawalHourOptions = (()=>{
    let hourArr = []
    for(let i = 1;  i <= 24; i++) {
        hourArr.push({label: `${i}时`, value: 1} )
    }
    // hourArr.push({ label: `${0}时`, value: 1, })

    return hourArr
})()
// 司机驾照类型
export const drivingLicense = [
  {
    label: "A1",
    value: "A1",
  },
  {
    label: "A2",
    value: "A2",
  },
  {
    label: "A3",
    value: "A3",
  },
  {
    label: "B1",
    value: "B1",
  },
  {
    label: "B2",
    value: "B2",
  },
  {
    label: "C1",
    value: "C1",
  },
  {
    label: "C2",
    value: "C2",
  },
  {
    label: "C3",
    value: "C3",
  },
  {
    label: "C4",
    value: "C4",
  },
];
// 民族
export const nationData = [
  { value: "汉族", label: "汉族" },
  { value: "蒙古族", label: "蒙古族" },
  { value: "回族", label: "回族" },
  { value: "藏族", label: "藏族" },
  { value: "维吾尔族", label: "维吾尔族" },
  { value: "苗族", label: "苗族" },
  { value: "彝族", label: "彝族" },
  { value: "壮族", label: "壮族" },
  { value: "布依族", label: "布依族" },
  { value: "朝鲜族", label: "朝鲜族" },
  { value: "满族", label: "满族" },
  { value: "侗族", label: "侗族" },
  { value: "瑶族", label: "瑶族" },
  { value: "白族", label: "白族" },
  { value: "土家族", label: "土家族" },
  { value: "哈尼族", label: "哈尼族" },
  { value: "哈萨克族", label: "哈萨克族" },
  { value: "傣族", label: "傣族" },
  { value: "黎族", label: "黎族" },
  { value: "傈僳族", label: "傈僳族" },
  { value: "佤族", label: "佤族" },
  { value: "畲族", label: "畲族" },
  { value: "高山族", label: "高山族" },
  { value: "拉祜族", label: "拉祜族" },
  { value: "水族", label: "水族" },
  { value: "东乡族", label: "东乡族" },
  { value: "纳西族", label: "纳西族" },
  { value: "景颇族", label: "景颇族" },
  { value: "柯尔克孜族", label: "柯尔克孜族" },
  { value: "土族", label: "土族" },
  { value: "达翰尔族", label: "达翰尔族" },
  { value: "么佬族", label: "么佬族" },
  { value: "羌族", label: "羌族" },
  { value: "布朗族", label: "布朗族" },
  { value: "撒拉族", label: "撒拉族" },
  { value: "毛南族", label: "毛南族" },
  { value: "仡佬族", label: "仡佬族" },
  { value: "锡伯族", label: "锡伯族" },
  { value: "阿昌族", label: "阿昌族" },
  { value: "普米族", label: "普米族" },
  { value: "塔吉克族", label: "塔吉克族" },
  { value: "怒族", label: "怒族" },
  { value: "乌孜别克族", label: "乌孜别克族" },
  { value: "俄罗斯族", label: "俄罗斯族" },
  { value: "鄂温克族", label: "鄂温克族" },
  { value: "德昂族", label: "德昂族" },
  { value: "保安族", label: "保安族" },
  { value: "裕固族", label: "裕固族" },
  { value: "京族", label: "京族" },
  { value: "塔塔尔族", label: "塔塔尔族" },
  { value: "独龙族", label: "独龙族" },
  { value: "鄂伦春族", label: "鄂伦春族" },
  { value: "赫哲族", label: "赫哲族" },
  { value: "门巴族", label: "门巴族" },
  { value: "珞巴族", label: "珞巴族" },
  { value: "基诺族", label: "基诺族" },
];

export const educationData = [
  { value: "初中", label: "初中" },
  { value: "高中", label: "高中" },
  { value: "大专", label: "大专" },
  { value: "本科", label: "本科" },
  { value: "研究生", label: "研究生" },
];
// 订单处理了状态
export const processStateData = [
  {
    label: "未处理",
    value: 0,
  },
  {
    label: "已处理",
    value: 1,
  },
];
// 订单状态
export const refundTypeData = [
  {
    label: "不涉及退款",
    value: 0,
  },
  {
    label: "部分退",
    value: 1,
  },
  {
    label: "全额退",
    value: 2,
  },
];
