<template>
  <BasicDrawer v-model:show="isDrawer" title="开票申请信息" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="集团客户名称">
        {{ detail?.groupCustomerName }}
      </n-descriptions-item>
      <n-descriptions-item label="发票申请类型">
        {{ detail?.invoiceApplicationType }}
      </n-descriptions-item>
      <n-descriptions-item label="发票金额(元)"> {{ detail?.invoiceAmount }} </n-descriptions-item>
      <n-descriptions-item label="发票类型">
        {{ detail?.invoiceType === 1 ? "公司类型" : "个人类型" }}
      </n-descriptions-item>
      <n-descriptions-item label="发票抬头"> {{ detail?.invoiceTitle }} </n-descriptions-item>
      <n-descriptions-item label="纳税人识别号">
        {{ detail?.taxpayerIdentificationNumber }}
      </n-descriptions-item>
      <n-descriptions-item label="发票内容"> {{ detail?.invoiceContent }} </n-descriptions-item>
      <n-descriptions-item label="开户行名称">
        {{ detail?.companyAccountBankName }}
      </n-descriptions-item>
      <n-descriptions-item label="开户行账号">
        {{ detail?.companyAccountBankNumber }}
      </n-descriptions-item>
      <n-descriptions-item label="公司注册地址">
        {{ detail?.companyRegistrationAddress }}
      </n-descriptions-item>
      <n-descriptions-item label="公司注册电话">
        {{ detail?.companyRegistrationPhone }}
      </n-descriptions-item>
      <n-descriptions-item label="联系人姓名"> {{ detail?.contactName }} </n-descriptions-item>
      <n-descriptions-item label="联系人电话"> {{ detail?.contactPhone }} </n-descriptions-item>
      <n-descriptions-item label="联系人地址"> {{ detail?.contactAddress }} </n-descriptions-item>
      <n-descriptions-item label="联系人邮箱"> {{ detail?.contactMail }} </n-descriptions-item>
      <n-descriptions-item label="提交时间">
        {{ dayjs(detail?.invoiceApplicationTime).format("YYYY-MM-DD HH:mm:ss") }}
      </n-descriptions-item>
      <n-descriptions-item label="提交备注">
        {{ detail?.invoiceApplicationSuccessNote }}
      </n-descriptions-item>
      <!-- <n-descriptions-item label="取消时间"> {{dayjs(detail?.invoiceApplicationCancelTime).format("YYYY-MM-DD HH:mm:ss")}} </n-descriptions-item>
      <n-descriptions-item label="取消原因"> {{detail?.invoiceApplicationCancelReason}} </n-descriptions-item> -->
      <n-descriptions-item label="发票申请状态">
        {{ invoiceAppObj[detail?.invoiceApplicationState] }}
      </n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { getGrdInvoiceDetail } from "@/api/groupCustomers/groupCustomers";
import { invoiceAppObj } from "@/config/form";
import dayjs from "dayjs";
export default defineComponent({
  name: "InvoiceDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const detail = ref();

    function openDrawer(groupCustomerInvoiceApplicationId: string) {
      if (groupCustomerInvoiceApplicationId) {
        getDetail(groupCustomerInvoiceApplicationId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (groupCustomerInvoiceApplicationId: string) => {
      try {
        state.loading = true;
        let res = await getGrdInvoiceDetail({ groupCustomerInvoiceApplicationId });
        console.log(res.data);
        detail.value = { ...res.data };
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
      detail,
      invoiceAppObj,
      dayjs,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
