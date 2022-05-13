<template>
  <BasicModal
    width="600px"
    :title="title"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '490px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="集团客户名称" path="groupCustomerName">
        <n-input v-model:value="form.groupCustomerName" clearable placeholder="输入集团客户名称" />
      </n-form-item>

      <n-form-item label="登录账号" path="groupCustomerLoginAccount">
        <n-input
          v-model:value="form.groupCustomerLoginAccount"
          :maxlength="20"
          clearable
          placeholder="输入登录账号"
        />
      </n-form-item>

      <n-form-item label="客户类型" path="groupCustomerMemberId">
        <n-select
          clearable
          filterable
          v-model:value="form.groupCustomerMemberId"
          placeholder="选择客户类型"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="联系人姓名" path="contactName">
        <n-input
          v-model:value="form.contactName"
          :maxlength="20"
          clearable
          placeholder="输入联系人姓名"
        />
      </n-form-item>

      <n-form-item label="联系人手机号" path="contactPhone">
        <n-input
          v-model:value="form.contactPhone"
          :maxlength="11"
          clearable
          placeholder="输入联系人手机号"
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
import {
  getAllGroupMember,
  getGroupCustomerDetail,
  addGroupCustomer,
  editGroupCustomer,
} from "@/api/groupCustomers/groupCustomers";
import { FormInter } from "./type";
export default defineComponent({
  name: "TypeModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const title = ref("");
    const message = useMessage();
    const loading = ref(false);
    const options = ref([]);

    const form = ref<FormInter>({
      groupCustomerName: null,
      groupCustomerMemberId: null,
      groupCustomerLoginAccount: null,
      contactName: null,
      contactPhone: null,
    });
    const formRef = ref<FormInst | null>(null);

    onMounted(() => {
      getAllGroupMemberData();
    });

    const getAllGroupMemberData = async () => {
      loading.value = true;
      try {
        let res = await getAllGroupMember();
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

    const handleModal = (t: string, groupCustomerId: string) => {
      if (groupCustomerId) {
        form.value.groupCustomerId = groupCustomerId;
        getDetail(groupCustomerId);
      }
      title.value = t;
      const { showModal } = ModalRef.value;
      showModal();
    };

    const getDetail = async (groupCustomerId: string) => {
      loading.value = true;
      try {
        let res = await getGroupCustomerDetail({ groupCustomerId });
        console.log(res.data);
        form.value = res.data;
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
            if (form.value.groupCustomerId) {
              res = await editGroupCustomer(form.value);
            } else {
              res = await addGroupCustomer(form.value);
            }
            console.log(res);

            message.success(window.$tips[res.code]);
          } catch (err) {
            console.log(err);
          }
          loading.value = false;
        } else {
          console.log(errors);
          loading.value = false;
        }
      });
    }

    function handleReset() {
      form.value = {
        groupCustomerName: null,
        groupCustomerMemberId: null,
        groupCustomerLoginAccount: null,
        contactName: null,
        contactPhone: null,
      };
      formRef.value?.restoreValidation();
      emit("on-save-after");
    }

    return {
      ModalRef,
      formRef,
      title,
      form,
      options,
      loading,
      rules: {
        groupCustomerName: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入会员名称",
        },
        groupCustomerMemberId: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择会员类型",
        },
        groupCustomerLoginAccount: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入会员登录帐号",
        },
        contactName: { required: true, trigger: ["blur", "change"], message: "请输入联系人帐号" },
        contactPhone: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入联系人电话号码",
        },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
