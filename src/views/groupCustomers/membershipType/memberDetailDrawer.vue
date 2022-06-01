<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" :column="2" bordered>
      <n-descriptions-item label="会员名称">普通客户</n-descriptions-item>
      <n-descriptions-item label="会员类型">其他会员</n-descriptions-item>
    </n-descriptions>

    <n-descriptions label-placement="left" class="mt-20px" title="专车业务" :column="2" bordered>
      <n-descriptions-item label="会员折扣">1.00</n-descriptions-item>
      <n-descriptions-item label="下单限制">100</n-descriptions-item>
    </n-descriptions>

    <n-descriptions label-placement="left" class="mt-20px" title="快车业务" :column="2" bordered>
      <n-descriptions-item label="会员折扣">1.00</n-descriptions-item>
      <n-descriptions-item label="下单限制">100</n-descriptions-item>
    </n-descriptions>

    <n-descriptions label-placement="left" class="mt-20px" title="出租车业务" :column="2" bordered>
      <n-descriptions-item label="会员折扣">1.00</n-descriptions-item>
      <n-descriptions-item label="下单限制">100</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
export default defineComponent({
  name: "DetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const title = ref("会员详情");

    function openDrawer(t: string, id: string) {
      console.log(id);
      title.value = t;
      state.isDrawer = true;
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      title,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
