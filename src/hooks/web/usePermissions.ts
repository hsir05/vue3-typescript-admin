import { useAppUserStore } from '@/store/modules/useUserStore';


export function usePermission(){
    const userStore = useAppUserStore()



    function hasPermission(auth: string[]): boolean {
      if (!auth || !auth.length) return true;
      return userStore.getPermissions.some((item) => {
        return auth.includes(item);
      });
    }


    return {
        hasPermission
    }
}