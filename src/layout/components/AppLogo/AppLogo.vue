<template>
  <div class="app-logo" :style="`${getCollapsed ? 'width:100%' : 'width:200px'}`">
    <img src="../../../assets/image/logo.svg" class="w-30px mr-10px rounded" alt="logo" />
    <span :class="['logo-title', getCollapsed ? 'logo-title-no-active' : 'logo-title-active']">{{
      title
    }}</span>
  </div>
</template>
<script lang="ts" setup>
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
const { getCollapsed } = useProjectSetting();

const title = import.meta.env.VITE_GLOB_APP_SHORT_TITLE;
</script>
<style lang="scss">
.app-logo {
  width: 100%;
  height: $header-height;
  display: flex;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
  transition: all 0.1s ease;
  .logo-title {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    overflow: hidden;
    transition: width 0.2s ease;
  }
  .logo-title-no-active {
    display: none;
  }
  .logo-title-active {
    display: inline-block;
  }
}
</style>
