import { computed } from 'vue';
import { useAppProjectStore } from "@/store/modules/projectSetting"
// import { projectSetting } from '@/config/projectSetting';


export function useProjectSetting() {
    const projectStore = useAppProjectStore()

    const getCollapsed = computed(() => projectStore.projectSetting.collapsed);

    function setCollapsed(bool: boolean) {
        projectStore.setProjectSetting({ collapsed: bool });
    }

    const darkTheme = computed(() => projectStore.projectSetting.darkTheme)
    const appTheme = computed(() => projectStore.projectSetting.appTheme)

    function setDarkTheme(bool: boolean) {
        projectStore.setProjectSetting({ darkTheme: bool });
    }

    function setAppTheme(value: string) {
        projectStore.setProjectSetting({ appTheme: value });
    }

    return {
        getCollapsed,
        darkTheme,
        appTheme,

        setCollapsed,
        setDarkTheme,
        setAppTheme
    }

}