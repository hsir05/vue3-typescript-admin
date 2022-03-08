import { computed } from "vue";
import { useAppProjectStore } from "@/store/modules/useProjectSettingStore";
import { ProjectSettingState } from "@/interface/projectSetting";

export function useProjectSetting() {
  const projectStore = useAppProjectStore();

  const getCollapsed = computed(() => projectStore.collapsed);

  const darkTheme = computed(() => projectStore.darkTheme);
  const appTheme = computed(() => projectStore.appTheme);

  const isPageAnimate = computed(() => projectStore.isPageAnimate);
  const pageAnimateType = computed(() => projectStore.pageAnimateType); 
  const isTabs = computed(() => projectStore.isTabs);
  const isBreadcrumb = computed(() => projectStore.isBreadcrumb);
  const isRefresh = computed(() => projectStore.isRefresh);
  const navMode = computed(() => projectStore.navMode); 
  const navStyle = computed(() => projectStore.navStyle); 
  const showFooter = computed(() => projectStore.showFooter);

  function setProject(config: Partial<ProjectSettingState>){
      projectStore.setProjectSetting(config);
  }

  return {
    getCollapsed,
    darkTheme,
    appTheme,
    isTabs,
    isPageAnimate,
    pageAnimateType,
    isBreadcrumb,
    isRefresh,
    navMode,
    navStyle,
    showFooter,

    setProject
  };
}
