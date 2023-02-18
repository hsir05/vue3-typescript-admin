<template>
  <n-modal v-model:show="showModal">
    <div class="notice-card">
      <div class="notice-tabs">
        <n-tabs
          type="line"
          @update:value="handleUpdateValue"
          :bar-width="120"
          justify-content="center"
          :tab-style="{ width: '100px', justifyContent: 'center' }"
        >
          <n-tab name="customerNotice" :bar-width="160">消息</n-tab>
          <n-tab name="shopNotice">通知</n-tab>
          <n-tab name="orderNotice">待办</n-tab>
        </n-tabs>
      </div>
      <component :is="tabs[currentCom]" />

      <div class="btn-list">
        <span class="cursor-pointer" @click="handleReaded">全部已读</span>
        <n-divider vertical />
        <span class="cursor-pointer" @click="more">查看更多</span>
      </div>
    </div>
  </n-modal>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { Component } from "vue";
import CustomerNotice from "./components/customerNotice.vue";
import ShopNotice from "./components/shopNotice.vue";
import OrderNotice from "./components/orderNotice.vue";
import AfterNotice from "./components/afterNotice.vue";

interface ITabsCom {
  [Symbol: string]: Component;
}
const showModal = ref(false);
const currentCom = ref("customerNotice");
const tabs: ITabsCom = {
  customerNotice: CustomerNotice,
  shopNotice: ShopNotice,
  orderNotice: OrderNotice,
  afterNotice: AfterNotice,
};

function handleUpdateValue(page: string) {
  currentCom.value = page;
}
const handleReaded = async () => {
  console.log("more");
};
const more = () => {
  showModal.value = false;
};
defineExpose({
  showModal,
});
</script>
<style lang="scss" scoped>
.notice-card {
  width: 380px;
  height: 483px;
  position: fixed;
  right: 40px;
  top: 84px;
  border-radius: 6px;
  background-color: white;
}

.btn-list {
  height: 40px;
  width: 100%;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid $borderColor;
  position: absolute;
  bottom: 0;
  left: 0;
}

.notice-tabs {
  margin: 10px 20px 0 20px;
}
</style>
