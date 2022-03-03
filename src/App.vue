<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { zhCN, dateZhCN, darkTheme } from "naive-ui";
import { AppProvider } from "@/components/Application";
import { useAppProjectStore } from "@/store/modules/projectSetting";
import { lighten } from "@/utils/index";
const projectStore = useAppProjectStore();

const getDarkTheme = computed(() =>
  projectStore.projectSetting.darkTheme ? darkTheme : undefined
);

const getThemeOverrides = computed(() => {
  const appTheme = projectStore.projectSetting.appTheme;
  const lightenStr = lighten(projectStore.projectSetting.appTheme, 6);
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
    },
    LoadingBar: {
      colorLoading: appTheme,
    },
  };
});
</script>
