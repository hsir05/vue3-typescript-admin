<template>
  <BasicDrawer v-model:show="isDrawer" title="添加兑换码" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="120"
      style="flex-wrap: wrap"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
    >
      <n-form-item label="兑换码" path="code">
        <n-input-group style="width: 260px">
          <n-input
            v-model:value="form.code"
            clearable
            placeholder="输入兑换码"
            :style="{ width: '80%' }"
          />
          <n-button type="primary" ghost> 快速生成 </n-button>
        </n-input-group>
      </n-form-item>

      <n-form-item label="生效时间" path="start">
        <n-date-picker v-model:value="form.start" style="width: 260px" type="date" clearable />
      </n-form-item>

      <n-form-item label="失效时间" path="end">
        <n-date-picker v-model:value="form.end" type="date" style="width: 260px" clearable />
      </n-form-item>

      <n-form-item label="可兑换次数" path="count">
        <n-input-number
          v-model:value="form.count"
          style="width: 260px"
          :min="0"
          clearable
          placeholder="可兑换次数"
        />
      </n-form-item>

      <n-form-item label="兑换实充金额" path="amount">
        <n-input-number
          v-model:value="form.count"
          style="width: 260px"
          :min="0"
          clearable
          placeholder="兑换实充金额"
        />
      </n-form-item>

      <n-form-item label="兑换赠送金额" path="giveAmount">
        <n-input-number
          v-model:value="form.count"
          style="width: 260px"
          :min="0"
          clearable
          placeholder="兑换赠送金额"
        />
      </n-form-item>

      <div cass="text-center">
        <n-button attr-type="button" type="primary" @click="submit">提交</n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { TableDataItemInter } from "./type";
export default defineComponent({
  name: "AmountDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const title = ref("");
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref({
      code: null,
      count: null,
      start: null,
      end: null,
    });

    function openDrawer(t: string, record?: TableDataItemInter) {
      if (record) {
        console.log(record);
        message.success("验证成功");
      }
      title.value = t;
      state.isDrawer = true;
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          console.log(unref(form));

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      form,
      formRef,
      submit,
      ...toRefs(state),
      title,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
