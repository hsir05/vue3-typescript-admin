<template>
  <n-layout-header content-style="height:45px">
    <div class="header-right-set">
      <span class="pl-10px" @click="handleCollapsed">
        <n-icon size="18" v-if="getCollapsed" class="setting-icon">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else class="setting-icon">
          <MenuFoldOutlined />
        </n-icon>
      </span>
      <Breadcrumb v-if="isBreadcrumb" />
    </div>
    <div class="header-right-set">
      <!--全屏-->
      <n-tooltip placement="bottom">
        <template #trigger>
          <n-icon size="18" class="setting-icon">
            <component :is="fullscreenIcon" @click="toggleFullScreen" />
          </n-icon>
        </template>
        <span>全屏</span>
      </n-tooltip>
      <!--当前刷新-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="18" class="setting-icon" @click="reloadPage">
            <ReloadIcon />
          </n-icon>
        </template>
        刷新当前页面
      </n-tooltip>

      <!--用户头像-->
      <n-dropdown :options="options">
        <div class="header-user">
          <n-avatar
            round
            style="cursor: pointer"
            size="medium"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            >Admin</n-avatar
          >
          <span class="header-username">Admin</span>
        </div>
      </n-dropdown>
      <!--项目配置-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
            size="18"
            class="setting-icon"
            style="padding-right: 20px"
            @click="openSetting"
          >
            <setttingIcon />
          </n-icon>
        </template>
        项目配置
      </n-tooltip>
    </div>
  </n-layout-header>
  <ProjectSetting ref="drawerSetting" />
</template>
<script lang="ts">
import { defineComponent, ref, unref, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { renderIcon } from "@/utils/index";
import ProjectSetting from "./projectSetting/projectSetting.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb.vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@vicons/antd";

import {
  PersonCircleOutline as UserIcon,
  LogOutOutline as LogoutIcon,
  SettingsOutline as setttingIcon,
} from "@vicons/ionicons5";
import {
  FullscreenExitOutlined as FullScreenExitIcon,
  FullscreenOutlined as FullscreenOutIcon,
  ReloadOutlined as ReloadIcon,
} from "@vicons/antd";

export default defineComponent({
  name: "Header",
  components: {
    Breadcrumb,
    ReloadIcon,
    FullScreenExitIcon,
    FullscreenOutIcon,
    setttingIcon,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ProjectSetting,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      fullscreenIcon: "FullscreenOutIcon",
    });
    const { getCollapsed, setCollapsed, isBreadcrumb } = useProjectSetting();
    const drawerSetting = ref();

    const handleCollapsed = () => {
      setCollapsed(!unref(getCollapsed));
    };
    const openSetting = () => {
      const { openDrawer } = drawerSetting.value;
      openDrawer();
    };

    const toggleFullscreenIcon = () =>
      (state.fullscreenIcon =
        document.fullscreenElement !== null
          ? "FullScreenExitIcon"
          : "FullScreenExitIcon");

    document.addEventListener("fullscreenchange", toggleFullscreenIcon);

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    // 刷新页面
    const reloadPage = () => {
      router.push({
        path: "/redirect" + unref(route).fullPath,
      });
    };

    return {
      ...toRefs(state),
      drawerSetting,
      getCollapsed,
      isBreadcrumb,
      options: [
        {
          label: "个人中心",
          key: "profile",
          icon: renderIcon(UserIcon),
        },
        {
          label: "退出登录",
          key: "logout",
          icon: renderIcon(LogoutIcon),
        },
      ],

      openSetting,
      reloadPage,
      handleCollapsed,
      toggleFullScreen,
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

  .header-right-set {
    line-height: 1;
    @extend .flex;
  }
  .header-user {
    @extend .flex;
    padding: 10px 15px;
  }
  .header-username {
    font-size: 14px;
    margin-left: 10px;
  }
  .setting-icon {
    padding: 20px 10px;
    cursor: pointer;
  }
}
</style>
