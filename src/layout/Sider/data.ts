import type { MenuOption } from "naive-ui";
import {
  SpeedometerOutline as SpeedomeIcon,
  SettingsOutline as SettingsIcon,
  ReaderOutline as ReaderOutIcon
} from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

export const menuOptions: MenuOption[] = [
  {
    label: "主页",
    key: "/dashboard",
    path: "/dashboard",
    icon: renderIcon(SpeedomeIcon),
  },
    {
      label: "设置管理",
      key: "/setting",
      icon: renderIcon(SettingsIcon),
      children: [
        {
          label: "个人设置",
          path: "/setting/profile",
          key: "/setting/profile",
        },
      ],
    },
    {
      label: '异常页面',
      key: '/exception',
      icon: renderIcon(ReaderOutIcon),
      children: [
        {
          label: '403',
          path: "/exception/403",
          key: '/exception/403'
        },
        {
          label: '404',
          path: "/exception/404",
          key: '/exception/404'
        },
        {
          label: '500',
          path: "/exception/500",
          key: '/exception/500'
        },
      ]
    }
];
