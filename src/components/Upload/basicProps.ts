import type { PropType } from "vue";
import { NUpload } from "naive-ui";
import { useAppUserStore } from "@/store/modules/useUserStore";

const userStore = useAppUserStore();

interface uploadHeaders {
  Authorization: String;
}

export const basicProps = {
  ...NUpload.props,
  accept: {
    type: String,
    default: ".jpg,.png,.jpeg,.svg,.gif",
  },
  action: {
    type: String,
    default: import.meta.env.VITE_GLOB_UPLOAD_URL,
  },
  headers: {
    type: Object as PropType<uploadHeaders>,
    default: () =>  { 
        let obj = {Authorization: userStore.getToken}
        return obj
     }
  },
  helpText: {
    type: String as PropType<string>,
    default: "",
  },
  maxSize: {
    type: Number as PropType<number>,
    default: 2,
  },
  multiple: {
    type: Boolean,
    default: () => false,
  },
  max: {
    type: Number as PropType<number>,
    default: 1,
  },
  maxNumber: {
    type: Number as PropType<number>,
    default: 1,
  },
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  width: {
    type: Number as PropType<number>,
    default: 104,
  },
  height: {
    type: Number as PropType<number>,
    default: 104, //建议不小于这个尺寸 太小页面可能显示有异常
  },
};
