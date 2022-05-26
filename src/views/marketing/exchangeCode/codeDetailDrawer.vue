<template>
  <BasicDrawer v-model:show="isDrawer" title="兑换码详情" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="兑换码">{{ detail?.exchangeCode }}</n-descriptions-item>
      <n-descriptions-item label="兑换类型">{{
        detail?.exchangeCodeExchangeType
      }}</n-descriptions-item>
      <n-descriptions-item label="生效时间" :span="2">{{
        dayjs(detail?.exchangeCodeEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="生成时间" :span="2">{{
        dayjs(detail?.exchangeCodeEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="可兑换次数">{{
        detail?.exchangeCodeUsedCount
      }}</n-descriptions-item>
      <n-descriptions-item label="已兑换次数">{{
        detail?.exchangeCodeUsableCount
      }}</n-descriptions-item>
      <n-descriptions-item label="兑换实充金额">{{
        detail?.exchangeRechargeAmount
      }}</n-descriptions-item>
      <n-descriptions-item label="兑换赠送金额">{{
        detail?.exchangeGiftAmount
      }}</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { getExchangeCodeDetail } from "@/api/marketing/marketing";
import dayjs from "dayjs";
export default defineComponent({
  name: "CodeDetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const detail = ref();

    function openDrawer(exchangeCodeId: string) {
      if (exchangeCodeId) {
        getDetail(exchangeCodeId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (exchangeCodeId: string) => {
      try {
        state.loading = true;
        let res = await getExchangeCodeDetail({ exchangeCodeId });
        console.log(res);
        detail.value = res.data;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      dayjs,
      detail,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
