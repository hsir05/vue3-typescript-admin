<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '400px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="角色名称" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输角色名称" />
      </n-form-item>
      <n-form-item label="父级" path="parentId">
        <n-select
          v-model:value="form.parentId"
          filterable
          placeholder="选择父级"
          :options="parentOptions"
        />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="form.status">
          <n-space>
            <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="角色描述" path="descript">
        <n-input
          v-model:value="form.descript"
          type="textarea"
          placeholder="输入角色描述"
          round
          clearable
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, unref, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { rules, parentOptions } from "./data";
import { statusOptions } from "@/config/form";
export default defineComponent({
  name: "RoleDrawer",
  setup(_, { emit }) {
    const title = ref("角色");
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<tableDataItem>({
      name: null,
      id: null,
      descript: null,
      parentId: null,
      status: 1,
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
      form.value = { name: null, descript: null, status: 1, parentId: null };
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
      rules,
      statusOptions,
      form,
      parentOptions,

      openDrawer,
      handleReset,
      handleValidate,
      handleSaveAfter,
      onCloseAfter,
    };
  },
});
</script>
