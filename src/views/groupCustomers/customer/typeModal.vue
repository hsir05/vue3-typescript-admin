<template>
  <BasicModal
    width="600px"
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
      <n-form-item label="会员类型" path="membershipType">
        <n-select
          clearable
          filterable
          v-model:value="form.membershipType"
          placeholder="选择会员类型"
          :options="options"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存</n-button
        >
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { getAllGroupMember } from "@/api/groupCustomers/groupCustomers";
import { formState } from "./type";
export default defineComponent({
  name: "TypeModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);
    const options = ref([]);

    const form = ref<formState>({
      membershipType: null,
    });
    const formRef = ref<FormInst | null>(null);

    onMounted(() => {
      getAllGroupMemberData();
    });

    const getAllGroupMemberData = async () => {
      loading.value = true;
      try {
        let res = await getAllGroupMember();
        console.log(res);
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

    const handleModal = () => {
      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleValidate() {
      formRef.value?.validate((errors) => {
        if (!errors) {
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleReset() {
      form.value = { membershipType: null };
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
        membershipType: { required: true, trigger: ["blur", "change"], message: "请选择会员类型" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
