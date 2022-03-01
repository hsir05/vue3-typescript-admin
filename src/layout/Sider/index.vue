<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="200"
    :collapsed="collapsed"
    show-trigger
    :inverted="true"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <AppLogo />
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="20"
     :inverted="true"
      :options="menuOptions"
      :default-expanded-keys="defaultExpandedKeys"
      accordion
    />
  </n-layout-sider>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { menuOptions } from "./data";
import AppLogo from "@/components/AppLogo/AppLogo.vue";
export default defineComponent({
  name: "LayoutSider",
  components: {
    AppLogo,
  },
  setup() {
    return {
      collapsed: ref(false),
      menuOptions,
      defaultExpandedKeys: ["fish", "braise"],
    };
  },
});
</script>
<style lang="scss">
.n-layout-sider {
    // background-color: #232324;
    // color: white;
}
</style>