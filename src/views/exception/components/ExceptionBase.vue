<template>
  <div class="text-center err-page h-full">
    <div class="w-400px h-400px mt-80px">
      <svg-no-permission v-if="type === '403'" />
      <svg-not-found v-if="type === '404'" />
      <svg-service-error v-if="type === '500'" />
      <router-link :to="PageEnum.BASE_HOME">
        <n-button type="primary" class="mt-30px">回到首页</n-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NButton } from "naive-ui";
import { SvgNoPermission, SvgNotFound, SvgServiceError } from "@/assets/svg/index";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { PageEnum } from "@/enums/pageEnum";
const { appTheme } = useProjectSetting();
interface Props {
  /** 异常类型 */
  type: "403" | "404" | "500";
}

defineProps<Props>();
</script>
<style lang="scss" scoped>
.err-page {
  background-color: $white;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: v-bind(appTheme);
}
</style>
