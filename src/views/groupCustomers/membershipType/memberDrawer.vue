<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '380px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="会员名称" path="groupCustomerMemberName">
        <n-input
          v-model:value="form.groupCustomerMemberName"
          clearable
          :maxlength="12"
          placeholder="输入会员名称"
        />
      </n-form-item>

      <n-form-item label="会员类型" path="groupCustomerMemberType">
        <n-select
          clearable
          filterable
          v-model:value="form.groupCustomerMemberType"
          placeholder="选择会员类型"
          :options="memberOption"
        />
      </n-form-item>

      <BusTypeItem
        :disabled="disabled"
        :orderBusinessType="item.orderBusinessType"
        :orderBusinessTypeName="item.orderBusinessTypeName"
        :rate="item.rate"
        :limit="item.limit"
        v-for="(item, index) in form.rateLimitData"
        :loading="loading"
        :key="index"
        @validate="handleFormItemValite"
      />

      <n-form-item label="会员状态" path="groupCustomerMemberLock">
        <n-radio-group v-model:value="form.groupCustomerMemberLock">
          <n-space>
            <n-radio :value="item.value" v-for="item in lockOptions" :key="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="会员描述" path="groupCustomerMemberDesc">
        <n-input
          v-model:value="form.groupCustomerMemberDesc"
          type="textarea"
          placeholder="输入会员描述"
          round
          clearable
        />
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
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { lockOptions } from "@/config/form";
import { getGroupMemberDetail } from "@/api/groupCustomers/groupCustomers";
// import { addGroupMember, editGroupMember } from "@/api/groupCustomers/groupCustomers";
import BusTypeItem from "./busTypeItem.vue";
import { FormInter, busTypeItem } from "./type";
export default defineComponent({
  name: "MemberDrawer",
  components: { BusTypeItem },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      groupCustomerMemberType: null,
      groupCustomerMemberName: null,
      groupCustomerMemberDesc: null,
      groupCustomerMemberLock: null,
      rateLimitData: [],
    });

    function openDrawer(t: string, groupCustomerMemberId: string) {
      if (groupCustomerMemberId) {
        getDetail(groupCustomerMemberId);
      }
      title.value = t;
      state.isDrawer = true;
    }

    const getDetail = async (groupCustomerMemberId: string) => {
      try {
        state.loading = true;
        let res = await getGroupMemberDetail({ groupCustomerMemberId });
        console.log(res.data);

        const {
          groupCustomerMemberType,
          groupCustomerMemberName,
          groupCustomerMemberDesc,
          groupCustomerMemberLock,
          groupCustomerMemberCreateOrderLimitList,
          groupCustomerMemberDiscountRateList,
        } = res.data;

        let dataArr: busTypeItem[] = [];
        for (let key = 0; key < groupCustomerMemberDiscountRateList.length; key++) {
          console.log(key);
          let item = {
            rate: groupCustomerMemberDiscountRateList[key].groupCustomerMemberDiscountRate,
            limit: groupCustomerMemberCreateOrderLimitList[key].groupCustomerMemberCreateOrderLimit,
            // orderBusinessType: groupCustomerMemberDiscountRateList[key].groupCustomerMemberDiscountRate,
            orderBusinessType: "OBT0001",
            orderBusinessTypeName: groupCustomerMemberDiscountRateList[key].orderBusinessType,
          };
          dataArr.push(item);
        }
        console.log(dataArr);

        form.value = {
          groupCustomerMemberType,
          groupCustomerMemberName,
          groupCustomerMemberDesc,
          groupCustomerMemberLock,
          rateLimitData: dataArr,
        };
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleFormItemValite(value: { rate: number | null; limit: number | null }) {
      console.log(value);
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res;
            const {
              groupCustomerMemberId,
              groupCustomerMemberType,
              groupCustomerMemberName,
              groupCustomerMemberDesc,
              groupCustomerMemberLock,
            } = form.value;

            console.log(
              groupCustomerMemberId,
              groupCustomerMemberType,
              groupCustomerMemberName,
              groupCustomerMemberDesc,
              groupCustomerMemberLock
            );

            if (!form.value.groupCustomerMemberId) {
              //   res = await addGroupMember({
              //     groupCustomerMemberId,
              //     groupCustomerMemberType,
              //     groupCustomerMemberName,
              //     groupCustomerMemberDesc,
              //     groupCustomerMemberLock,
              //     groupCustomerMemberDiscountRateList,
              //     groupCustomerMemberCreateOrderLimitList,
              //   });
              console.log(res);
            } else {
              //   res = await editGroupMember({
              //     groupCustomerMemberId,
              //     groupCustomerMemberType,
              //     groupCustomerMemberName,
              //     groupCustomerMemberDesc,
              //     groupCustomerMemberLock,
              //     groupCustomerMemberDiscountRateList,
              //     groupCustomerMemberCreateOrderLimitList,
              //   });
            }
            state.loading = false;
            // message.success(window.$tips[res.code]);
            message.success("window.$tips[res.code]");

            handleSaveAfter();
          } catch (err) {
            console.log(err);
            state.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      const groupCustomerMemberId = form.value.groupCustomerMemberId;
      form.value = {
        groupCustomerMemberId,
        groupCustomerMemberType: null,
        groupCustomerMemberName: null,
        groupCustomerMemberDesc: null,
        groupCustomerMemberLock: null,
        rateLimitData: [],
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      formRef,
      title,
      rules: {
        groupCustomerMemberName: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入会员名称",
        },
        specialDiscount: { required: true, trigger: ["blur", "input"], message: "请输入会员折扣" },
        specialLimit: { required: true, trigger: ["blur", "input"], message: "请输入下单限制" },

        fastlDiscount: { required: true, trigger: ["blur", "input"], message: "请输入会员折扣" },
        fastlLimit: { required: true, trigger: ["blur", "input"], message: "请输入下单限制" },

        taxilDiscount: { required: true, trigger: ["blur", "input"], message: "请输入会员折扣" },
        taxilLimit: { required: true, trigger: ["blur", "input"], message: "请输入下单限制" },
        descript: { required: true, trigger: ["blur", "input"], message: "请输入会员描述" },
        groupCustomerMemberType: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择会员类型",
        },
      },
      lockOptions,
      memberOption: [
        {
          label: "其他会员",
          value: "1",
        },
      ],
      form,
      handleFormItemValite,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
