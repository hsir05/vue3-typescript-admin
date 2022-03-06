import { computed } from 'vue';
import { useAppProjectStore } from "@/store/modules/projectSetting"
// import { projectSetting } from '@/config/projectSetting';


export function useProjectSetting() {
    const projectStore = useAppProjectStore()

    const getCollapsed = computed(() => projectStore.collapsed);

    function setCollapsed(bool: boolean) {
        projectStore.setProjectSetting({ collapsed: bool });
    }

    const darkTheme = computed(() => projectStore.darkTheme)
    const appTheme = computed(() => projectStore.appTheme)

    function setDarkTheme(bool: boolean) {
        projectStore.setProjectSetting({ darkTheme: bool });
    }

    function setAppTheme(value: string) {
        projectStore.setProjectSetting({ appTheme: value });
    }

    const isPageAnimate = computed(() => projectStore.isPageAnimate)
    const pageAnimateType = computed(() => projectStore.pageAnimateType)
    const isBreadcrumb = computed(() => projectStore.isBreadcrumb)  
    const isRefresh = computed(() => projectStore.isRefresh) 
    const navMode = computed(() => projectStore.navMode) 

    function setNavMode(value: string) {
        projectStore.setProjectSetting({ navMode: value });
    }


    return {
        getCollapsed,
        darkTheme,
        appTheme,
        isPageAnimate,
        pageAnimateType,
        isBreadcrumb,
        isRefresh,
        navMode,

        setCollapsed,
        setDarkTheme,
        setAppTheme,
        setNavMode
    }

}