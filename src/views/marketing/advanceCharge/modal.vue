<template>
  <BasicModal
    width="650px"
    title="编辑订单预付款支付渠道"
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
          :options="payChannelData"
        />
      </n-form-item>

      <n-form-item label="显示名称" path="orderAdvancePayChannelTypeShowName">
        <n-input
          v-model:value="form.orderAdvancePayChannelTypeShowName"
          clearable
          placeholder="输入显示名称"
        />
      </n-form-item>

      <n-form-item label="显示名称描述" path="orderAdvancePayChannelTypeShowDesc">
        <n-input
          v-model:value="form.orderAdvancePayChannelTypeShowDesc"
          clearable
          placeholder="输入显示名称描述"
        />
      </n-form-item>

      <n-form-item label="状态" path="orderAdvancePayChannelTypeLock">
        <n-radio-group v-model:value="form.orderAdvancePayChannelTypeLock">
          <n-space>
            <n-radio :value="1">锁定</n-radio>
            <n-radio :value="0">正常 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { getDict } from "@/api/common/common";
import { FormInter } from "./type";
import {
  getAdvancePayDetail,
  addAdvancePayChannelType,
  editAdvancePayChannelType,
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
      orderAdvancePayChannelTypeShowName: null,
      paymentChannelType: null,
      deviceChannelType: null,
      orderAdvancePayChannelTypeShowDesc: null,
      orderAdvancePayChannelTypeLock: 0,
    });
    const formRef = ref<FormInst | null>(null);

    onMounted(() => {
      getAllPayChannelData();
    });

    const handleModal = (deviceChannelType: string, orderAdvancePayChannelTypeShowId: string) => {
      form.value.deviceChannelType = deviceChannelType;
      const { showModal } = ModalRef.value;
      showModal();
      if (orderAdvancePayChannelTypeShowId) {
        getDetail(orderAdvancePayChannelTypeShowId);
      }
    };

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

    const getDetail = async (orderAdvancePayChannelTypeShowId: string) => {
      try {
        loading.value = true;
        let res = await getAdvancePayDetail({ orderAdvancePayChannelTypeShowId });
        console.log(res.data);
        const {
          orderAdvancePayChannelTypeShowName,
          paymentChannelType,
          deviceChannelType,
          orderAdvancePayChannelTypeShowDesc,
          orderAdvancePayChannelTypeLock,
        } = res.data;

        form.value = {
          orderAdvancePayChannelTypeShowId,
          orderAdvancePayChannelTypeShowName,
          paymentChannelType,
          deviceChannelType,
          orderAdvancePayChannelTypeShowDesc,
          orderAdvancePayChannelTypeLock,
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
              orderAdvancePayChannelTypeShowId,
              orderAdvancePayChannelTypeShowName,
              paymentChannelType,
              deviceChannelType,
              orderAdvancePayChannelTypeShowDesc,
              orderAdvancePayChannelTypeLock,
            } = form.value;
            let option = {
              orderAdvancePayChannelTypeShowName,
              paymentChannelType,
              deviceChannelType,
              orderAdvancePayChannelTypeShowDesc,
              orderAdvancePayChannelTypeLock,
            };
            if (!form.value.orderAdvancePayChannelTypeShowId) {
              res = await addAdvancePayChannelType(option);
              console.log(res);
            } else {
              res = await editAdvancePayChannelType({
                orderAdvancePayChannelTypeShowId,
                ...option,
              });
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
      form.value = {
        orderAdvancePayChannelTypeShowName: null,
        paymentChannelType: null,
        deviceChannelType: null,
        orderAdvancePayChannelTypeShowDesc: null,
        orderAdvancePayChannelTypeLock: 0,
      };
      formRef.value?.restoreValidation();
    }

    function handleSaveAfter() {
      form.value.orderAdvancePayChannelTypeShowId = null;
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
        orderAdvancePayChannelTypeShowName: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入名称",
        },
        orderAdvancePayChannelTypeShowDesc: {
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
