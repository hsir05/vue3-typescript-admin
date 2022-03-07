<template>
  <n-layout :has-sider="navMode === 'vertical'" content-style="height:100vh">
    <LayoutSider v-if="navMode === 'vertical'" />
    <LayoutHeader v-if="navMode === 'horizontal-mix'" />
    <n-layout :has-sider="navMode === 'horizontal-mix'">
      <LayoutHeader v-if="navMode === 'vertical' || navMode === 'horizontal'" />
      <LayoutSider v-if="navMode === 'horizontal-mix'" />
      <n-layout>
        <LayoutContent />
        <LayoutFooter />
      </n-layout>
    </n-layout>
  </n-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LayoutSider from "./Sider/index.vue";
import LayoutHeader from "./Header/index.vue";
import LayoutFooter from "./Footer/index.vue";
import LayoutContent from "./Content/index.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
export default defineComponent({
  name: "ParentLayout",
  components: {
    LayoutSider,
    LayoutHeader,
    LayoutFooter,
    LayoutContent,
  },
  setup() {
    const { navMode } = useProjectSetting();

    return {
      navMode,
    };
  },
});
</script>
