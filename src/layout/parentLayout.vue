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
      <n-layout-footer >CopyRight © 2022 甘肃诚诚网络技术有限公司 · 技术支持</n-layout-footer>
    </n-layout>
  </n-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LayoutSider from "./sider/Sider.vue";
import LayoutHeader from "./header/Header.vue";
export default defineComponent({
  name: "ParentLayout",
  components: {
    LayoutSider,
    LayoutHeader,
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

.n-layout-sider {
}

.n-layout-content {
}
</style>
