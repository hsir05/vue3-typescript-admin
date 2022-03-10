// import { NButton } from 'naive-ui';

export interface ActionItem  {
  onClick?: Fn;
  label?: string;
  color?: 'success' | 'error' | 'warning';
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean; 
  divider?: boolean;
  confirm?: boolean;
  auth: string[],
  ifShow?: boolean | ((action: ActionItem) => boolean);
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  onPositiveClick: Fn;
  onNegativeClick?: Fn;
  icon?: string;
}