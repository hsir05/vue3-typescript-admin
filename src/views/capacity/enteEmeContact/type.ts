
export interface tableDataItem {
    operationCompanyEmergencyContactId: string;
    operationCompanyEmergencyContactName: string | null;
    operationCompanyEmergencyContactPhone: null| string;
    operationCompanyEmergencyContactEmail: string | null;
    dutyTimeBegin: string | null; 
    dutyTimeEnd: string | null;
    operationCompanyId: string | null;
    createTime?: string | null;
}

export interface FormInter {
   operationCompanyEmergencyContactId?: string | null;
  operationCompanyId: string | null;
  operationCompanyEmergencyContactName: string | null;
  operationCompanyEmergencyContactPhone: string | null;
  operationCompanyEmergencyContactEmail: string | null;
  createTime?: string | null;
  dutyTimeBegin: string | null;
  dutyTimeEnd: string | null;
}
