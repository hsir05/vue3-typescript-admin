<template>
  <BasicDrawer v-model:show="isDrawer" title="车辆转移" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered title="车辆基本信息" :column="2">
      <n-descriptions-item label="车牌号">{{ data?.plateNumber }}</n-descriptions-item>
      <n-descriptions-item label="车牌颜色">{{ data?.plateColor }}</n-descriptions-item>
      <n-descriptions-item label="车辆品牌">{{ data?.vehicleBrand }}</n-descriptions-item>
      <n-descriptions-item label="车系">{{ data?.vehicleSeries }}</n-descriptions-item>
      <n-descriptions-item label="车辆型号">{{ data?.vehicleModel }}</n-descriptions-item>
      <n-descriptions-item label="车辆颜色">{{ data?.plateColor }}</n-descriptions-item>
      <n-descriptions-item label="行驶证类型">{{
        data?.vehicleDrivingPermitType
      }}</n-descriptions-item>
      <n-descriptions-item label="车辆注册日期"
        >{{ dayjs(data?.vehicleCertifyDate).format("YYYY-MM-DD HH:mm") }}
      </n-descriptions-item>

      <n-descriptions-item label="车辆类型">{{ data?.vehicleTypeName }}</n-descriptions-item>
      <n-descriptions-item label="是否锁定">{{
        data?.vehicleState === 0 ? "正常" : "锁定"
      }}</n-descriptions-item>
      <n-descriptions-item label="添加时间"
        >{{ dayjs(data?.createTime).format("YYYY-MM-DD HH:mm") }}
      </n-descriptions-item>
      <n-descriptions-item label="当前运营企业" :span="2">{{
        data?.operationCompanyName
      }}</n-descriptions-item>
    </n-descriptions>

    <n-form-item
      label="转移后运营企业"
      ref="formRef"
      :rule="rule"
      path="vehicleTransferCompanyId"
      label-placement="left"
      class="mt-20px"
    >
      <n-select
        clearable
        style="width: 350px"
        v-model:value="vehicleTransferCompanyId"
        placeholder="选择运营企业"
        :options="companyData"
      />
    </n-form-item>

    <div class="text-center">
      <n-button attr-type="button" :loading="loading" type="primary" @click="handleSubmit"
        >提交</n-button
      >
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { transfer } from "@/api/capacity/capacity";
import { getAllOperateCompany } from "@/api/common/common";
import dayjs from "dayjs";
export default defineComponent({
  name: "TransferDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const message = useMessage();
    const data = ref<tableDataItem>();
    const formRef = ref();
    const vehicleTransferCompanyId = ref();
    const companyData = ref([]);

    onMounted(() => {
      getAllCompanyData();
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    function openDrawer(record: tableDataItem) {
      data.value = record;
      state.isDrawer = true;
    }

    async function handleSubmit(e: MouseEvent) {
      e.preventDefault();
      await formRef.value?.validate(vehicleTransferCompanyId.value);
      formRef.value?.restoreValidation();
      try {
        state.loading = true;
        let option = {
          operationCompanyVehicleId: data.value?.operationCompanyVehicleId as string,
          vehicleTransferCompanyId: vehicleTransferCompanyId.value as string,
        };
        let res = await transfer(option);
        console.log(res);
        message.success(window.$tips[res.code]);
        handleSaveAfter();
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    return {
      ...toRefs(state),
      data,
      dayjs,
      companyData,
      openDrawer,
      formRef,
      vehicleTransferCompanyId,
      rule: {
        required: true,
        trigger: ["change", "blur"],
        message: "请选择运营企业",
      },
      handleSubmit,
      onCloseAfter,
    };
  },
});
</script>
