<template>
  <div class="team-info-wrap flex-align-start mb-10px">
    <div class="team-info">
      <p class="team-info-item">
        <span class="team-info-item-label">班长工号:</span>
        <span class="team-info-item-text">{{ item.number }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">班长名称:</span>
        <span class="team-info-item-text">{{ item.name }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">性别:</span>
        <span class="team-info-item-text">{{ item.sex === 1 ? "男" : "女" }}</span>
      </p>
    </div>
    <div class="ml-10px pt-5px">
      <n-image width="90" :src="item.avatar" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface itemState {
  name: string;
  number: string;
  sex: number;
  avatar: string;
}
const props = defineProps({
  item: {
    type: Object as PropType<itemState>,
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
