<template>
  <n-layout has-sider content-style="height:100vh">
    <LayoutSider />
    <n-layout content-style="height:100vh">
      <LayoutHeader />
      <n-layout-content
        content-style="padding: 24px;height: calc(100vh - 100px)"
      >
        <RouterView />
      </n-layout-content>
      <LayoutFooter />
    </n-layout>
  </n-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LayoutSider from "./Sider/index.vue";
import LayoutHeader from "./Header/index.vue";
import LayoutFooter from "./Footer/index.vue"
export default defineComponent({
  name: "ParentLayout",
  components: {
    LayoutSider,
    LayoutHeader,
    LayoutFooter,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss">

.n-layout-footer {
  padding: 15px 24px;
}



.n-layout-content {
}
</style>
