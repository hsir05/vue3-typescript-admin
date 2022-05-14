<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="代金券名称">新用户快车券</n-descriptions-item>
      <n-descriptions-item label="代金券面值(元)">未使用</n-descriptions-item>
      <n-descriptions-item label="获得时间">未使用</n-descriptions-item>
      <n-descriptions-item label="获得时机">未使用</n-descriptions-item>
      <n-descriptions-item label="获得备注">未使用</n-descriptions-item>
      <n-descriptions-item label="生效时间">2020-04-24 08:51:10</n-descriptions-item>
      <n-descriptions-item label="失效时间">2020-04-24 08:51:10</n-descriptions-item>

      <n-descriptions-item label="消费时间">未使用</n-descriptions-item>
      <n-descriptions-item label="消费备注">未使用</n-descriptions-item>
      <n-descriptions-item label="消费规则">未使用</n-descriptions-item>
      <n-descriptions-item label="获得备注">未使用</n-descriptions-item>
      <n-descriptions-item label="使用限制金额(元)">未使用</n-descriptions-item>
      <n-descriptions-item label="可使用城市">未使用</n-descriptions-item>
      <n-descriptions-item label="可使用的订单类型">未使用</n-descriptions-item>
      <n-descriptions-item label="可使用的车型">未使用</n-descriptions-item>
      <n-descriptions-item label="可使用的时间">未使用</n-descriptions-item>
      <n-descriptions-item label="可使用的星期">未使用</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { useMessage } from "naive-ui";
import { TableDataItemInter } from "./type";
export default defineComponent({
  name: "DetailDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("");
    const message = useMessage();

    function openDrawer(t: string, record?: TableDataItemInter | string) {
      console.log(record);
      if (record) {
        // form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
      message.error("打开");
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function uploadChange(list: string[]) {
      console.log(list);
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      title,
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
      handleReset,
      uploadChange,
    };
  },
});
</script>
