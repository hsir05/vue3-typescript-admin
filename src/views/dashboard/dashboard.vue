<template>
  <div class="dashboard">
    <p class="mt-20px">
      本项目采用 Vue3 + Vue Route4 + Vite + Typescript + Pinia + Naive UI +
      Axios + Sass 开发
    </p>
    <p class="mt-20px">加密采用Blueimp-md5插件对数据进行加密</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dashboard",
  components: {},
  setup() {
    return {};
  },
});
</script>
<style lang="scss">
.dashboard {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
}
</style>
