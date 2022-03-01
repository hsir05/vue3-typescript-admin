<template>
  <div class="logo">
    <img
      src="../../assets/logo-180x180.png"
      class="w-30px mr-10px rounded"
      alt="logo"/>
    <span class="logo-title">{{ title }}</span>
  </div>
</template>
<script lang="ts" setup>
const title = import.meta.env.VITE_GLOB_APP_SHORT_TITLE;
</script>
<style lang="scss">
.logo {
  width: 100%;
  height: 64px;
  @apply flex;
  align-items: center;
  padding-left: 32px;
  box-sizing: border-box;

  .logo-title {
    font-size: 18px;
    font-weight: 700;
  }
}
</style>
