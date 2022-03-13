<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div style="line-height: 0.8">
        <n-dropdown
          :on-select="densitySelect"
          v-model:value="tableSize"
          trigger="click"
          :options="densityOptions"
        >
          <n-icon size="18" class="cursor-pointer mr-15px">
            <ColumnIcon />
          </n-icon>
        </n-dropdown>
      </div>
    </template>
    <span>密度</span>
  </n-tooltip>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
import { ColumnHeightOutlined as ColumnIcon } from "@vicons/antd";
import { densityOptions } from "@/config/table";

const props = defineProps({
  tableSize: {
    type: String,
    default: "default",
  },
});
const { tableSize } = toRefs(props);

const emit = defineEmits(["handleDensity"]);
const densitySelect = (value: string) => {
  emit("handleDensity", value);
};
</script>
