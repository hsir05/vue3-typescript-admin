<template>
  <div class="dashboard">
    <n-button type="primary">Primary</n-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import { getCaptcha } from "@/api/system/dict";
export default defineComponent({
  name: "Dashboard",
  components: {},
  setup() {
    // const getData = async () => {
    //   try {
    //     let res = await getCaptcha();
    //     console.log(res);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // getData();
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
  box-sizing: border-box;
}
</style>
