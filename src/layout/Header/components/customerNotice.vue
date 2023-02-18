<template>
  <div class="notice-box">
    <ul class="notice">
      <li
        v-for="(item, index) in notice"
        :key="item.id"
        :class="[
          'notice-item',
          item.alreadyRead === 1 ? 'active' : '',
          index === notice.length - 1 ? 'border-b-0' : '',
        ]"
        @click="handleRead(item.id, index)"
      >
        <p class="notice-type pb-5px font-500 text-16px">{{ item.eventType }}</p>
        <p class="mb-5px notice-content text-14px">{{ item.noticeContent }}</p>
        <span class="notice-time text-12px">{{
          dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
        }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";

import dayjs from "dayjs";

interface INoticeData {
  id: string;
  noticeContent: string;
  eventType: string;
  createTime: number;
  alreadyRead: number;
}
const notice = ref<INoticeData[]>([]);
onMounted(() => {
  getData();
});

const getData = () => {
  console.log("red");
};

const handleRead = (id: string, index: number) => {
  console.log(id, index);
};
</script>
<style lang="scss" scoped>
.notice-box {
  .notice {
    overflow-y: scroll;
    height: 354px;
    position: relative;
  }

  .notice-item {
    border-bottom: 1px solid $borderColor;
    color: #333639;
    padding: 10px 20px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: rgba(246, 246, 246, 1);
    }
  }
  .notice-content {
  }
  .active {
    opacity: 0.7;
  }

  .border-0 {
    border-bottom: 0;
  }
}
</style>
