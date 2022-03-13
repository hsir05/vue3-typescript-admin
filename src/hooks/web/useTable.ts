import { ref, toRaw, unref, reactive, computed, ComputedRef } from "vue";
import { PaginationProps } from "@/interface/table/table"

export function useTable (){
    const pagParam = reactive({
      page: 1,
      pageSize: 10,
     
    });

    // const  showSizeizePicker = true
    // const  showquickjumper = true

    const getPagination = computed(() => {
        return {
            ...unref(pagParam),
        }
    })

    function setPagination(info: Partial<PaginationProps>){
        console.log(unref(getPagination));
        console.log(info);
        console.log({...unref(getPagination), ...info});
    }

    return {
        getPagination,
        setPagination
    }
}