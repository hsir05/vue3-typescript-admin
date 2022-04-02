<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" width="1000" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered title="班级信息">
      <n-descriptions-item>
        <template #label> 早餐 </template>
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="早午餐"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="午餐"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="晚餐" :span="2">
        两个<br />
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="夜宵"> 苹果 </n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from "vue";
export default defineComponent({
  name: "TeamDrawer",
  setup() {
    const title = ref("班级信息");
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      title,
      ...toRefs(state),

      onCloseAfter,
    };
  },
});
</script>
