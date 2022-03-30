export interface tableItemProps {
    id: string | number
}

export interface tableDataItem {
  id?: string | null;
  areaName: string | null;
  areaCode: string | null;
  lock?: number | null;
}

export interface formState{
    operateCity: null | string
}