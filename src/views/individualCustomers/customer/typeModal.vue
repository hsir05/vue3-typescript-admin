<template>
  <BasicModal
    width="650px"
    title="更改会员类型"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
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
      <n-form-item label="会员类型" path="customerMemberId">
        <n-select
          clearable
          filterable
          v-model:value="form.customerMemberId"
          placeholder="选择会员类型"
          :options="options"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" type="primary" @click="handleValidate">提交</n-button>
        <!-- <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset">重置</n-button> -->
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import {
  getAllCustomerMember,
  updateCustomerType,
} from "@/api/individualCustomers/individualCustomers";
import { FormInter } from "./type";
export default defineComponent({
  name: "TypeModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);
    const options = ref([]);

    const form = ref<FormInter>({
      customerId: null,
      customerMemberId: null,
    });
    const formRef = ref<FormInst | null>(null);

    onMounted(() => {
      getAllGroupMemberData();
    });

    const getAllGroupMemberData = async () => {
      loading.value = true;
      try {
        let res = await getAllCustomerMember();
        options.value = res.data.map(
          (item: { customerMemberName: string; customerMemberId: string }) => {
            return {
              label: item.customerMemberName,
              value: item.customerMemberId,
            };
          }
        );
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const handleModal = (customerMemberId: string, customerId: string) => {
      form.value.customerId = customerId;
      form.value.customerMemberId = customerMemberId;
      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          console.log(unref(form));
          try {
            loading.value = true;
            let option = {
              customerId: form.value.customerId as string,
              customerMemberId: form.value.customerMemberId as string,
            };
            let res = await updateCustomerType(option);
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
      form.value = { customerId: null, customerMemberId: null };
      formRef.value?.restoreValidation();
      emit("on-save-after");
    }

    return {
      ModalRef,
      formRef,
      form,
      options,
      loading,
      rules: {
        customerId: { required: true, trigger: ["blur", "change"], message: "请选择会员类型" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
