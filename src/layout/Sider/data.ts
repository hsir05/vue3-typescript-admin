import type { MenuOption } from 'naive-ui'
import {
  SpeedometerOutline as SpeedomeIcon,
  AlbumsOutline as AlbumIcon,
  SettingsOutline as SettingsIcon,
  EaselOutline,
} from '@vicons/ionicons5'
import { renderIcon } from "@/utils/index"

export const menuOptions: MenuOption[] = [
  {
    label: '主页',
    key: 'home',
    path: '/dashboard',
    icon: renderIcon(SpeedomeIcon),
    
  },
  {
    label: '系统管理',
    key: 'bear-paw',
    icon: renderIcon(AlbumIcon),
    children: [
      {
        label: '字典管理',
        path: "/system/dict",
        key: 'protect-wild-animals-dict'
      },
      {
        label: '菜单管理',
        path: "/system/menus",
        key: 'protect-wild-animals'
      },
      {
        label: '用户管理',
        path: "/system/user",
        key: 'protect-wild-animals-user'
      },
      {
        label: '角色管理',
        path: "/system/role",
        key: 'protect-wild-role'
      }
    ]
  },
  {
    label: '运营基础配置',
    key: 'bear-operate',
    icon: renderIcon(EaselOutline),
    children: [
      {
        label: '车辆类型管理',
        path: "/operate/vehicle-type",
        key: 'operate-vehicle-type'
      },
      {
        label: '开通城市管理',
        path: "/operate/opening-urban",
        key: 'operate-opening-urban'
      },
      {
        label: '开通业务管理',
        path: "/operate/opening-businsess",
        key: 'operate-opening-businsess'
      },
      {
        label: '开通区域管理',
        path: "/operate/opening-area",
        key: 'operate-opening-area'
      }
    ]
  },
   {
    label: '设置管理',
    key: 'bear-setting',
    icon: renderIcon(SettingsIcon),
    children: [
      {
        label: '个人设置',
        path: "/setting/profile",
        key: 'protect-wild-animals-setting'
      }
    ]
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
]
