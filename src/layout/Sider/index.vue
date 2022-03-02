<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="200"
    :collapsed="getCollapsed"
    :inverted="true"
  >
    <AppLogo />
    <n-menu
      :collapsed="getCollapsed"
      :collapsed-width="64"
      :collapsed-icon-size="20"
      :indent="24"
      :inverted="true"
      :options="menuOptions"
      accordion
    />
  </n-layout-sider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { menuOptions } from "./data";
import AppLogo from "@/components/AppLogo/AppLogo.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";

export default defineComponent({
  name: "LayoutSider",
  components: {
    AppLogo,
  },
  setup() {
    const { getCollapsed } = useProjectSetting();

    return {
      getCollapsed,
      menuOptions,
    };
  },
});
</script>
<style lang="scss">
.n-layout-sider {

}
</style>
