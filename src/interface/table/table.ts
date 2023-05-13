import { DropdownOption } from 'naive-ui';

// export interface ActionItem {
//   onClick?: Fn;
//   label?: string;
//   color?: "success" | "error" | "warning";
//   icon?: string;
//   popConfirm?: PopConfirm; 
//   disabled?: boolean;
//   confirm?: boolean;
//   auth: string[]; 
//   isIconBtn?: boolean;
//   isShow?: boolean;
//   ifShow?: boolean | ((action: ActionItem) => boolean);
// }
export interface ActionItem {
    onClick?: Fn
    label?: string
    color?: 'success' | 'error' | 'warning'
    icon?: string
    size: "small" | "medium" | "large" | undefined,
    popConfirm?: PopConfirm
    disabled?: boolean
    confirm?: boolean
    auth: string[]
    isIconBtn?: boolean
    showBtn?: boolean
    ifShow?: boolean | ((action: ActionItem) => boolean)
}
export interface DropDownActions {
    size?: string
    label?: string
    color?: string
    actions: ActionItem[] | DropdownOption[]
}
export interface PopConfirm {
    title: string;
    okText?: string;
    cancelText?: string;
    onPositiveClick: Fn;
    onNegativeClick?: Fn;
    icon?: string;
}

export interface PaginationProps {
    page?: number;
    //   pageCount?: number;
    pageSize?: number;
    //   pageSizes?: number[];
    //   showSizePicker?: boolean;
    //   showQuickJumper?: boolean;
}
