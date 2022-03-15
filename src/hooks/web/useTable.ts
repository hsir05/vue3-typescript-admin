import { unref, toRefs,reactive, ref, toRef, toRaw, computed } from "vue";
import { PaginationProps } from "@/interface/table/table"

const pagination = {
    page: 1,
    pageSize: 10,
}

export function useTable (){
    const configRef = ref<PaginationProps>({});

    const getPaginationCon = computed(() => {
        return {
            page: pagination.page,
            pageSize: pagination.pageSize
        }
    })

    const getPagination = computed(() => {
        console.log({...unref(getPaginationCon), ...toRaw(unref(configRef))});
        
        return {...unref(getPaginationCon), ...toRaw(unref(configRef))}
    })
    
    function setPagination(info: Partial<PaginationProps>): Promise<void>{
       return Promise.resolve().then(() => {
            configRef.value = {
                ...unref(getPaginationCon),
                ...info
            }
       })
    }

    return {
        getPagination,
        getPaginationCon,
        setPagination
    }
}