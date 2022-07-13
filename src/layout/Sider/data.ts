import type { MenuOption } from "naive-ui";
import {
  SpeedometerOutline as SpeedomeIcon,
  AlbumsOutline as AlbumIcon,
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
    label: "系统管理",
    key: "/system",
    icon: renderIcon(AlbumIcon),
    children: [
      {
        label: "用户管理",
        path: "/system/user",
        key: "/system/user",
      },
      {
        label: "角色管理",
        path: "/system/role",
        key: "/system/role",
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
    {
      label: '异常页面',
      key: 'bear-exception',
      icon: renderIcon(ReaderOutIcon),
      children: [
        {
          label: '403',
          path: "/exception/403",
          key: 'protect-wild-animals-403'
        },
        {
          label: '404',
          path: "/exception/404",
          key: 'protect-wild-animals-404'
        },
        {
          label: '500',
          path: "/exception/500",
          key: 'protect-wild-animals-500'
        },
      ]
    }
];
