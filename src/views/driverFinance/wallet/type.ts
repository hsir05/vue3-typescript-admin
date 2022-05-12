export interface TableItemInter {
  driverWalletId: string;
  createTime: string;
  driverGender: number;
  reserveBalanceLimit: number;
}

export interface FormInter {
  driverWalletId: string | null;
  reserveBalanceLimit: number | null;
}

export interface RecordTableItemInter {
  driverWalletDealRecordId: string;
  dealTime: string;
  dealType: number;
  dealWay: string;
  dealNote: string;
}
export interface RecordFormInter {
  driverWalletIdEq: string | null;
  dealTypeEq: string | null;
  dealTimeGe: string | null;
  dealTimeLe: string | null;
}

export interface WalletInfoInter {
  createTime: number | null;
  driverNo: string | null;
  driverFullName: string | null;
  driverPhone: string | null;
  totalBalance: string | null;
  frozenAmount: number | null;
  availablealance: number | null;
  reserveBalanceLimit: number | null;
}

export interface DealWayIner {
  [symbol: string]: string;
}
