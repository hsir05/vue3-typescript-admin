<template>
  <n-dropdown :options="userOptions" :on-select="closeHandleSelect">
    <div class="header-user">
      <n-avatar round style="cursor: pointer" size="medium" src="">{{
        userStore.getAccount
      }}</n-avatar>
      <span class="header-username">{{ userStore.getAccount }}</span>
    </div>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { userOptions } from "@/config/setting";
import { useRouter } from "vue-router";
import { useAppUserStore } from "@/store/modules/useUserStore";
import { useDialog } from "naive-ui";

const router = useRouter();
const userStore = useAppUserStore();
const dialog = useDialog();

const closeHandleSelect = async (key: string) => {
  if (key === "profile") {
    router.push({ path: "/setting/profile" });
  } else {
    dialog.warning({
      title: "警告",
      content: "你确定？",
      positiveText: "确定",
      negativeText: "不确定",
      onPositiveClick: async () => {
        await userStore.logout();
        router.push({ path: "/login" });
      },
      onNegativeClick: () => {},
    });
  }
};
</script>
