export interface tableDataItem {
  id?: string;
  name: null | string;

  specialDiscount: number | null;
  specialLimit: number | null;

  fastlDiscount: number | null;
  fastlLimit: number | null;

  taxilDiscount: number | null;
  taxilLimit: number | null;
  descript: null | string;
  status: number | null;
  type: string | null;
}
