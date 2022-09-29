<template>
  <n-form
    ref="formRef"
    label-placement="left"
    size="large"
    :model="formValue"
    :rules="rules"
    class="mt-20px"
  >
    <n-form-item ref="formPhoneRef" path="principal">
      <n-input
        v-model:value="formValue.principal"
        :maxlength="11"
        clearable
        @keyup.enter="handleSubmit"
        placeholder="请输入手机号"
        class="w-400px"
      >
        <template #prefix>
          <n-icon :component="PhonePortraitOutline" size="18" color="#808695" />
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="credentials">
      <n-input-group>
        <n-input
          @keyup.enter="handleSubmit"
          v-model:value="formValue.credentials"
          :maxlength="6"
          clearable
          showPasswordOn="click"
          placeholder="请输入验证码"
          class="w-400px"
        >
          <template #prefix>
            <n-icon :component="LockClosedOutline" size="18" color="#808695" />
          </template>
        </n-input>
        <n-button
          type="primary"
          ghost
          @click="handleVerify"
          :disabled="disabled"
          :loading="captchaLoading"
        >
          <span v-if="!disabled">{{ btnMsg }}</span>
          <n-countdown
            v-else
            :duration="duration"
            :render="renderCountdown"
            :on-finish="countDownFinished"
          />
        </n-button>
      </n-input-group>
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
      <n-button type="primary" :loading="loading" @click="handleSubmit" class="login-btn">
        登录
      </n-button>
    </n-form-item>
  </n-form>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PhonePortraitOutline, LockClosedOutline } from "@vicons/ionicons5";
import { useAppUserStore } from "@/store/modules/useUserStore";
import { FormInter } from "./type";
import { FormInst, useMessage, CountdownProps, FormRules } from "naive-ui";
import { getLoginCaptcha } from "@/api/system/system";
import { CAPTCHA_EXPIRATION_TIME_KEY } from "@/config/constant";
import { locStorage } from "@/utils/storage";

const formRef = ref<FormInst | null>(null);
const formPhoneRef = ref();
const loading = ref(false);
const captchaLoading = ref(false);
const btnMsg = ref("获取验证码");
const disabled = ref(false);
const duration = ref();
const formValue = ref<FormInter>({
  principal: null,
  credentials: null,
  isAgree: false,
});
const message = useMessage();
const router = useRouter();
const route = useRoute();
const { login } = useAppUserStore();

const phone = {
  required: true,
  pattern: /^1\d{10}$/,
  message: "请输入正确格式的手机号",
  trigger: ["blur", "input"],
};
const rules: FormRules = {
  principal: phone,
  credentials: { required: true, message: "请输入验证码", trigger: "blur" },
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

const handleSubmit = (e: MouseEvent | KeyboardEvent) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        loading.value = true;
        let option = {
          principal: formValue.value.principal as string,
          credentials: formValue.value.credentials as string,
        };
        await login(option);
        message.success("登录成功");

        setTimeout(() => {
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
    } else {
      console.log(errors);
    }
  });
};
const handleVerify = async () => {
  await formPhoneRef.value?.validate(formValue.value.principal);
  formPhoneRef.value?.restoreValidation();

  captchaLoading.value = true;
  try {
    let res = await getLoginCaptcha({ phone: formValue.value.principal as string });
    console.log(res.data);

    //expirationTime: 1657332893003 releaseTime: 1657332593003
    const { expirationTime, releaseTime } = res.data;
    locStorage.set(CAPTCHA_EXPIRATION_TIME_KEY, expirationTime);

    duration.value = expirationTime - releaseTime;

    message.success("验证码发送成功");
    disabled.value = true;
    captchaLoading.value = false;
  } catch (err) {
    console.log(err);
    captchaLoading.value = false;
  }
};

const renderCountdown: CountdownProps["render"] = ({ minutes, seconds }) => {
  return `重新获取(${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")})`;
};

const countDownFinished = () => {
  disabled.value = false;
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

.login-form {
  margin: 0 auto;
}

.login-btn {
  width: 100%;
}

.other {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(51, 51, 51, 1);
  cursor: pointer;
}

.resetPWd {
  color: rgba(51, 51, 51, 1);
}

.privacy-policy {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
}

.policy {
  color: #333;
}

.grand-type {
  color: $primaryColor;
}
</style>
