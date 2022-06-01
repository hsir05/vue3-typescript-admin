<template>
  <div class="team-info-wrap flex-align-start mb-10px">
    <div class="team-info">
      <p class="team-info-item">
        <span class="team-info-item-label">工号:</span>
        <span class="team-info-item-text">{{ item.driverNo }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">名称:</span>
        <span class="team-info-item-text">{{ item.driverFullName }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">性别:</span>
        <span class="team-info-item-text">{{ item.driverGender === 1 ? "男" : "女" }}</span>
      </p>
    </div>
    <div class="ml-10px pt-5px">
      <n-image width="90" :src="item.driverPhotoPath" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
import { MemberItemIter } from "./type";
const props = defineProps({
  item: {
    type: Object as PropType<MemberItemIter>,
    require: true,
    default: () => {},
  },
});
const { item } = toRefs(props);
</script>

<style lang="scss" scoped>
.team-info-wrap {
  border: 1px solid #efeff5;
  width: 365px;
  .team-info-item {
    border: 1px solid #efeff5;
    margin: -1px;
    border-radius: 4px;
    overflow: hidden;
  }
  .item {
    display: inline-block;
    padding: 5px 10px;
    min-width: 90px;
    text-align: center;
  }
  .team-info-item-label {
    background-color: #fafafc;
    @extend .item;
  }
  .team-info-item-text {
    width: 130px;
    @extend .item;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
}
</style>
