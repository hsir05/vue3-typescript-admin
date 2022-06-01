export const data = [
  {
    id: "1123",
    name: "主页",
    icon: 'SpeedomeIcon',
    sort: 1,
    auth: 'dashboard',
    component: '/dashboard/dashboard',
    code: "AFT033000",
    status: 1,
  },
 {
    id: "1122223",
    name: "系统管理",
    icon: 'AlbumIcon',
    sort: 1,
    auth: 'system',
    component: '/system/system',
    code: "AFT0330S00",
    status: 1,
    children: [
        {
            id: "11222233333",
            name: "子典管理",
            icon: '',
            sort: 1,
            auth: 'system_dict',
            component: '/system/dict',
            code: "AFT033022S00",
            status: 1,
        }
    ]
  },
];
