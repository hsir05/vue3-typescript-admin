<template>
  <BasicDrawer v-model:show="isDrawer" title="充值" @on-close-after="onCloseAfter">
    <WalletItem title="个人客户钱包充值" />
    <n-divider title-placement="left">充值</n-divider>
    <!-- 充值 -->
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
      <n-form-item label="实充金额" path="actualAmount">
        <n-input-number
          v-model:value="form.actualAmount"
          :min="0"
          clearable
          style="width: 180px"
          placeholder="输入实充金额"
        />
      </n-form-item>
      <n-form-item label="赠送金额" path="giveAmount">
        <n-input-number
          v-model:value="form.giveAmount"
          style="width: 180px"
          :min="0"
          clearable
          placeholder="输入赠送金额"
        />
      </n-form-item>

      <n-form-item label="充值说明" path="explain">
        <n-input
          v-model:value="form.explain"
          clearable
          placeholder="输入充值说明"
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
import { tableDataItem } from "./type";
import WalletItem from "@/components/walletItem/walletItem.vue";
import { FormInst, useMessage } from "naive-ui";
export default defineComponent({
  name: "Recharge",
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
        password: null,
        actualAmount: null,
        giveAmount: null,
      };
      formRef.value?.restoreValidation();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    return {
      form,
      formRef,
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
      submit,
      reset,
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
    };
  },
});
</script>
