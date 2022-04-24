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
  openBusinessId: string | null;
  areaCode: string | null;
  orderType: string | null;
  vehicleTypeId: string | null;
  chargeRuleBaseId: string | null;
  chargeRuleMileageId: string | null;
  chargeRuleDurationId: string | null;
  chargeRuleCancelId: string | null;
  chargeRuleWaitId: string | null;
  chargeRuleFloatHolidayId: string | null;
  chargeRuleFloatWorkdayId: string | null;
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
