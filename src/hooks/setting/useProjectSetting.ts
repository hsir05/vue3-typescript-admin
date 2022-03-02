import { computed } from 'vue';
import { useAppProjectStore } from "@/store/modules/projectSetting"


export function useProjectSetting() {
    const projectStore = useAppProjectStore()

    const getCollapsed = computed(() => projectStore.projectSetting.collapsed);

    function setCollapsed(value: boolean) {
        projectStore.setProjectSetting({ collapsed: value });
    }


    return {
        getCollapsed,
        setCollapsed,
    }

}