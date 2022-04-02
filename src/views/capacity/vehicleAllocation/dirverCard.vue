<template>
  <div class="driver-item flex-align-start mr-10px">
    <n-image
      width="90"
      src="http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png"
    />
    <div class="driver-info ml-10px">
      <p><span class="lable mr-5px">工号:</span>{{ driverInfo.number }}</p>
      <p><span class="lable mr-5px">姓名:</span>{{ driverInfo.name }}</p>
      <p><span class="lable mr-5px">性别:</span>{{ driverInfo.sex }}</p>
      <p>
        <span class="lable mr-5px">操作:</span>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="tiny" type="primary" @click="handle">
              <template #icon>
                <n-icon :component="ApiOutIcon" />
              </template>
            </n-button>
          </template>
          取消分配
        </n-tooltip>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ApiFilled as ApiOutIcon } from "@vicons/antd";

import { toRefs } from "vue";

interface driverInfoState {
  number: string | number;
  name: string;
  sex: string | number;
  id: number | string;
}

const props = defineProps({
  driverInfo: {
    type: Object as PropType<driverInfoState>,
    require: true,
    default: () => {},
  },
});
const { driverInfo } = toRefs(props);

const emit = defineEmits(["on-update"]);

const handle = () => {
  emit("on-update", driverInfo.value.id);
};
</script>
<style lang="scss" scoped>
.driver-item {
  padding: 5px;
  width: 50%;
  border: 1px solid #efeff5;
  .lable {
    // font-weight: 600;
  }
}
.img-box {
  width: 100px;
  border-radius: 4px;
}
</style>
