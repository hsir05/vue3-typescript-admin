
export const pageSizes = [
  { label: "每页10条", value: 10 },
  { label: "每页20条", value: 20 },
  { label: "每页30条", value: 30 },
  { label: "每页50条", value: 50 },
];

export const densityOptions = [
    { type: 'menu', label: '紧凑', key: 'small' },
    { type: 'menu', label: '默认', key: 'medium' },
    { type: 'menu', label: '宽松', key: 'large' },
];

export const uploadConfig = {
    fileType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
    maxSize: 1,
    file: 'file'
}