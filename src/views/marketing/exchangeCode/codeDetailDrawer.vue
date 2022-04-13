<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="兑换码">0001</n-descriptions-item>
      <n-descriptions-item label="兑换类型">22</n-descriptions-item>
      <n-descriptions-item label="生效时间" :span="2">2022-04-06 11:55:00</n-descriptions-item>
      <n-descriptions-item label="生成时间" :span="2">2020-04-24 08:51:10</n-descriptions-item>
      <n-descriptions-item label="可兑换次数">22</n-descriptions-item>
      <n-descriptions-item label="已兑换次数">22</n-descriptions-item>
      <n-descriptions-item label="兑换实充金额">22</n-descriptions-item>
      <n-descriptions-item label="兑换赠送金额">22</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "CodeDetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const title = ref("");
    const message = useMessage();

    function openDrawer(t: string, record?: tableDataItem) {
      if (record) {
        console.log(record);
        message.success("验证成功");
      }
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
