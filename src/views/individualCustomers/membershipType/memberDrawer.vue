<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-spin :show="loading">
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
        <n-form-item label="会员名称" path="customerMemberName">
          <n-input
            v-model:value="form.customerMemberName"
            clearable
            :maxlength="12"
            placeholder="输入会员名称"
          />
        </n-form-item>

        <n-form-item label="会员类型" path="customerMemberType">
          <n-select
            clearable
            filterable
            v-model:value="form.customerMemberType"
            placeholder="选择会员类型"
            :options="memberOption"
          />
        </n-form-item>

        <BusTypeItem
          :disabled="disabled"
          :ref="setItemRef"
          :orderBusinessType="item.orderBusinessType"
          :orderBusinessTypeName="item.orderBusinessTypeName"
          :rate="item.rate"
          :limit="item.limit"
          v-for="(item, index) in form.rateLimitData"
          :loading="loading"
          :key="index"
          @validate="handleFormItemValite"
        />

        <n-form-item label="会员状态" path="customerMemberLock">
          <n-radio-group v-model:value="form.customerMemberLock">
            <n-space>
              <n-radio :value="item.value" v-for="item in lockOptions" :key="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="会员描述" path="customerMemberDesc">
          <n-input
            v-model:value="form.customerMemberDesc"
            type="textarea"
            placeholder="输入会员描述"
            round
            clearable
          />
        </n-form-item>

        <div class="text-center flex-center">
          <n-button
            attr-type="button"
            :loading="loading"
            :disabled="disabled"
            type="primary"
            @click="handleValidate"
            >保存</n-button
          >
          <n-button
            attr-type="button"
            type="warning"
            :disabled="disabled"
            class="ml-10px"
            @click="handleReset"
            >重置</n-button
          >
        </div>
      </n-form>
    </n-spin>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onBeforeUpdate } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { lockOptions } from "@/config/form";
import { getGroupMemberDetail } from "@/api/groupCustomers/groupCustomers";
import {
  addCustomerMember,
  editCustomerMember,
} from "@/api/individualCustomers/individualCustomers";
import BusTypeItem from "./busTypeItem.vue";
import { FormInter, busTypeInter, BusLimitInter, BusRateInter } from "./type";
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
    const formItemRef = ref([]);
    const resultBool = ref(true);
    const resultArr = ref<busTypeInter[]>([]);
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      customerMemberType: null,
      customerMemberName: null,
      customerMemberDesc: null,
      customerMemberLock: null,
      rateLimitData: [
        {
          limit: null,
          orderBusinessType: "OBT0001",
          orderBusinessTypeName: "专车业务",
          rate: null,
        },
        {
          limit: null,
          orderBusinessType: "OBT0002",
          orderBusinessTypeName: "快车业务",
          rate: null,
        },
        {
          limit: null,
          orderBusinessType: "OBT0003",
          orderBusinessTypeName: "出租车业务",
          rate: null,
        },
      ],
    });

    const setItemRef = (el: any) => {
      if (el) {
        //@ts-ignore
        formItemRef.value.push(el);
      }
    };

    onBeforeUpdate(() => {
      formItemRef.value = [];
    });

    function openDrawer(t: string, groupCustomerMemberId: string, bool: boolean) {
      console.log(bool);

      if (groupCustomerMemberId) {
        getDetail(groupCustomerMemberId);
      } else {
        state.isDrawer = true;
      }
      if (bool) {
        state.disabled = bool;
      }
      title.value = t;
    }

    const getDetail = async (groupCustomerMemberId: string) => {
      try {
        state.loading = true;
        let res = await getGroupMemberDetail({ groupCustomerMemberId });
        const {
          customerMemberType,
          customerMemberName,
          customerMemberDesc,
          customerMemberLock,
          customerMemberCreateOrderLimitMap,
          customerMemberDiscountRateMap,
        } = res.data;

        let dataArr: busTypeInter[] = [];
        for (let key = 0; key < customerMemberDiscountRateMap.length; key++) {
          let item = {
            rate: customerMemberDiscountRateMap[key].groupCustomerMemberDiscountRate,
            limit: customerMemberCreateOrderLimitMap[key].groupCustomerMemberCreateOrderLimit,
            // orderBusinessType: customerMemberDiscountRateMap[key].groupCustomerMemberDiscountRate,
            orderBusinessType: "OBT0001",
            orderBusinessTypeName: customerMemberDiscountRateMap[key].orderBusinessType,
          };
          dataArr.push(item);
        }
        console.log(dataArr);

        form.value = {
          customerMemberType,
          customerMemberName,
          customerMemberDesc,
          customerMemberLock,
          rateLimitData: dataArr,
        };
        state.loading = false;
        state.isDrawer = true;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleFormItemValite(bool: boolean, value: busTypeInter) {
      if (!bool) {
        resultBool.value = bool;
      }
      if (bool) {
        resultArr.value.push(value);
      }
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();

      for (let i = 0; i < formItemRef.value.length; i++) {
        const { formItemSubmit } = formItemRef.value[i];
        //@ts-ignore
        formItemSubmit();
      }

      formRef.value?.validate(async (errors) => {
        if (!errors) {
          if (!resultBool.value) {
            resultBool.value = true;
            return false;
          }
          let customerMemberDiscountRateMap: BusRateInter[] = [];
          let customerMemberCreateOrderLimitMap: BusLimitInter[] = [];

          for (let key of resultArr.value) {
            customerMemberDiscountRateMap.push({
              orderBusinessType: key.orderBusinessType as string,
              customerMemberDiscountRate: key.rate as number,
            });
            customerMemberCreateOrderLimitMap.push({
              orderBusinessType: key.orderBusinessType as string,
              customerMemberCreateOrderLimit: key.limit as number,
            });
          }
          state.loading = true;
          try {
            let res;
            const {
              customerMemberId,
              customerMemberType,
              customerMemberName,
              customerMemberDesc,
              customerMemberLock,
            } = form.value;
            let option = {
              customerMemberType,
              customerMemberName,
              customerMemberDesc,
              customerMemberLock,
              customerMemberDiscountRateMap,
              customerMemberCreateOrderLimitMap,
            };
            console.log(option);

            if (!form.value.customerMemberId) {
              res = await addCustomerMember(option);
            } else {
              res = await editCustomerMember({ customerMemberId, ...option });
            }
            state.loading = false;
            message.success(window.$tips[res.code]);
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
      const customerMemberId = form.value.customerMemberId;
      form.value = {
        customerMemberId,
        customerMemberType: null,
        customerMemberName: null,
        customerMemberDesc: null,
        customerMemberLock: null,
        rateLimitData: [
          {
            limit: null,
            orderBusinessType: "OBT0001",
            orderBusinessTypeName: "专车业务",
            rate: null,
          },
          {
            limit: null,
            orderBusinessType: "OBT0002",
            orderBusinessTypeName: "快车业务",
            rate: null,
          },
          {
            limit: null,
            orderBusinessType: "OBT0003",
            orderBusinessTypeName: "出租车业务",
            rate: null,
          },
        ],
      };
      resultArr.value = [];
      resultBool.value = true;
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
      setItemRef,
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
      handleSaveAfter,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
