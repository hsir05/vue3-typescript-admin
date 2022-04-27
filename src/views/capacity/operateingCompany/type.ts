export interface tableDataItem {
  operationCompanyId?: string | null;
  operationCompanyCode: string | null;
  operationCompanyName: string | null;
  operationCityCode: string | null;
  unifiedSocialCreditCode: string | null;
  operationCompanyAddress: string | null;
  operationCityName: string | null;
  operationCompanyManagerName: string | null;
  operationCompanyManagerGender: number | null;
  lng: number | null;
  lat: number | null;
  allowAgency?: number | null;
  operationCompanyAgencyList?: string[]
  operationCompanyManagerPhone: string | null;
}

