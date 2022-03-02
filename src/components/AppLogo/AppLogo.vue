<template>
  <div class="app-logo">
    <img
      src="../../assets/logo-180x180.png"
      class="w-30px mr-10px rounded"
      alt="logo"
    />
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
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 18px;
  box-sizing: border-box;

  .logo-title {
    font-size: 18px;
    font-weight: 700;
    display: inline-block;
    overflow: hidden;
    transition: width 0.2s ease;
    
  }
  .logo-title-no-active {
    display: none;
  }
  .logo-title-active{
    display: inline-block;
  }
}
</style>
