<template><i></i></template>
<script lang="ts">
import { useMessage } from "naive-ui";
import { tips } from "@/config/tips";
export default {
  name: "MessageContent",
  setup() {
    //挂载在 window 方便与在js中使用
    window.$message = useMessage();
    window.$tips = tips;
  },
};
</script>
