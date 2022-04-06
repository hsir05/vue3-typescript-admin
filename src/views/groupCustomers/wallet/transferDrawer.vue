<template>
  <BasicDrawer v-model:show="isDrawer" title="转账" @on-close-after="onCloseAfter">
    <WalletItem title="转出账户" />

    <n-divider title-placement="left">转账金额</n-divider>
    <n-form
      ref="formRef"
      :rules="rule"
      inline
      label-placement="left"
      label-width="120"
      :style="{ flexWrap: 'wrap' }"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
    >
      <n-form-item label="对方客户手机号" path="phone">
        <n-input
          v-model:value="form.phone"
          :maxlength="11"
          clearable
          placeholder="输入对方客户手机号"
          style="width: 180px"
        />
      </n-form-item>

      <n-form-item label="实充转账金额" path="actualAmount">
        <n-input-number
          v-model:value="form.actualAmount"
          :min="0"
          clearable
          style="width: 180px"
          placeholder="输入实充转账金额"
        />
      </n-form-item>
      <n-form-item label="赠送转账金额" path="giveAmount">
        <n-input-number
          v-model:value="form.giveAmount"
          style="width: 180px"
          :min="0"
          clearable
          placeholder="输入赠送转账金额"
        />
      </n-form-item>

      <n-form-item label="转账说明" path="explain">
        <n-input
          v-model:value="form.explain"
          clearable
          placeholder="输入转账说明"
          style="width: 180px"
        />
      </n-form-item>

      <n-form-item label="管理员登陆密码" path="password">
        <n-input
          v-model:value="form.password"
          type="password"
          placeholder="请输入管理员登陆密码"
          style="width: 180px"
        />
      </n-form-item>
    </n-form>
    <div class="text-center flex-center">
      <n-button attr-type="button" type="primary" @click="submit">提交</n-button>
      <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import WalletItem from "./walletItem.vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "Transfer",
  components: {
    WalletItem,
  },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref({
      explain: null,
      phone: null,
      password: null,
      actualAmount: null,
      giveAmount: null,
    });

    function openDrawer(record?: tableDataItem) {
      console.log(record);
      if (record) {
        console.log(record);
      }
      state.isDrawer = true;
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function reset() {
      form.value = {
        explain: null,
        phone: null,
        password: null,
        actualAmount: null,
        giveAmount: null,
      };
      formRef.value?.restoreValidation();
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      form,
      formRef,
      rule: {
        explain: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入充值说明",
        },
        password: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入管理员登陆密码",
        },
        actualAmount: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入实充金额",
        },
        giveAmount: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入赠送金额",
        },
      },
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
      submit,
      reset,
    };
  },
});
</script>
