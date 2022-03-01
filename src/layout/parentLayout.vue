<template>
  <n-layout has-sider content-style="height:100vh">
    <LayoutSider />
    <n-layout content-style="height:100vh">
      <LayoutHeader />
      <LayoutContent />
      <LayoutFooter />
    </n-layout>
  </n-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LayoutSider from "./Sider/index.vue";
import LayoutHeader from "./Header/index.vue";
import LayoutFooter from "./Footer/index.vue";
import LayoutContent from "./Content/index.vue";
export default defineComponent({
  name: "ParentLayout",
  components: {
    LayoutSider,
    LayoutHeader,
    LayoutFooter,
    LayoutContent,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss">
</style>
