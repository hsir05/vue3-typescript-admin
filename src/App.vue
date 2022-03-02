<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <RouterView />
  </NConfigProvider>
</template>
<script lang="ts" setup>
import { zhCN, dateZhCN } from "naive-ui";
</script>
