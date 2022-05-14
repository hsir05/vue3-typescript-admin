<template>
  <BasicDrawer v-model:show="isDrawer" title="个人客户信息" @on-close-after="onCloseAfter">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="基本信息">
        <n-descriptions label-placement="left" bordered :column="2">
          <n-descriptions-item label="客户昵称">暂无</n-descriptions-item>
          <n-descriptions-item label="客户姓名">暂无</n-descriptions-item>
          <n-descriptions-item label="客户性别">女</n-descriptions-item>
          <n-descriptions-item label="客户生日">暂无</n-descriptions-item>
          <n-descriptions-item label="客户邮箱">暂无</n-descriptions-item>
          <n-descriptions-item label="客户手机号">180947899</n-descriptions-item>
          <n-descriptions-item label="会员名称">暂无</n-descriptions-item>
          <n-descriptions-item label="客户状态">暂无正常</n-descriptions-item>
          <n-descriptions-item label="客户注册时间">2022-04-02 16:08:46</n-descriptions-item>
        </n-descriptions>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="钱包及免密支付信息">
        <n-descriptions label-placement="left" bordered :column="2">
          <n-descriptions-item label="个人钱包信息" :span="2">暂无</n-descriptions-item>
          <n-descriptions-item label="可用余额">暂无</n-descriptions-item>
          <n-descriptions-item label="总余额">女</n-descriptions-item>
          <n-descriptions-item label="钱包创建时间">2022-04-02 16:08:46</n-descriptions-item>
        </n-descriptions>
      </n-tab-pane>
    </n-tabs>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { TableItemInter } from "./type";
export default defineComponent({
  name: "DetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    function openDrawer(record?: TableItemInter) {
      console.log(record);
      if (record) {
        console.log(record);
      }
      state.isDrawer = true;
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
