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
      <n-form-item label="帐号" path="account">
        <n-input v-model:value="form.account" clearable :maxlength="20" placeholder="输入帐号" />
      </n-form-item>
      <n-form-item label="用户名称" path="name">
        <n-input v-model:value="form.name" clearable :maxlength="4" placeholder="输入用户名称" />
      </n-form-item>
      <n-form-item label="密码" path="pwd">
        <n-input v-model:value="form.pwd" clearable :maxlength="4" placeholder="输入密码" />
      </n-form-item>
      <n-form-item label="性别" path="sex">
        <n-select v-model:value="form.sex" placeholder="选择性别" :options="sexOptions" />
      </n-form-item>
      <n-form-item label="电话号码" path="phone">
        <n-input v-model:value="form.phone" clearable placeholder="输入电话号码" :maxlength="11" />
      </n-form-item>
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="form.email" :maxlength="50" clearable placeholder="输入邮箱" />
      </n-form-item>
      <n-form-item label="角色" path="roleIds">
        <n-select
          v-model:value="form.roleIds"
          placeholder="选择角色"
          :multiple="true"
          :options="rolesData"
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
import { defineComponent, reactive, toRefs, onMounted, ref } from "vue";
import { FormInst, SelectOption, useMessage } from "naive-ui";
import { rules } from "./data";
import { lockOptions, sexOptions } from "@/config/form";
import { addUser, editUser, getUserDetail, getAllRoles } from "@/api/system/system";
import md5 from "blueimp-md5";
import { UserFormInter } from "./type";
export default defineComponent({
  name: "UserDrawer",
  setup(_, { emit }) {
    const data = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const rolesData = ref<SelectOption[]>([]);
    const form = ref<UserFormInter>({
      name: null,
      sex: null,
      phone: null,
      account: null,
      email: null,
      roleIds: null,
      pwd: null,
      state: 0,
    });
    onMounted(() => {
      getRolesData();
    });

    function openDrawer(t: string, adminId: string) {
      if (adminId) {
        getDetail(adminId);
      }
      title.value = t;
      data.isDrawer = true;
    }

    const getRolesData = async () => {
      try {
        let res = await getAllRoles();
        console.log(res);
        rolesData.value = res.data.map((item: { name: string; roleId: string }) => {
          return {
            label: item.name,
            value: item.roleId,
          };
        });
      } catch (err) {
        console.log(err);
        data.loading = false;
      }
    };

    const getDetail = async (adminId: string) => {
      try {
        let res = await getUserDetail({ adminId });
        console.log(res);
        form.value = res.data;
        form.value.roleIds = res.data.roles.map((item: { roleId: string }) => item.roleId);
        console.log(form.value.roleIds);
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
            const { adminId, name, sex, phone, account, email, state, roleIds, pwd } = form.value;
            let option = {
              name,
              sex,
              phone,
              account,
              email,
              state,
              roleIds,
              pwd: md5(pwd as string),
            };
            if (!form.value.adminId) {
              res = await addUser(option);
              console.log(res);
            } else {
              res = await editUser({ adminId, ...option });
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

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        name: null,
        pwd: null,
        sex: null,
        phone: null,
        account: null,
        email: null,
        roleIds: null,
        state: 0,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      data.isDrawer = false;
      data.loading = false;
      data.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(data),
      formRef,
      title,
      rules,
      lockOptions,
      rolesData,
      sexOptions,
      form,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
