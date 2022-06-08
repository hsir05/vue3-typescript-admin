
export interface loginCredentialProps {
    loginCredentialState: number
    loginAccount: string | null
}
 export interface allowCompanyState{
    operationCompanyId: string
    operationCompanyName: string
}

export interface itemState {
  operationCompanyAgencyId?: string | null;
//   loginCredential: loginCredentialProps;
  operationCompanyAgencyName: null | string;
  operationCompanyAgencyContactName: null | string;
  operationCompanyAgencyContactGender: null | number;
  operationCompanyAgencyContactPhone: null | string;
  createTime?: null | string;
}


export interface tableDataItem extends itemState {
   companyLoginCredential: loginCredentialProps;
  operationCompanyList: allowCompanyState[] | null
}

export interface formState extends itemState {
  operationCompanyIds: null | string[] 
  loginCredential: string | null

}