<template>
  <n-layout-header content-style="height:45px">
    <div class>
      <span class>
        <n-icon size="18" class="setting-icon">
          <ListSharpIcon />
        </n-icon>
      </span>
    </div>
    <div class="header-right-set">
      <n-dropdown :options="options">
        <n-avatar
          round
          style="cursor: pointer"
          size="medium"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          >Admin</n-avatar
        >
      </n-dropdown>

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="18" class="setting-icon" @click="activate('right')">
            <setttingIcon />
          </n-icon>
        </template>
        项目配置
      </n-tooltip>
    </div>
  </n-layout-header>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import type { DrawerPlacement } from "naive-ui";
import { SettingsOutline as setttingIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  ListSharp as ListSharpIcon,
} from "@vicons/ionicons5";

export default defineComponent({
  name: "Header",
  components: { setttingIcon, ListSharpIcon },
  setup() {
    const active = ref(false);
    const placement = ref<DrawerPlacement>("right");
    const activate = (place: DrawerPlacement) => {
      active.value = true;
      placement.value = place;
    };

    return {
      activate,
      options: [
        {
          label: "个人中心",
          key: "profile",
          icon: renderIcon(UserIcon),
        },
        {
          label: "修改密码",
          key: "editProfile",
          icon: renderIcon(EditIcon),
        },
        {
          label: "退出登录",
          key: "logout",
          icon: renderIcon(LogoutIcon),
        },
      ],
    };
  },
});
</script>
<style lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.n-layout-header {
  @extend .flex;
  height: 64px;
  box-shadow: 0 1px 4px #00152914;

  //   background-color: orange;
  .header-right-set {
    line-height: 1;
    @extend .flex;
  }
  .setting-icon {
    padding: 20px 25px;
    cursor: pointer;
  }
}
</style>
