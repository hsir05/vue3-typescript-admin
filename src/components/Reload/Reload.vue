<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <!-- <n-icon size="18" class="setting-icon mr-15px cursor-pointer" @click="reloadPage">
        <ReloadIcon />
      </n-icon> -->

      <n-button type="primary" @click="reloadPage">
        <!-- <template #icon><n-icon><ReloadIcon /></n-icon> </template> -->
        刷新数据
      </n-button>
    </template>
    {{ title }}
  </n-tooltip>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
// import { Reload as ReloadIcon } from "@vicons/ionicons5";

const props = defineProps({
  title: {
    type: String,
    default: "刷新",
  },
});
const { title } = toRefs(props);

const emit = defineEmits(["reloadData"]);
const reloadPage = () => {
  emit("reloadData");
};
</script>
