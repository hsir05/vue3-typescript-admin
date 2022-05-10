<template>
  <div class="driver-item flex-align-start mr-10px">
    <n-image
      width="110"
      :fallback-src="defaultAvatar"
      :src="driverInfo.driverPhotoPath || defaultAvatar"
    />
    <div class="driver-info ml-15px">
      <p><span class="lable mr-5px">工号:</span>{{ driverInfo.driverNo }}</p>
      <p class="mt-5px"><span class="lable mr-5px">姓名:</span>{{ driverInfo.driverFullName }}</p>
      <p class="mt-5px"><span class="lable mr-5px">性别:</span>{{ driverInfo.driverGender }}</p>
      <p class="mt-5px">
        <span class="lable mr-5px">操作:</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="tiny" type="primary" @click="handle">
              <template #icon>
                <n-icon :component="isBind ? ApiOutIcon : LinkIcon" />
              </template>
            </n-button>
          </template>
          {{ isBind ? "取消分配" : "分配车辆" }}
        </n-tooltip>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ApiFilled as ApiOutIcon } from "@vicons/antd";
import { LinkOutline as LinkIcon } from "@vicons/ionicons5";
import defaultAvatar from "@/assets/image/default-avatar.png";
import { toRefs } from "vue";
import { DriverInfoInter } from "./type";

const props = defineProps({
  driverInfo: {
    type: Object as PropType<DriverInfoInter>,
    require: true,
    default: () => {},
  },
  isBind: {
    type: Boolean,
    require: true,
  },
});
const { driverInfo } = toRefs(props);
console.log(driverInfo);

const emit = defineEmits(["on-update"]);

const handle = () => {
  console.log(driverInfo.value);

  emit("on-update", driverInfo.value.operationCompanyDriverId || driverInfo.value.driverId);
};
</script>
<style lang="scss" scoped>
.driver-item {
  padding: 5px;
  width: 50%;
  border: 1px solid #efeff5;
}

.img-box {
  width: 100px;
  border-radius: 4px;
}
</style>
