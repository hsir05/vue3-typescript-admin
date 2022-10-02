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
        clearable
        v-model:value="formValue.account"
        @keyup.enter="handleSubmit"
        :maxlength="20"
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
        clearable
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
    <div class="other mb-5px">
      <router-link class="resetPWd" to="/resetPwd">忘记密码?</router-link>
    </div>
    <n-form-item path="isAgree" class="policy-checkbox h-50px">
      <span class="privacy-policy">
        <n-checkbox v-model:checked="formValue.isAgree" class="mr-10px" />已阅读并同意帐号
        <a href="" class="policy">用户协议</a> 和 <a href="" class="policy">隐私政策</a>
      </span>
    </n-form-item>
    <n-form-item>
      <n-button type="primary" class="login-btn" :loading="loading" @click="handleSubmit">
        登录
      </n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { FormInst } from "naive-ui";
import { useAppUserStore } from "@/store/modules/useUserStore";
import { useRoute, useRouter } from "vue-router";
import { PersonOutline, LockClosedOutline } from "@vicons/ionicons5";
// import md5 from "blueimp-md5";

const formRef = ref<FormInst | null>(null);

const loading = ref(false);
const route = useRoute();
const router = useRouter();
const { login } = useAppUserStore();
const formValue = ref({
  account: null,
  password: null,
  isAgree: false,
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
  isAgree: {
    type: "boolean",
    required: true,
    validator() {
      if (!formValue.value.isAgree) {
        return new Error("请点击同意帐号用户协议和隐私政策");
      }
    },
    message: "请点击同意帐号用户协议和隐私政策",
    trigger: ["blur", "change"],
  },
};
</script>
<style lang="scss" scoped>
:deep(.policy-checkbox .n-form-item-feedback-wrapper) {
  font-size: 10px;
  margin-top: -9px;
}

:deep(.policy-checkbox n-checkbox__label) {
  font-size: 12px;
}

.tips {
  color: #617288;
}

.resetPWd {
  font-size: 12px;
  color: rgba(51, 51, 51, 1);
}

.privacy-policy {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
}

.policy {
  color: #333;
}
</style>
