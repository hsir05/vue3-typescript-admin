<template>
  <n-form
    ref="formRef"
    label-placement="left"
    class="mt-20px"
    size="large"
    :model="formValue"
    :rules="rules"
  >
    <n-form-item path="account">
      <n-input
        v-model:value="formValue.account"
        @keyup.enter="handleSubmit"
        placeholder="请输入用户名"
      >
        <template #prefix>
          <n-icon size="18" color="#808695">
            <PersonOutline />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input
        @keyup.enter="handleSubmit"
        v-model:value="formValue.password"
        type="password"
        showPasswordOn="click"
        placeholder="请输入密码"
      >
        <template #prefix>
          <n-icon size="18" color="#808695">
            <LockClosedOutline />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>

    <n-form-item>
      <n-button type="primary" class="login-btn" :loading="loading" @click="handleSubmit">
        登录
      </n-button>
    </n-form-item>
    <span class="tips">如果登录遇到问题， 请联系客服</span>
  </n-form>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { FormInst } from "naive-ui";
import { useAppUserStore } from "@/store/modules/useUserStore";
import { useRoute, useRouter } from "vue-router";
import { PersonOutline, LockClosedOutline } from "@vicons/ionicons5";

const formRef = ref<FormInst | null>(null);

const loading = ref(false);
const route = useRoute();
const router = useRouter();
const { login } = useAppUserStore();
const formValue = ref({
  account: "admin",
  password: "password",
  captcha: "123456",
});

const loginUser = async () => {
  loading.value = true;
  try {
    await login({ ...formValue.value });
    window.$message.success("登录成功，即将进入系统");
    setTimeout(() => {
      loading.value = false;
      const { query } = route;
      if (query.redirect) {
        router.replace({ path: query.redirect as string });
      } else {
        router.replace({ path: "/dashboard" });
      }
      loading.value = false;
    }, 1000);
  } catch (err) {
    console.log(err);
    loading.value = false;
  }
};
const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      loginUser();
    } else {
      console.log(errors);
    }
  });
};

const rules = {
  account: { required: true, message: "请输入用户名", trigger: "blur" },
  password: { required: true, message: "请输入密码", trigger: "blur" },
  captcha: { required: true, message: "请输入验证码", trigger: "blur" },
};
</script>
<style lang="scss" scoped>
.tips {
  color: #617288;
}
</style>
