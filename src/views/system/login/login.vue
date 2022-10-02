<template>
  <div class="login-container">
    <div class="login-mobile-logo">
      <img src="../../../assets/image/logo.png" alt="" />
    </div>
    <div class="login">
      <div class="login-left">
        <!-- <div class="login-title">
          <div class="login-title-img">
            <img src="../../../assets/image/logo.svg" alt="logo" style="width: 100%" />
          </div>
        </div> -->
        <div class="login-left-img">
          <img src="../../../assets/image/login-middle.png" style="width: 100%" alt="" />
        </div>
        <div class="login-info">
          <p>xxxxxx服务有限公司</p>
          <p>Copyright © 2022 xxx有限公司 · 技术支持</p>
        </div>
      </div>
      <div class="login-form">
        <span class="login-form-title mb-30px">综合管理系统</span>

        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="密码登录">
            <PasswordLogin />
          </n-tab-pane>
          <n-tab-pane name="signup" tab="验证码登录">
            <CodeLogin />
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PasswordLogin from "./password.vue";
import CodeLogin from "./code.vue";
</script>
<style lang="scss">
.login-container {
  background-color: #edf2f8;
  position: relative;
  width: 100%;
  height: 100%;

  .tab-active {
    &:after {
      width: 100%;
      height: 2px;
      background-color: red;
    }
  }

  .login-mobile-logo {
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
    background: url("../../../assets/image/login-bg2.png") center no-repeat;
    background-size: cover;
    padding: 30px 70px;
    padding-top: 130px;
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
    padding: 40px 115px 0;
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
    background: url("../../../assets/image/login-bg2-m.png") top no-repeat;
    background-size: contain;

    .login-mobile-logo {
      display: block;
      text-align: center;
      padding-top: 70px;
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
      width: 80%;
      border-radius: 8px;
      padding: 40px 25px 16px;
      margin: 0 auto;
      box-shadow: 0px 5px 8px 0px rgb(29 77 228 / 15%);
    }
  }
}
</style>
