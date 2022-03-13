import type { PropType } from 'vue';
import type { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface';
// import { propTypes } from '@/utils/propTypes';
// import { BasicColumn } from './types/table';
import { NDataTable } from 'naive-ui';

export interface tableDataItem {
  id: string;
  name: string;
  sort: number;
  code: string;
  status: number;
}

export interface BasicColumn extends TableBaseColumn {
  auth?: string[];
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean);
}

export const basicProps = { 
  ...NDataTable.props, // 这里继承原 UI 组件的 props
  size: { 
    type: String,
    default: 'medium',
  },
  dataSource: {
    type: [Object],
    default: () => [],
  },
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
    required: true,
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((record: any) => string)>,
    default: undefined,
  },
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
//   canResize: propTypes.bool.def(true),
//   resizeHeightOffset: propTypes.number.def(0),
};