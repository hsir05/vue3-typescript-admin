<template>
  <div class="header-wrap">
    <n-layout-header has-sider :inverted="inverted">
      <div
        class="header-right-set"
        v-if="navMode === 'vertical' || navMode === 'horizontal-mix'"
      >
        <AppLogo v-if="navMode === 'horizontal-mix'" />
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

      <AppLogo v-if="navMode === 'horizontal'" />
      <Menu
        mode="horizontal"
        v-if="navMode === 'horizontal'"
        :inverted="inverted"
        :collapsed="getCollapsed"
      />

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
        <n-tooltip trigger="hover" v-if="isRefresh">
          <template #trigger>
            <n-icon size="18" class="setting-icon" @click="reloadPage">
              <ReloadIcon />
            </n-icon>
          </template>
          刷新当前页面
        </n-tooltip>
        <!--用户头像-->
        <n-dropdown :options="userOptions">
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
  </div>
  <ProjectSetting ref="drawerSetting" />
</template>
<script lang="ts">
import { defineComponent, ref, unref, computed, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import ProjectSetting from "./projectSetting/projectSetting.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb.vue";
import Menu from "@/layout/Sider/Menu.vue";
import AppLogo from "../components/AppLogo/AppLogo.vue";
import { userOptions } from "@/config/projectSetting";
import { SettingsOutline as setttingIcon } from "@vicons/ionicons5";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenExitOutlined as FullScreenExitIcon,
  FullscreenOutlined as FullscreenOutIcon,
  ReloadOutlined as ReloadIcon,
} from "@vicons/antd";

export default defineComponent({
  name: "Header",
  components: {
    Menu,
    AppLogo,
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
    const {
      getCollapsed,
      setCollapsed,
      isBreadcrumb,
      isRefresh,
      navMode,
      navStyle,
    } = useProjectSetting();
    const drawerSetting = ref();

    const inverted = computed(() => unref(navStyle) === "header-dark");

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
      navMode,
      isRefresh,
      inverted,
      userOptions,

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
.header-wrap {
  height: 65px;
}
.n-layout-header {
  @extend .flex;
  height: $header-height;
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
