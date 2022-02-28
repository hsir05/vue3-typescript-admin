<template>
  <div class="logo">
    <img src="../../assets/logo-180x180.png" class="w-25px mr-5px" alt="logo" />
    <span class="logo-title">{{title}}</span>
  </div>
</template>
<script lang="ts" setup>
const title = import.meta.env.VITE_GLOB_APP_TITLE
</script>
<style lang="scss">
.logo {
  width: 100%;
  @apply h-45px text-center flex;
  align-items: center;
  justify-content: center;

  .logo-title {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
