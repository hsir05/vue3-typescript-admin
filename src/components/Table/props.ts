import { NDataTable } from 'naive-ui';
import { BasicColumn } from './type';

export const basicProps = {
    ...NDataTable.props,
    columns: {
        type: Array as PropType<BasicColumn[]>,
        default: () => [],
        required: true,
    },
    itemCount: {
        type: Number,
        default: () => null
    },
    isAddBtn: {
        type: Boolean,
        default: () => false
    },
    isBatchBtn: {
        type: Boolean,
        default: () => false
    },
    batchText: {
        type: String,
        default: () => '批量删除'
    }
    
}