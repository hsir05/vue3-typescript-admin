<template>
  <BasicModal
    width="650px"
    title="更改会员类型"
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
      <n-form-item label="会员类型" path="customerMemberId">
        <n-select
          clearable
          filterable
          v-model:value="form.customerMemberId"
          placeholder="选择会员类型"
          :options="options"
        />
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { getAllCustomerMember } from "@/api/individualCustomers/individualCustomers";
import { FormInter } from "./type";
export default defineComponent({
  name: "TypeModal",
  components: { BasicModal },
  setup() {
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
        console.log(res.data);
        options.value = res.data.map(
          (item: { groupCustomerMemberName: string; groupCustomerMemberId: string }) => {
            return {
              label: item.groupCustomerMemberName,
              value: item.groupCustomerMemberId,
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
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleReset() {
      form.value = { customerId: null, customerMemberId: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      options: [
        {
          label: "普通会员",
          value: "1",
        },
      ],
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
