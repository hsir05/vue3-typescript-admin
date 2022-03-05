<template>
  <n-layout-content>
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
<script lang="ts">
import { defineComponent, computed, unref } from "vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";

export default defineComponent({
  name: "LayoutContent",
  setup() {
    const { isPageAnimate, pageAnimateType } = useProjectSetting();
    //缓存
    const keepAliveComponents: any = [];

    const getTransitionName = computed(() => {
      return unref(isPageAnimate) ? unref(pageAnimateType) : "";
    });

    return {
      keepAliveComponents,
      getTransitionName,
    };
  },
});
</script>
<style lang="scss">
.n-layout-content {
  padding: 10px;
  height: calc(100vh - 113px);
  background-color: #f2f3f5;
}
</style>
