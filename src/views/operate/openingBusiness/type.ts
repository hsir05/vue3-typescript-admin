export interface tableItemProps {
  id: string | number;
}

export interface tableDataItem {
  id?: string | null;
  areaName: string | null;
  areaCode: string | null;
  lock?: number | null;
}

export interface formState {
  operateCity: null | string;
}

export interface busTypeState {
  specialEconomic: number[];
  specialComfort: number[];
  specialBus: number[];
  specialPremium: number[];
  fastEconomic: number[];
  fastComfort: number[];
  fastBus: number[];
  fastPremium: number[];
  taxi: number[];
}
