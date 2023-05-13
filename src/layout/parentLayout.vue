<template>
  <n-layout :has-sider="navMode === 'vertical'" content-style="height:100vh">
    <LayoutSider v-if="navMode === 'vertical'" />
    <LayoutHeader v-if="navMode === 'horizontal-mix'" />
    <n-layout :has-sider="navMode === 'horizontal-mix'">
      <LayoutHeader v-if="navMode === 'vertical' || navMode === 'horizontal'" />
      <LayoutSider v-if="navMode === 'horizontal-mix'" />
      <n-layout>
        <Tabs v-if="isTabs" :collapsed="getCollapsed" />
        <LayoutContent />
        <!-- <LayoutFooter v-if="showFooter" /> -->
      </n-layout>
    </n-layout>
  </n-layout>
</template>
<script lang="ts" setup>
import LayoutSider from "./Sider/index.vue";
import LayoutHeader from "./Header/index.vue";
// import LayoutFooter from "./Footer/index.vue";
import LayoutContent from "./Content/index.vue";
import Tabs from "./Tabs/index.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";

// const { isTabs, getCollapsed, navMode, showFooter } = useProjectSetting();
const { isTabs, getCollapsed, navMode } = useProjectSetting();
</script>
