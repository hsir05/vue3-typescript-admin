<template>
  <BasicDrawer v-model:show="isDrawer" title="开票申请信息" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="客户手机号"> 177****9673 </n-descriptions-item>
      <n-descriptions-item label="发票申请类型"> 按支付订单 </n-descriptions-item>
      <n-descriptions-item label="发票金额(元)"> 43.55 </n-descriptions-item>
      <n-descriptions-item label="发票类型"> 公司发票 </n-descriptions-item>
      <n-descriptions-item label="发票抬头"> 123 </n-descriptions-item>
      <n-descriptions-item label="纳税人识别号"> 123 </n-descriptions-item>
      <n-descriptions-item label="发票内容"> 客运服务费 </n-descriptions-item>
      <n-descriptions-item label="开户行名称"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="开户行账号"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="公司注册地址"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="公司注册电话"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="联系人姓名"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="联系人电话"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="联系人地址"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="联系人邮箱"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="提交时间"> 2022-04-04 17:40:17 </n-descriptions-item>
      <n-descriptions-item label="提交备注"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="取消时间"> 2022-04-04 17:49:17 </n-descriptions-item>
      <n-descriptions-item label="取消原因"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="发票申请状态"> 取消申请 </n-descriptions-item>
    </n-descriptions>

    <n-divider title-placement="left"> 开票信息</n-divider>

    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="开票方式"> 电子发票 </n-descriptions-item>
      <n-descriptions-item label="发票代码"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="发票号码"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="作废发票代码"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="作废发票号码"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="销方税号"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="快递单号"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="快递名称"> 暂无 </n-descriptions-item>
      <n-descriptions-item label="开票人邮箱地址"> wegjoe@qq.com </n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "InvoiceDrawer",
  setup() {
    const title = ref("");
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        console.log(record);
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
