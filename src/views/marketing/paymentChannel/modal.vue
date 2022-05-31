<template>
  <BasicModal
    width="650px"
    title="编辑订单支付渠道"
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
      <n-form-item label="支付渠道" path="paymentChannelType">
        <n-select
          v-model:value="form.paymentChannelType"
          clearable
          filterable
          placeholder="选择支付渠道"
          style="width: 260px"
          :options="deviceChannelTypeData"
        />
      </n-form-item>

      <n-form-item label="显示名称" path="orderPayChannelTypeShowName">
        <n-input
          v-model:value="form.orderPayChannelTypeShowName"
          clearable
          placeholder="输入显示名称"
        />
      </n-form-item>

      <n-form-item label="显示名称描述" path="orderPayChannelTypeShowDesc">
        <n-input
          v-model:value="form.orderPayChannelTypeShowDesc"
          clearable
          placeholder="输入显示名称描述"
        />
      </n-form-item>

      <n-form-item label="状态" path="orderPayChannelTypeLock">
        <n-radio-group v-model:value="form.orderPayChannelTypeLock">
          <n-space>
            <n-radio value="1">正常</n-radio>
            <n-radio :value="0">锁定</n-radio>
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
import { CommonItemInter } from "@/interface/common/common";
import { FormInter } from "./type";
import { getDict } from "@/api/common/common";
import {
  getOrderPayDetail,
  addPayChannelType,
  editPayChannelType,
} from "@/api/marketing/marketing";
export default defineComponent({
  name: "ThresholdModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);
    const deviceChannelTypeData = ref<CommonItemInter[]>([]);

    const form = ref<FormInter>({
      orderPayChannelTypeShowName: null,
      paymentChannelType: null,
      orderPayChannelTypeShowDesc: null,
      orderPayChannelTypeLock: 0,
    });
    const formRef = ref<FormInst | null>(null);

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      try {
        let res = await getDict({ parentEntryCode: "DCT0000" });
        deviceChannelTypeData.value = res.data.map(
          (item: { entryName: string; entryCode: string }) => {
            return { label: item.entryName, value: item.entryCode };
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const handleModal = (orderPayChannelTypeShowId: string) => {
      const { showModal } = ModalRef.value;
      showModal();
      if (orderPayChannelTypeShowId) {
        getDetail(orderPayChannelTypeShowId);
      }
    };

    const getDetail = async (orderPayChannelTypeShowId: string) => {
      try {
        loading.value = true;
        let res = await getOrderPayDetail({ orderPayChannelTypeShowId });
        console.log(res.data);
        const {
          orderPayChannelTypeShowName,
          paymentChannelType,
          orderPayChannelTypeShowDesc,
          orderPayChannelTypeLock,
        } = res.data;

        form.value = {
          orderPayChannelTypeShowId,
          orderPayChannelTypeShowName,
          paymentChannelType,
          orderPayChannelTypeShowDesc,
          orderPayChannelTypeLock,
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
              orderPayChannelTypeShowId,
              orderPayChannelTypeShowName,
              paymentChannelType,
              orderPayChannelTypeShowDesc,
              orderPayChannelTypeLock,
            } = form.value;
            let option = {
              orderPayChannelTypeShowName,
              paymentChannelType,
              orderPayChannelTypeShowDesc,
              orderPayChannelTypeLock,
            };
            if (!form.value.orderPayChannelTypeShowId) {
              res = await addPayChannelType(option);
              console.log(res);
            } else {
              res = await editPayChannelType({ orderPayChannelTypeShowId, ...option });
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
      let orderPayChannelTypeShowId = form.value.orderPayChannelTypeShowId;
      form.value = {
        orderPayChannelTypeShowId,
        orderPayChannelTypeShowName: null,
        paymentChannelType: null,
        orderPayChannelTypeShowDesc: null,
        orderPayChannelTypeLock: null,
      };
      formRef.value?.restoreValidation();
    }

    function handleSaveAfter() {
      form.value.orderPayChannelTypeShowId = null;
      emit("on-save-after");
    }

    return {
      ModalRef,
      formRef,
      form,
      deviceChannelTypeData,
      loading,
      rules: {
        paymentChannelType: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入支付渠道",
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
