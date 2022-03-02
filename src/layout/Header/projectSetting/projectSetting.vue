<template>
  <n-drawer v-model:show="isDrawer" :width="502" placement="right">
    <n-drawer-content title="项目配置">
      《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "ProjectSetting",
  setup() {
    const isDrawer = ref(false);

    function openDrawer() {
      isDrawer.value = true;
    }

    function closeDrawer() {
      isDrawer.value = false;
    }

    return {
      isDrawer,
      openDrawer,
      closeDrawer,
    };
  },
});
</script>
