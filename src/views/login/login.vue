<template>
  <div class="login-container">
      <div class="login-mobile-logo">
          <img src="../../assets/image/logo.png" alt="">
      </div>
    <div class="login">
      <div class="login-left">
        <div class="login-title">
          <div class="login-title-img">
            <img
              src="../../assets/image/logo.png"
              alt="logo"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="login-left-img">
          <img
            src="../../assets/image/login-middle.png"
            style="width: 100%"
            alt=""
          />
        </div>
        <div class="login-info">
          <p>兰州益民出行汽车服务有限公司</p>
          <p>甘肃省兰州市城关区庆阳路488号万盛商务大厦28楼</p>
          <p>Copyright © 2022 甘肃诚诚网络技术有限公司 · 技术支持</p>
        </div>
      </div>
      <div class="login-form">
        <span class="login-form-title">益民出行综合管理平台</span>
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input
              v-model:value="formValue.account"
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

          <n-form-item path="captcha">
            <div class="captcha">
              <img
                src="../../assets/image/image.jpeg"
                style="height: 100%"
                alt=""
              />
            </div>
            <n-input
              v-model:value="formValue.captcha"
              maxlength="4"
              placeholder="请输入验证码"
              style="width: 78%; margin-left: 10px"
            />
          </n-form-item>

          <n-form-item>
            <n-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              登录
            </n-button>
          </n-form-item>

          <span class="tips">如果登录遇到问题， 请联系客服</span>
        </n-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { FormInst } from "naive-ui";
import { PersonOutline, LockClosedOutline } from "@vicons/ionicons5";
export default defineComponent({
  name: "Login",
  components: {
    PersonOutline,
    LockClosedOutline,
  },
  setup() {
    const formRef = ref<FormInst | null>(null);
    // const message = useMessage()
    const loading = ref(false);

    const rules = {
      username: { required: true, message: "请输入用户名", trigger: "blur" },
      password: { required: true, message: "请输入密码", trigger: "blur" },
      captcha: { required: true, message: "请输入验证码", trigger: "blur" },
    };

    const autoLogin = ref(true);

    const formValue = reactive({
      account: "",
      password: "",
      captcha: "",
    });

    const handleSubmit = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          loading.value = true;
          //   message.success('登录成功，即将进入系统');
        } else {
          console.log(errors);
          // message.info('登录失败');
        }
      });
    };
    return {
      formRef,
      rules,
      autoLogin,
      formValue,
      loading,

      handleSubmit,
    };
  },
});
</script>
<style lang="scss">
.login-container {
  background-color: #edf2f8;
  position: relative;
  width: 100%;
  height: 100%;
  .login-mobile-logo{
      display: none;
  }
  .login-btn {
    // background-color: #0082fc;
    width: 100%;
  }
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 1080px;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
  }
  .login-left {
    width: 45%;
    background: url("../../assets/image/login-bg2.png") center no-repeat;
    background-size: cover;
    padding: 64px 70px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .login-title {
    font-size: 22px;
    font-weight: 500;
    color: #ffffff;
    line-height: 33px;
    width: 100%;
    text-align: center;
  }
  .login-title-img {
    width: 130px;
    margin: 0 auto;
  }
  .login-left-img {
    width: 200px;
    margin: 0 auto;
    margin-top: 20px;
  }
  .login-info {
    color: #fff;
    font-size: 12px;
    line-height: 24px;
    font-weight: 400;
    text-align: center;
    margin-top: 15px;
  }
  .login-form {
    width: 55%;
    background-color: #ffffff;
    padding: 70px 115px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .login-form-title {
    font-size: 20px;
    font-family: PingFangSC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 23px;
    display: inline-block;
    margin-bottom: 30px;
  }
  .captcha {
    height: 35px;
    width: 22%;
    border-radius: 2px;
    overflow: hidden;
  }
  .tips {
    color: #617288;
  }
}
@media screen and (max-width: 768px) {
  .login-container {
    background-color: #fff;
    background: url("../../assets/image/login-bg2-m.png") top no-repeat;
    background-size: contain;
    .login-mobile-logo{
        display: block;
        text-align: center;
        padding-top: 70px;
    }
    .login {
    }
    .login-form-title,
    .tips {
      display: block;
      text-align: center;
    }
    .login-left {
      display: none;
    }
    .login-form {
      border-radius: 0;
      width: 80%;
      border-radius: 8px;
      padding: 40px 25px 16px;
      margin: 0 auto;
      box-shadow: 0px 5px 8px 0px rgb(29 77 228 / 15%);
    }
  }
}
</style>
