<template>
  <BasicModal title="调整派单限制开始时间" ref="ModalRef" :maskClosable="true">
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item
        label="派单限制开始时间"
        path="dispatchOrderLimitBeginTime"
        style="margin: 0 auto"
      >
        <n-date-picker
          style="width: 460px"
          v-model:value="form.dispatchOrderLimitBeginTime"
          type="datetime"
          clearable
        />
      </n-form-item>

      <div class="text-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { updateOrderLimitTime } from "@/api/capacity/capacity";
import { OrderLimitTime } from "./type";
import dayjs from "dayjs";
export default defineComponent({
  name: "OrderLimitTimeModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const loading = ref(false);
    const message = useMessage();
    const form = ref<OrderLimitTime>({
      dispatchOrderLimitBeginTime: null,
      operationCompanyOpenedDriverMemberId: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (record: OrderLimitTime) => {
      form.value = record;
      console.log(record);

      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          try {
            loading.value = true;
            let option = {
              operationCompanyOpenedDriverMemberId: form.value
                .operationCompanyOpenedDriverMemberId as string,
              dispatchOrderLimitBeginTime: dayjs(form.value.dispatchOrderLimitBeginTime).format(
                "YYYY-MM-DD HH:mm:ss"
              ) as string,
            };
            let res = await updateOrderLimitTime(option);
            emit("on-save-after");
            message.success(window.$tips[res.code]);
            loading.value = false;
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
        dispatchOrderLimitBeginTime: null,
        operationCompanyOpenedDriverMemberId: null,
      };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      rules: {
        dispatchOrderLimitBeginTime: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请选择时间",
        },
      },
      handleModal,
      handleReset,
      handleValidate,
    };
  },
});
</script>
<style lang="scss" scoped>
.n-form-item-blank {
  margin: 0 auto;
}
</style>
