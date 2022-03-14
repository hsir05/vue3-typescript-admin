import { unref, reactive, computed } from "vue";
import { PaginationProps } from "@/interface/table/table"

export function useTable (){
    const pagParam = reactive({
      page: 1,
      pageSize: 10,
     
    });

    const getPagination = computed(() => {
        return {
            ...unref(pagParam),
        }
    })

    function setPagination(info: Partial<PaginationProps>){
       
        const { page, pageSize } = { ...unref(getPagination), ...info }

        pagParam.page = page
        pagParam.pageSize = pageSize
    }

    return {
        getPagination,
        setPagination
    }
}