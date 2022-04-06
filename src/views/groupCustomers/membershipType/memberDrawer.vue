<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '350px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="会员名称" path="name">
        <n-input v-model:value="form.name" clearable :maxlength="12" placeholder="输入会员名称" />
      </n-form-item>

      <n-form-item label="会员类型" path="type">
        <n-select
          clearable
          filterable
          v-model:value="form.type"
          placeholder="选择会员类型"
          :options="memberOption"
        />
      </n-form-item>

      <n-divider title-placement="left">业务类型-专车业务</n-divider>
      <n-form-item label="会员折扣" path="specialDiscount">
        <n-input-number
          v-model:value="form.specialDiscount"
          :min="0"
          clearable
          placeholder="输入会员折扣"
        />
      </n-form-item>
      <n-form-item label="下单限制" path="specialLimit">
        <n-input-number
          v-model:value="form.specialLimit"
          :min="0"
          clearable
          placeholder="输入下单限制"
        />
      </n-form-item>

      <n-divider title-placement="left">业务类型-快车业务</n-divider>
      <n-form-item label="会员折扣" path="fastlDiscount">
        <n-input-number
          v-model:value="form.fastlDiscount"
          :min="0"
          clearable
          placeholder="输入会员折扣"
        />
      </n-form-item>
      <n-form-item label="下单限制" path="fastlLimit">
        <n-input-number
          v-model:value="form.fastlLimit"
          :min="0"
          clearable
          placeholder="输入下单限制"
        />
      </n-form-item>

      <n-divider title-placement="left">业务类型-出租车业务</n-divider>
      <n-form-item label="会员折扣" path="taxilDiscount">
        <n-input-number
          v-model:value="form.taxilDiscount"
          :min="0"
          clearable
          placeholder="输入会员折扣"
        />
      </n-form-item>
      <n-form-item label="下单限制" path="taxilLimit">
        <n-input-number
          v-model:value="form.taxilLimit"
          :min="0"
          clearable
          placeholder="输入下单限制"
        />
      </n-form-item>

      <n-form-item label="会员状态" path="status">
        <n-radio-group v-model:value="form.status">
          <n-space>
            <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="会员描述" path="descript">
        <n-input
          v-model:value="form.descript"
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
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { statusOptions } from "@/config/form";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "MemberDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      name: null,
      specialDiscount: null,
      specialLimit: null,
      fastlDiscount: null,
      fastlLimit: null,
      taxilDiscount: null,
      taxilLimit: null,
      descript: null,
      status: 1,
      type: null,
    });

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        name: null,
        specialDiscount: null,
        specialLimit: null,
        fastlDiscount: null,
        fastlLimit: null,
        taxilDiscount: null,
        taxilLimit: null,
        descript: null,
        status: 1,
        type: null,
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
        name: { required: true, trigger: ["blur", "input"], message: "请输入会员名称" },
        specialDiscount: { required: true, trigger: ["blur", "input"], message: "请输入会员折扣" },
        specialLimit: { required: true, trigger: ["blur", "input"], message: "请输入下单限制" },

        fastlDiscount: { required: true, trigger: ["blur", "input"], message: "请输入会员折扣" },
        fastlLimit: { required: true, trigger: ["blur", "input"], message: "请输入下单限制" },

        taxilDiscount: { required: true, trigger: ["blur", "input"], message: "请输入会员折扣" },
        taxilLimit: { required: true, trigger: ["blur", "input"], message: "请输入下单限制" },
        descript: { required: true, trigger: ["blur", "input"], message: "请输入会员描述" },
        type: { required: true, trigger: ["blur", "input"], message: "请选择会员类型" },
      },
      statusOptions,
      memberOption: [
        {
          label: "其他会员",
          value: "1",
        },
      ],
      form,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
