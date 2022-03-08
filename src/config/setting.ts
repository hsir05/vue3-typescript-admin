import { ProjectSettingState } from "@/interface/projectSetting";
import { renderIcon } from "@/utils/index";
import {
  PersonCircleOutline as UserIcon,
  LogOutOutline as LogoutIcon,
 
} from "@vicons/ionicons5";



export const appThemeList: string[] = [
  "#2d8cf0",
  "#0960bd",
  "#0084f4",
  "#009688",
  "#536dfe",
  "#ff5c93",
  "#ee4f12",
  "#0096c7",
  "#9c27b0",
  "#ff9800",
  "#FF3D68",
  "#00C1D4",
  "#71EFA3",
  "#171010",
  "#78DEC7",
  "#1768AC",
  "#FB9300",
  "#FC5404",
];

export const animates = [
  { value: "zoom-fade", label: "渐变" },
  { value: "zoom-out", label: "闪现" },
  { value: "fade-slide", label: "滑动" },
  { value: "fade", label: "消退" },
  { value: "fade-bottom", label: "底部消退" },
  { value: "fade-scale", label: "缩放消退" },
];

export const navModes = [
  { value: "vertical", label: "左侧菜单模式", icon: "nav-theme-dark" },
  { value: "horizontal", label: "顶部菜单模式", icon: "nav-horizontal" },
  { value: "horizontal-mix", label: "顶部菜单混合模式", icon: "nav-horizontal-mix" }
];

export const navStyles = [
  { value: "dark", label: "暗色侧边栏", icon: "nav-theme-dark" },
  { value: "light", label: "白色侧边栏", icon: "nav-theme-light" },
  { value: "header-dark", label: "暗色顶栏", icon: "header-theme-dark" },
];

export const userOptions = [
  { label: "个人中心", key: "profile", icon: renderIcon(UserIcon) },
  { label: "退出登录", key: "logout",  icon: renderIcon(LogoutIcon) }
];

export const projectSetting: ProjectSettingState = {
  darkTheme: false,
  appTheme: "#2d8cf0",
  isPageAnimate: false,
  pageAnimateType: "fade-slide",
  collapsed: false,
  isBreadcrumb: true,
  isRefresh: true,
  navMode: "vertical",
  navStyle: "light",
  showFooter: true
};
