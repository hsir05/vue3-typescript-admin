<template>
  <n-divider title-placement="left">{{ title }}</n-divider>
  <n-descriptions label-placement="left" bordered :column="3">
    <n-descriptions-item label="客户昵称">匿名</n-descriptions-item>
    <n-descriptions-item label="客户姓名">匿名</n-descriptions-item>
    <n-descriptions-item label="客户手机号">189****7588</n-descriptions-item>
    <n-descriptions-item label="实充余额">0.00</n-descriptions-item>
    <n-descriptions-item label="赠送余额">0.00</n-descriptions-item>
    <n-descriptions-item label="冻结金额">0.00</n-descriptions-item>
    <n-descriptions-item label="可用余额">0.00</n-descriptions-item>
    <n-descriptions-item label="总余额">0.00</n-descriptions-item>
    <n-descriptions-item label="钱包创建时间">2022-04-02 16:08:46</n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: "个人客户钱包",
  },
});
const { title } = toRefs(props);
</script>
