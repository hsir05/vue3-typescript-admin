
export interface TableDataInter {
  realTimeOrderTopLimitId: string
  vehicleType: string,
  beforTime: null | string
  afterTime: null | string
  vhchileData: LimitItemInter[]
}

export interface AreaInter {
  areaCode: string
  areaLock: number
  areaName: string
  cityCode: string
}

export interface LimitItemInter {
  beforeUseVehicleMinute: number | null
  afterUseVehicleMinute: number | null
  vehicleType: string | null
  orderTopLimit: string | null
  areaCode?: string | null
}
export interface LimitOrderInter {
  realTimeOrderTopLimitList: LimitItemInter[];
  beforeUseVehicleMinute: number | null,
  afterUseVehicleMinute: number | null,
  areaCode: string | null
}

//  beforeUseVehicleMinute: null,
//           afterUseVehicleMinute: null,
//           vehicleType: null,
//           orderTopLimit: null,

export interface RemoteForm {
  afterUseVehicleMinute: number
  areaCode: string
  beforeUseVehicleMinute: number
  orderTopLimit: number
  realTimeOrderTopLimitId?: string
  vehicleType: string
}
