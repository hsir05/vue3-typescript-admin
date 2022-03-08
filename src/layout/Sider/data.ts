import type { MenuOption } from 'naive-ui'
import {
  SpeedometerOutline as SpeedomeIcon,
  AlbumsOutline as AlbumIcon
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
      }
    ]
  }
]
