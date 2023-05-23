<template>
  <n-layout-content :content-style="getHeight">
    <RouterView>
      <template #default="{ Component, route }">
        <transition :name="getTransitionName" mode="out-in" appear>
          <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </RouterView>
  </n-layout-content>
</template>
<script lang="ts" setup>
import { computed, unref } from "vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";

const { isPageAnimate, pageAnimateType, showFooter, isTabs } = useProjectSetting();
//缓存
const keepAliveComponents: any = [];

const getTransitionName = computed(() => {
  return unref(isPageAnimate) ? unref(pageAnimateType) : "";
});

const getHeight = computed(() => {
  if (unref(showFooter) && unref(isTabs)) {
    return "height: calc(100vh - 115px)";
  } else if ((unref(showFooter) && !unref(isTabs)) || (!unref(showFooter) && unref(isTabs))) {
    return "height: calc(100vh - 115px)";
  } else {
    return "height: calc(100vh - 75px)";
  }
});
</script>
<style lang="scss">
.n-layout-content {
  padding: 5px;
  background-color: #f2f3f5;
  box-sizing: border-box;
  //   min-width: 1000px;
  //   overflow-y: scroll;
}
</style>
