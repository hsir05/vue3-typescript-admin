import { computed } from "vue";
import { useAppProjectStore } from "@/store/modules/projectSetting";
import { ProjectSettingState } from "@/interface/projectSetting";

export function useProjectSetting() {
  const projectStore = useAppProjectStore();

  const getCollapsed = computed(() => projectStore.collapsed);

  function setCollapsed(bool: boolean) {
    projectStore.setProjectSetting({ collapsed: bool });
  }

  const darkTheme = computed(() => projectStore.darkTheme);
  const appTheme = computed(() => projectStore.appTheme);

  function setDarkTheme(bool: boolean) {
    projectStore.setProjectSetting({ darkTheme: bool });
  }

  const isPageAnimate = computed(() => projectStore.isPageAnimate);
  const pageAnimateType = computed(() => projectStore.pageAnimateType);
  const isBreadcrumb = computed(() => projectStore.isBreadcrumb);
  const isRefresh = computed(() => projectStore.isRefresh);
  const navMode = computed(() => projectStore.navMode); 
  const navStyle = computed(() => projectStore.navStyle);
  const showFooter = computed(() => projectStore.showFooter);

  function setBreadcrumb(bool: boolean) {
    projectStore.setProjectSetting({ isBreadcrumb: bool });
  }

  function setProject(config: Partial<ProjectSettingState>){
      projectStore.setProjectSetting(config);
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
    navStyle,
    showFooter,

    setCollapsed,
    setDarkTheme,
    setBreadcrumb,
    setProject
  };
}
