export interface ItemInter {
  operationCompanyDriverClazzId: string;
  operationCompanyDriverClazzEntry: string;
  operationCompanyDriverClazzName: string;
  operationCompanyLeaderClazzDriver?:MemberItemIter
  operationCompanyName: string
  number: number;
  createTime: string;
  avatar: string;
}

export interface MemberItemIter {
    driverFullName: string
    driverGender: string
    driverNo: string
    driverPhotoPath: string
    driverIdentificationPhoto: string
    operationCompanyDriverId:string
}

export interface DataItemInter {
    leaderDriver:MemberItemIter
    members:MemberItemIter[]
}