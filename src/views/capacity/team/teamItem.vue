<template>
  <div class="team-info-wrap flex-align-start">
    <div class="team-info">
      <p class="team-info-item">
        <span class="team-info-item-label">班级编码:</span>
        <span class="team-info-item-text">{{ item.operationCompanyDriverClazzEntry }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">班长名称:</span>
        <span class="team-info-item-text">{{ item.operationCompanyDriverClazzName }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">班长工号:</span>
        <span class="team-info-item-text">{{ item.number ? item.number : "暂无" }}</span>
      </p>
      <p class="team-info-item">
        <span class="team-info-item-label">添加时间:</span>
        <span class="team-info-item-text">{{
          dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
        }}</span>
      </p>
      <div class="team-info-item flex-align-start">
        <span class="team-info-item-label">操作:</span>
        <div class="team-info-item-text item-btn">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button size="tiny" type="primary" @click="handleSee">
                <template #icon>
                  <n-icon :component="EyeIcon" />
                </template>
              </n-button>
            </template>
            详情
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button size="tiny" type="primary" @click="handleMember" class="ml-10px">
                <template #icon>
                  <n-icon :component="PeopleIcon" />
                </template>
              </n-button>
            </template>
            成员管理
          </n-tooltip>
        </div>
      </div>
    </div>
    <div class="ml-10px pt-15px avatar">
      <n-image width="120" :src="item.avatar ? item.avatar : avator" />
      <p class="monitor-title">班长照片</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EyeOutline as EyeIcon, PeopleOutline as PeopleIcon } from "@vicons/ionicons5";
import { toRefs } from "vue";
import avator from "@/assets/image/default-avatar.png";
import { ItemInter } from "./type";
import dayjs from "dayjs";
const props = defineProps({
  item: {
    type: Object as PropType<ItemInter>,
    require: true,
    default: () => {},
  },
});
const { item } = toRefs(props);

const emit = defineEmits(["on-see", "on-member"]);

const handleSee = () => {
  emit("on-see");
};
const handleMember = () => {
  emit("on-member");
};
</script>
<style lang="scss" scoped>
.team-info-wrap {
  border: 1px solid #efeff5;
  width: 24%;
  min-width: 365px;
  max-width: 33%;
  margin: 5px 4px;
  .team-info-item {
    border: 1px solid #efeff5;
    margin: -1px;
    border-radius: 4px;
    overflow: hidden;
  }
  .item {
    display: inline-block;
    padding: 5px;
    min-width: 80px;
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
  .monitor-title {
    text-align: center;
  }
  .item-btn {
    display: inline-flex;
    align-content: center;
    justify-content: center;
  }
}
.avatar {
  margin: 0 auto;
}
</style>
