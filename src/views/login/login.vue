<template>
  <div class="login-wrap">
    <div class="logo-title">
      <img src="../../assets/logo.png" alt="logo" />
      <span class="ml-20px" style="vertical-align: middle"
        >益民出行综合管理平台</span
      >
    </div>
    <div class="logo-middle">
      <img src="../../assets/login-middle.png" class="" alt="" />

      <div class="logo-form ml-150px">
          <h2>系统登录</h2>
        <n-form ref="formRef" :model="formValue" :rules="rules">
          <n-form-item path="account">
            <n-input
              v-model:value="formValue.account"
              placeholder="输入帐号"
            />

            <!-- <n-input placeholder="搜索">
                <template #prefix>
                    <n-icon :component="FlashOutline" />
                </template>
            </n-input> -->
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formValue.password"
              placeholder="输入密码"
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" attr-type="button" style="width: 100%;" @click="handleValidateClick">
              立即登录
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
    <div class="logo-bottom">
      <p>甘肃省兰州市城关区庆阳路488号万盛商务大厦28楼</p>
      <p>兰州益民出行汽车服务有限公司</p>
      <p>Copyright © 2022 甘肃诚诚网络技术有限公司 · 技术支持</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";

export default defineComponent({
  name: "Login",
  components: {},
  setup() {
    const formRef = ref<FormInst | null>(null);
    // const message = useMessage()

    const handleValidateClick = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          // message.success('Valid')
        } else {
          console.log(errors);
          // message.error('Invalid')
        }
      });
    };
    return {
      formRef,
      formValue: ref({
          account: "",
        password: "",
      }),
      rules: {
        user: {
          name: {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          age: {
            required: true,
            message: "请输入年龄",
            trigger: ["input", "blur"],
          },
        },
        phone: {
          required: true,
          message: "请输入电话号码",
          trigger: ["input"],
        },
      },
      handleValidateClick,
    };
  },
});
</script>
<style lang="scss">
.login-wrap {
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  height: 100vh;
  width: 100vw;
  position: relative;
  background: url("../../assets/login-bg.png") top no-repeat;
  background-size: 100% 90%;
  .logo-title {
    font-size: 3.65rem;
    font-weight: 700;
    color: white;
    margin: 0 auto;
    padding-top: 30px;
    @extend .flex;
  }
  .logo-middle {
    text-align: center;
    margin-top: 100px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    img {
      margin-left: -150px;
    }
  }
  .logo-form {
    background-color: white;
    width: 320px;
    height: 400px;
    border-radius: 3px;
    text-align: left;
    display: inline-block;
    padding: 25px;
  }
  .logo-bottom {
    background-color: #d2d6de;
    color: #666;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    padding: 15px 0;
    p {
      margin: 0;
      margin-top: 5px;
    }
  }
}
</style>
