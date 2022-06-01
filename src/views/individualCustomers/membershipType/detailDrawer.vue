<template>
  <BasicDrawer v-model:show="isDrawer" title="个人客户会员详情" @on-close-after="onCloseAfter">
    <n-spin :show="loading">
      <n-descriptions label-placement="left" bordered :column="2">
        <n-descriptions-item label="会员名称">{{ detail?.customerMemberName }}</n-descriptions-item>
        <n-descriptions-item label="会员状态"
          >{{ detail?.customerMemberLock === 0 ? "正常" : "锁定" }}
        </n-descriptions-item>
        <n-descriptions-item label="会员描述" :span="2">{{
          detail?.customerMemberDesc
        }}</n-descriptions-item>
      </n-descriptions>

      <n-descriptions
        label-placement="left"
        bordered
        :title="item.orderBusinessTypeName"
        class="mt-15px"
        v-for="(item, index) in detail?.dataArr || []"
        :key="index"
        :column="2"
      >
        <n-descriptions-item label="会员折扣">{{
          item.customerMemberDiscountRate
        }}</n-descriptions-item>
        <n-descriptions-item label="下单限制">{{
          item.customerMemberCreateOrderLimit
        }}</n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { getIndMemberDetail } from "@/api/individualCustomers/individualCustomers";
import { couponUseStateObj, couponAchieveOpportunityObj } from "@/config/form";
import { ItemLimitInter, ItemRateInter } from "./type";
import dayjs from "dayjs";
export default defineComponent({
  name: "DetailDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const detail = ref();

    function openDrawer(customerCouponId: string) {
      if (customerCouponId) {
        getDetail(customerCouponId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (customerMemberId: string) => {
      try {
        state.loading = true;
        let res = await getIndMemberDetail({ customerMemberId });
        console.log(res.data);
        detail.value = { ...res.data.customerMember };

        let dataArr = [
          {
            customerMemberCreateOrderLimit: null,
            customerMemberDiscountRate: null,
            orderBusinessType: "OBT0001",
            orderBusinessTypeName: "业务类型-专车业务",
          },
          {
            customerMemberCreateOrderLimit: null,
            customerMemberDiscountRate: null,
            orderBusinessType: "OBT0002",
            orderBusinessTypeName: "业务类型-快车业务",
          },
          {
            customerMemberCreateOrderLimit: null,
            customerMemberDiscountRate: null,
            orderBusinessType: "OBT0003",
            orderBusinessTypeName: "业务类型-出租车业务",
          },
        ];

        for (let key of dataArr) {
          let limit = res.data.customerMemberCreateOrderLimitList.find(
            (item: ItemLimitInter) => item.orderBusinessType === key.orderBusinessType
          );
          if (limit) {
            key.customerMemberCreateOrderLimit = limit.customerMemberCreateOrderLimit;
          }
          let rate = res.data.customerMemberDiscountRateList.find(
            (item: ItemRateInter) => item.orderBusinessType === key.orderBusinessType
          );
          if (rate) {
            key.customerMemberDiscountRate = rate.customerMemberDiscountRate;
          }
        }
        detail.value.dataArr = dataArr;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      detail.value = null;
    }

    return {
      ...toRefs(state),
      detail,
      dayjs,
      couponUseStateObj,
      couponAchieveOpportunityObj,
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
    };
  },
});
</script>
