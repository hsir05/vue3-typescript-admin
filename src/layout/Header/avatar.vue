<template>
  <n-dropdown :options="userOptions" @select="closeHandleSelect">
    <div class="header-user">
      <n-avatar round style="cursor: pointer" size="medium" src="">{{
        userStore.getUsername
      }}</n-avatar>
      <span class="header-username">{{ userStore.getUsername }}</span>
    </div>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { userOptions } from "@/config/setting";
import { useRouter } from "vue-router";
import { useAppUserStore } from "@/store/modules/useUserStore";

const router = useRouter();
const userStore = useAppUserStore();

const closeHandleSelect = async (key: any) => {
  if (key === "profile") {
    router.push({ path: "/setting/profile" });
  } else {
    await userStore.logout();
    router.push({ path: "/login" });
  }
};
</script>
