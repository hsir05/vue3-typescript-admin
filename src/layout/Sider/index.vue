<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="getCollapsed"
    :inverted="inverted"
  >
    <AppLogo v-if="navMode === 'vertical'" />
    <Menu :collapsed="getCollapsed" :inverted="inverted" />
  </n-layout-sider>
</template>
<script lang="ts">
import { defineComponent, computed, unref } from "vue";
import AppLogo from "../components/AppLogo/AppLogo.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import Menu from "./Menu.vue";
export default defineComponent({
  name: "LayoutSider",
  components: {
    AppLogo,
    Menu,
  },
  setup() {
    const { getCollapsed, navMode, navStyle } = useProjectSetting();

    const inverted = computed(() => unref(navStyle) !== "light");

    return {
      getCollapsed,
      navMode,
      inverted,
    };
  },
});
</script>
