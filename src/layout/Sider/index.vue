<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <AppLogo />
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :render-icon="renderMenuIcon"
      :expand-icon="expandIcon"
    />
  </n-layout-sider>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { menuOptions } from "./data";
import type { MenuOption } from "naive-ui";
import { h } from "vue";
import { NIcon } from "naive-ui";
import { BookmarkOutline, CaretDownOutline } from "@vicons/ionicons5";
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
      renderMenuLabel(option: MenuOption) {
        if ("href" in option) {
          return h(
            "a",
            { href: option.href, target: "_blank" },
            option.label as string
          );
        }
        return option.label as string;
      },
      renderMenuIcon(option: MenuOption) {
        // 渲染图标占位符以保持缩进
        if (option.key === "sheep-man") return true;
        // 返回 falsy 值，不再渲染图标及占位符
        if (option.key === "food") return null;
        return h(NIcon, null, { default: () => h(BookmarkOutline) });
      },
      expandIcon() {
        return h(NIcon, null, { default: () => h(CaretDownOutline) });
      },
    };
  },
});
</script>
<style lang="scss">
.n-layout-sider {
}
</style>
