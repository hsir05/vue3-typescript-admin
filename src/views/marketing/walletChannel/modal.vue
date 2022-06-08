<template>
  <BasicModal
    width="650px"
    title="钱包充值渠道"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="充值渠道" path="paymentChannelType">
        <n-select
          v-model:value="form.paymentChannelType"
          clearable
          filterable
          placeholder="选择充值渠道"
          style="width: 390px"
          :options="payChannelData"
        />
      </n-form-item>

      <n-form-item label="显示名称" path="customerWalletRechargeChannelShowName">
        <n-input
          v-model:value="form.customerWalletRechargeChannelShowName"
          style="width: 390px"
          clearable
          placeholder="输入显示名称"
        />
      </n-form-item>

      <n-form-item label="状态" path="customerWalletRechargeChannelLock">
        <n-radio-group v-model:value="form.customerWalletRechargeChannelLock">
          <n-space>
            <n-radio :value="1">锁定</n-radio>
            <n-radio :value="0">正常</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存</n-button
        >
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { FormInter } from "./type";
import { getDict } from "@/api/common/common";
import {
  getWalletChannelDetail,
  addWalletChannelType,
  editWalletChannelType,
} from "@/api/marketing/marketing";
export default defineComponent({
  name: "ThresholdModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);
    const payChannelData = ref([]);

    const form = ref<FormInter>({
      customerWalletRechargeChannelShowName: null,
      paymentChannelType: null,
      deviceChannelType: null,
      customerWalletRechargeChannelLock: 0,
    });
    const formRef = ref<FormInst | null>(null);

    onMounted(() => {
      getAllPayChannelData();
    });

    const getAllPayChannelData = async () => {
      try {
        let res = await getDict({ parentEntryCode: "PCT0000" });
        console.log(res);
        payChannelData.value = res.data.map((item: { entryCode: string; entryName: string }) => {
          return { label: item.entryName, value: item.entryCode };
        });
      } catch (err) {
        console.log(err);
      }
    };

    const handleModal = (
      deviceChannelType: string,
      customerWalletRechargeChannelShowId: string
    ) => {
      const { showModal } = ModalRef.value;
      showModal();
      form.value.deviceChannelType = deviceChannelType;
      if (customerWalletRechargeChannelShowId) {
        getDetail(customerWalletRechargeChannelShowId);
      }
    };

    const getDetail = async (customerWalletRechargeChannelShowId: string) => {
      try {
        loading.value = true;
        let res = await getWalletChannelDetail({ customerWalletRechargeChannelShowId });
        console.log(res.data);
        const {
          customerWalletRechargeChannelShowName,
          paymentChannelType,
          deviceChannelType,
          customerWalletRechargeChannelLock,
        } = res.data;

        form.value = {
          customerWalletRechargeChannelShowId,
          customerWalletRechargeChannelShowName,
          paymentChannelType,
          deviceChannelType,
          customerWalletRechargeChannelLock,
        };
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            let res;
            const {
              customerWalletRechargeChannelShowId,
              customerWalletRechargeChannelShowName,
              paymentChannelType,
              deviceChannelType,
              customerWalletRechargeChannelLock,
            } = form.value;
            let option = {
              customerWalletRechargeChannelShowName,
              paymentChannelType,
              deviceChannelType,
              customerWalletRechargeChannelLock,
            };
            if (!form.value.customerWalletRechargeChannelShowId) {
              res = await addWalletChannelType(option);
              console.log(res);
            } else {
              res = await editWalletChannelType({ customerWalletRechargeChannelShowId, ...option });
            }
            loading.value = false;
            message.success(window.$tips[res.code]);
            handleSaveAfter();
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function handleReset() {
      let customerWalletRechargeChannelShowId = form.value.customerWalletRechargeChannelShowId;
      form.value = {
        customerWalletRechargeChannelShowId,
        customerWalletRechargeChannelShowName: null,
        paymentChannelType: null,
        deviceChannelType: null,
        customerWalletRechargeChannelLock: 0,
      };
      formRef.value?.restoreValidation();
    }

    function handleSaveAfter() {
      form.value.customerWalletRechargeChannelShowId = null;
      emit("on-save-after");
    }

    return {
      ModalRef,
      formRef,
      form,
      payChannelData,
      loading,
      rules: {
        paymentChannelType: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择支付渠道",
        },
        orderPayChannelTypeShowName: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入名称",
        },
        orderPayChannelTypeShowDesc: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入名称描述",
        },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
