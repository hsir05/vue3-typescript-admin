<template>
  <n-layout-content>
    <RouterView />
  </n-layout-content>
</template>
<script lang="ts" setup></script>
<style lang="scss">
.n-layout-content {
  padding: 10px;
  height: calc(100vh - 113px);
  background-color: #f2f3f5;
}
</style>
