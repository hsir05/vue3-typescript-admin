import { computed } from "vue";
import { useAppUserStore } from "@/store/modules/useUserStore";
import { IUserInfo } from "@/store/modules/type"


export function useUserInfo (){
    const userInfoStore = useAppUserStore()
    const userInfo = computed(() => userInfoStore.userInfo)
    const token = computed(() => userInfoStore.token)


    function setUserInfo(userInfo: IUserInfo){
        userInfoStore.setUserInfo(userInfo)
    }
    return {
        userInfo,
        token,

        setUserInfo
    }
}