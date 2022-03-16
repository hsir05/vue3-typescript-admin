<template>
  <n-modal v-model:show="isModal" :close-on-esc="false" :mask-closable="false">
    <n-card
      :style="{ width: width, height: height }"
      :title="title"
      :bordered="true"
      size="huge"
      role="dialog"
      aria-modal="true"
      footer-style="text-align: right"
    >
      <template #header-extra>
        <n-icon size="18" class="cursor-pointer" @click.stop="handleReset">
          <CloseOutIcon />
        </n-icon>
      </template>
      <!-- 内容 -->
      <n-form
        ref="formRef"
        :rules="rules"
        :disabled="disabled"
        label-placement="left"
        :style="{ maxWidth: '560px' }"
        require-mark-placement="right-hanging"
        label-width="150"
        :model="form"
      >
        <n-form-item label="词条名称" path="name">
          <n-input v-model:value="form.name" clearable placeholder="输入词条名称" />
        </n-form-item>
        <n-form-item label="词条编码" path="code">
          <n-input v-model:value="form.code" clearable placeholder="输入词条编码" />
        </n-form-item>
        <n-form-item label="排序" path="sort">
          <n-input v-model:value="form.sort" clearable placeholder="输入词条排序" />
        </n-form-item>

        <n-form-item label="是否拥有子词条" path="isChild">
          <n-radio-group v-model:value="form.isChild">
            <n-radio :value="1">是</n-radio>
            <n-radio :value="0">否</n-radio>
          </n-radio-group>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button @click="handleReset">取消</n-button>
        <n-button type="primary" :loading="loading" class="ml-10px" @click="handleValidate"
          >确认</n-button
        >
      </template>
    </n-card>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, unref, toRefs } from "vue";
import { CloseOutline as CloseOutIcon } from "@vicons/ionicons5";
import { rules } from "./data";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "DictTem",
  components: { CloseOutIcon },
  props: {
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "auto",
    },
  },
  setup() {
    const state = reactive({
      isModal: false,
      loading: false,
      disabled: false,
    });
    const form = ref<tableDataItem>({
      name: null,
      code: null,
      sort: null,
      isChild: 1,
    });
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const title = ref("字典");

    const showModal = (t: string, record?: tableDataItem) => {
      if (record) {
        form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isModal = true;
    };

    function handleReset() {
      form.value = { name: null, code: null, sort: null, isChild: 1 };
      formRef.value?.restoreValidation();
      state.isModal = false;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    return {
      ...toRefs(state),
      rules,
      form,
      title,
      formRef,
      showModal,
      handleReset,
      handleValidate,
    };
  },
});
</script>
