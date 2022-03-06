<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="200"
    :collapsed="getCollapsed"
    :inverted="false"
    mode="horizontal"
  >
    <AppLogo v-if="navMode === 'vertical'" />
    <Menu :collapsed="getCollapsed" :inverted="false" />
  </n-layout-sider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
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
    const { getCollapsed, navMode } = useProjectSetting();

    return {
      getCollapsed,
      navMode,
    };
  },
});
</script>
<style lang="scss">
.n-layout-sider {
}
</style>
