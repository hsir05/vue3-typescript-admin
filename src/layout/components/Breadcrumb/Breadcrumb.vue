<template>
  <n-breadcrumb>
    <n-breadcrumb-item>
      <n-dropdown :options="options1">系统管理</n-dropdown>
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      <n-dropdown>字典管理</n-dropdown>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Breadcrumb",
  setup() {
    return {
      options1: [
        {
          label: "系统管理",
          key: 1,
        },
        {
          label: "字段管理",
          key: 2,
        },
      ],
    };
  },
});
</script>
