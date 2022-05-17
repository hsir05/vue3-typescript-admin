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
      <n-form-item label="角色名称" path="name">
        <n-input
          v-model:value="form.name"
          clearable
          :maxlength="20"
          @blur="nameUnique"
          placeholder="输角色名称"
        />
      </n-form-item>
      <n-form-item label="父级" path="parentRoleId">
        <n-select
          v-model:value="form.parentRoleId"
          clearable
          filterable
          placeholder="选择父级"
          :options="rolesOptions"
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

      <n-form-item label="角色描述" path="description">
        <n-input
          v-model:value="form.description"
          type="textarea"
          :maxlength="150"
          placeholder="输入角色描述"
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
import { RoleFormInter } from "./type";
import { lockOptions } from "@/config/form";
import { addRole, editRole, getRoleDetail, nameUniqueCheck } from "@/api/system/system";
export default defineComponent({
  name: "RoleDrawer",
  setup(_, { emit }) {
    const title = ref("角色");
    const data = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<RoleFormInter>({
      name: null,
      parentRoleId: "388927c1f9d642d48d827f461820ac8b",
      description: null,
      createTime: null,
      state: 1,
    });
    const rolesOptions = ref<SelectOption[]>([]);

    function openDrawer(t: string, roleId: string) {
      if (roleId) {
        getDetail(roleId);
      }
      title.value = t;
      data.isDrawer = true;
    }

    const getDetail = async (roleId: string) => {
      try {
        let res = await getRoleDetail({ roleId });
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
            const { roleId, name, parentRoleId, description, state } = form.value;
            let option = { name, parentRoleId, description, state };
            if (!form.value.roleId) {
              res = await addRole(option);
              console.log(res);
            } else {
              res = await editRole({ roleId, ...option });
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
        let res = await nameUniqueCheck({
          name: form.value.name,
          parentRoleId: form.value.parentRoleId as string,
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
      const roleId = form.value.roleId;
      form.value = { roleId, name: null, parentRoleId: null, description: null, state: 1 };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      data.isDrawer = false;
      data.loading = false;
      data.disabled = false;
      form.value.roleId = null;
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
          message: "请输入中文角色名称",
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
