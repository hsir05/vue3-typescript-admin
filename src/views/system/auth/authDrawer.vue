<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '400px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="权限名称" path="name">
        <n-input
          v-model:value="form.name"
          clearable
          :maxlength="20"
          @blur="nameUnique"
          placeholder="输入权限名称"
        />
      </n-form-item>
      <n-form-item label="CODE" path="code">
        <n-input
          v-model:value="form.code"
          clearable
          :maxlength="20"
          @blur="nameUnique"
          placeholder="输入CODE"
        />
      </n-form-item>
      <n-form-item label="状态" path="state">
        <n-radio-group v-model:value="form.state">
          <n-space>
            <n-radio :value="item.value" v-for="item in lockOptions" :key="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="权限路径" path="url">
        <n-input
          v-model:value="form.url"
          type="textarea"
          :maxlength="150"
          placeholder="输入权限路径"
          round
          clearable
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage, FormItemRule, SelectOption } from "naive-ui";
import { verifyCN } from "@/utils/verify";
import { FormInter } from "./type";
import { lockOptions } from "@/config/form";
import { addAuth, editAuth, getAuthDetail, authNameUniqueCheck } from "@/api/system/system";
export default defineComponent({
  name: "AuthDrawer",
  setup(_, { emit }) {
    const title = ref("权限");
    const data = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<FormInter>({
      name: null,
      code: null,
      url: null,
      state: 0,
    });
    const rolesOptions = ref<SelectOption[]>([]);

    function openDrawer(t: string, authorityId: string) {
      if (authorityId) {
        getDetail(authorityId);
      }
      title.value = t;
      data.isDrawer = true;
    }

    const getDetail = async (authorityId: string) => {
      try {
        let res = await getAuthDetail({ authorityId });
        console.log(res);
        form.value = res.data;
      } catch (err) {
        console.log(err);
        data.loading = false;
      }
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          data.loading = true;
          try {
            let res;
            const { authorityId, name, code, url, state } = form.value;
            let option = { name, code, url, state };
            if (!form.value.authorityId) {
              res = await addAuth(option);
              console.log(res);
            } else {
              res = await editAuth({ authorityId, ...option });
            }
            data.loading = false;
            message.success(window.$tips[res.code]);
            handleSaveAfter();
          } catch (err) {
            console.log(err);
            data.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    async function nameUnique() {
      try {
        let res = await authNameUniqueCheck({
          name: form.value.name,
        });
        console.log(res);
        if (res.data.UniqueBooleanResult) {
          form.value.name = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      const authorityId = form.value.authorityId;
      form.value = {
        authorityId,
        name: null,
        code: null,
        url: null,
        state: 0,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      data.isDrawer = false;
      data.loading = false;
      data.disabled = false;
      form.value.authorityId = null;
      handleReset();
    }

    return {
      ...toRefs(data),
      formRef,
      title,
      rules: {
        name: {
          required: true,
          trigger: ["blur", "input"],
          validator: (rule: FormItemRule, value: string) => {
            return verifyCN(rule, value);
          },
          message: "请输入中文权限名称",
        },
        code: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入code",
        },
        url: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入权限路径",
        },
      },
      lockOptions,
      rolesOptions,
      form,
      openDrawer,
      nameUnique,
      handleReset,
      handleValidate,
      handleSaveAfter,
      onCloseAfter,
    };
  },
});
</script>
