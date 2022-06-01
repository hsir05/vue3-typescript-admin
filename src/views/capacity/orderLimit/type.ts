

export interface vhchileDataState {
    vehicleType: null | string
    orderLimit: null | string
}

export interface tableDataItem{
    id?: string
    beforTime: null | string 
    afterTime: null | string
    vhchileData: vhchileDataState[]
}