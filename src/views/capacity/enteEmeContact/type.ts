
export interface tableDataItem {
    id?: string | number;
    enterpriseName: string | null;
    enterpriseNum: null| number;
    name: string | null;
    phone: string | null;
    email: string | null;
    time_start: number | null; 
    time_end: number | null;
    create_time?: string | null;
}