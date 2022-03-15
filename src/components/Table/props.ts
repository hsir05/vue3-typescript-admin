import { NDataTable } from 'naive-ui';
import { BasicColumn } from './type';

export const basicProps = {
    ...NDataTable.props,
    columns: {
        type: Array as PropType<BasicColumn[]>,
        default: () => [],
        required: true,
    }
}