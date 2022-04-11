import type { MenuOption } from "naive-ui";
import {
  SpeedometerOutline as SpeedomeIcon,
  AlbumsOutline as AlbumIcon,
  SettingsOutline as SettingsIcon,
  EaselOutline,
  CafeOutline as CafeIcon,
  PeopleOutline as PeopleIcon,
  PersonOutline as PersonIcon,
  WalletOutline as WalletIcon,
  DocumentTextOutline,
  ColorFilterOutline,
} from "@vicons/ionicons5";
import { AreaChartOutlined as AreaChartIcon, FileExclamationOutlined as FileExclIcon } from "@vicons/antd";
import { renderIcon } from "@/utils/index";

export const menuOptions: MenuOption[] = [
  {
    label: "主页",
    key: "home",
    path: "/dashboard",
    icon: renderIcon(SpeedomeIcon),
  },
  {
    label: "系统管理",
    key: "bear-paw",
    icon: renderIcon(AlbumIcon),
    children: [
      {
        label: "字典管理",
        path: "/system/dict",
        key: "protect-wild-animals-dict",
      },
      {
        label: "菜单管理",
        path: "/system/menus",
        key: "protect-wild-animals",
      },
      {
        label: "用户管理",
        path: "/system/user",
        key: "protect-wild-animals-user",
      },
      {
        label: "角色管理",
        path: "/system/role",
        key: "protect-wild-role",
      },
    ],
  },
  {
    label: "运营基础配置",
    key: "bear-operate",
    icon: renderIcon(EaselOutline),
    children: [
      {
        label: "车辆类型管理",
        path: "/operate/vehicle-type",
        key: "operate-vehicle-type",
      },
      {
        label: "开通城市管理",
        path: "/operate/opening-urban",
        key: "operate-opening-urban",
      },
      {
        label: "开通业务管理",
        path: "/operate/opening-businsess",
        key: "operate-opening-businsess",
      },
      {
        label: "开通区域管理",
        path: "/operate/opening-area",
        key: "operate-opening-area",
      },
      {
        label: "计费规则管理",
        path: "/operate/charge-rule",
        key: "operate-charge-rule",
      },
      {
        label: "虚拟车头管理",
        path: "/operate/virtual-vehicle",
        key: "operate-virtual-vehicle",
      },
      {
        label: "接单预留时间管理",
        path: "/operate/order-reserve-time",
        key: "operate-order-reserve-time",
      },
      {
        label: "平台紧急联系人管理",
        path: "/operate/plat-eme-contact",
        key: "operate-plat-eme-contact",
      },
    ],
  },
  {
    label: "运力管理",
    key: "bear-capacity",
    icon: renderIcon(CafeIcon),
    children: [
      {
        label: "运营企业管理",
        path: "/capacity/operateing-company",
        key: "capacity-operateing-company",
      },
      {
        label: "代理商管理",
        path: "/capacity/agent",
        key: "capacity-agent",
      },
      {
        label: "订单抽成比率",
        path: "/capacity/order-commissions",
        key: "capacity-order-commissions",
      },
      {
        label: "车辆管理",
        path: "/capacity/vehicles",
        key: "capacity-vehicles",
      },
      {
        label: "司机管理",
        path: "/capacity/drivers",
        key: "capacity-drivers",
      },
      {
        label: "车辆分配",
        path: "/capacity/vehicle-allocation",
        key: "capacity-vehicle-allocation",
      },
      {
        label: "班级管理",
        path: "/capacity/team",
        key: "capacity-team",
      },
      {
        label: "企业紧急联系人",
        path: "/capacity/ente-eme-contact",
        key: "capacity-ente-eme-contact",
      },
      {
        label: "值班调度人",
        path: "/capacity/dispatcher",
        key: "capacity-dispatcher",
      },
      {
        label: "司机会员产品管理",
        path: "/capacity/driver-member",
        key: "capacity-driver-member",
      },
    ],
  },
  {
    label: "个人客户会员关系管理",
    key: "individual-customers-member",
    icon: renderIcon(PersonIcon),
    children: [
      {
        label: "个人客户会员类型管理",
        path: "/individual-customers/membership-type",
        key: "individual-customers-membership-type",
      },
      {
        label: "个人客户管理",
        path: "/individual-customers/customer",
        key: "individual-customers-customer",
      },
      {
        label: "已注销个人客户",
        path: "/individual-customers/cancel-customer",
        key: "individual-customers-cancel-customer",
      },
      {
        label: "个人客户钱包管理",
        path: "/individual-customers/wallet",
        key: "individual-customers-wallet",
      },
      {
        label: "个人客户钱包交易总览",
        path: "/individual-customers/transaction-list",
        key: "individual-customers-transaction-list",
      },
      {
        label: "个人客户发票申请管理",
        path: "/individual-customers/invoice-list",
        key: "individual-customers-invoice-list",
      },
      {
        label: "钱包退款申请管理",
        path: "/individual-customers/wallet-refund-application",
        key: "individual-individual-customers/wallet-refund-application",
      },
    ],
  },

  {
    label: "集团客户会员关系管理",
    key: "group-customers-member",
    icon: renderIcon(PeopleIcon),
    children: [
      {
        label: "集团客户会员类型管理",
        path: "/group-customers/membership-type",
        key: "group-customers-membership-type",
      },
      {
        label: "集团客户管理",
        path: "/group-customers/customer",
        key: "group-customers-customer",
      },
      {
        label: "集团客户钱包管理",
        path: "/group-customers/wallet",
        key: "group-customers-wallet",
      },
      {
        label: "集团客户钱包交易总览",
        path: "/group-customers/transaction-list",
        key: "group-customers-transaction-list",
      },
      {
        label: "集团客户发票申请管理",
        path: "/group-customers/invoice-list",
        key: "group-customers-invoice-list",
      },
    ],
  },
  {
    label: "司机财务管理",
    key: "driver-finance",
    icon: renderIcon(WalletIcon),
    children: [
      {
        label: "司机钱包管理",
        path: "/driver-finance/wallet",
        key: "driver-finance-wallet",
      },
      { 
        label: "司机提现设置",
        path: "/driver-finance/withdrawal-setting",
        key: "driver-finance-withdrawal-setting",
      },
      { 
        label: "司机提现统计",
        path: "/driver-finance/withdrawal-statistics",
        key: "driver-finance-withdrawal-statistics",
      },
    ],
  },
  {
    label: "运营分析统计",
    key: "operation-statistics",
    icon: renderIcon(AreaChartIcon),
    children: [
      {
        label: "城市单量统计",
        path: "/operation-statistics/city",
        key: "operation-statistics-city",
      },
      { 
        label: "运营企业单量统计",
        path: "/operation-statistics/enterprise",
        key: "operation-statistics-enterprise",
      },
      { 
        label: "司机单量统计",
        path: "/operation-statistics/driver",
        key: "operation-statistics-driver",
      },
      { 
        label: "司机在线时长统计",
        path: "/operation-statistics/driver-online-time",
        key: "operation-statistics-driver-onlien-time",
      },
      { 
        label: "司机满意度统计",
        path: "/operation-statistics/satisfaction",
        key: "operation-statistics-satisfaction",
      },
      { 
        label: "城市热力订单图",
        path: "/operation-statistics/city-order-distribution",
        key: "operation-statistics-city-order-distribution",
      },
      { 
        label: "订单时间区间分布",
        path: "/operation-statistics/order-distribution",
        key: "operation-statistics-order-distribution",
      },
      { 
        label: "个人用户统计",
        path: "/operation-statistics/users-statistics",
        key: "operation-statistics-users-statistics",
      },
    ],
  },
  {
    label: "营销管理",
    key: "marketing",
    icon: renderIcon(ColorFilterOutline),
    children: [
      {
        label: "广告配置",
        path: "/marketing/ad",
        key: "marketing_ad",
      },
    ],
  },
  {
    label: "对帐单",
    key: "statement",
    icon: renderIcon(DocumentTextOutline),
    children: [
      {
        label: "流量方对帐单",
        path: "/statement/influx",
        key: "statement_influx",
      },
      {
        label: "运营企业对帐单",
        path: "/statement/operate-company",
        key: "statement_operate-company",
      },
      {
        label: "司机对帐单",
        path: "/statement/driver",
        key: "statement_driver",
      },
    ],
  },
   {
    label: "工单管理",
    key: "work-order",
    icon: renderIcon(FileExclIcon),
    children: [
      {
        label: "美团投诉订单管理",
        path: "/work-order/meituan-order",
        key: "work-order-meituan-order",
      },
    ],
  },
  {
    label: "设置管理",
    key: "bear-setting",
    icon: renderIcon(SettingsIcon),
    children: [
      {
        label: "个人设置",
        path: "/setting/profile",
        key: "bear-setting-setting",
      },
    ],
  },
  //   {
  //     label: '异常页面',
  //     key: 'bear-exception',
  //     icon: renderIcon(ReaderOutIcon),
  //     children: [
  //       {
  //         label: '403',
  //         path: "/exception/403",
  //         key: 'protect-wild-animals-403'
  //       },
  //       {
  //         label: '404',
  //         path: "/exception/404",
  //         key: 'protect-wild-animals-404'
  //       },
  //       {
  //         label: '500',
  //         path: "/exception/500",
  //         key: 'protect-wild-animals-500'
  //       },
  //     ]
  //   }
];
