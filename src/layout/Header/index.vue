<template>
  <div :class="{ 'header-wrap': !inverted }">
    <n-layout-header has-sider :inverted="inverted">
      <div class="header-right-set" v-if="navMode === 'vertical' || navMode === 'horizontal-mix'">
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
              <component :is="state.fullscreenIcon" @click="toggleFullScreen" />
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
        <!--通知/消息-->
        <n-tooltip trigger="hover" v-if="isRefresh">
          <template #trigger>
            <n-icon size="18" class="setting-icon" @click="notice">
              <BellIcon />
            </n-icon>
          </template>
          通知/消息
        </n-tooltip>
        <!--用户头像-->
        <Avatar />
        <!--项目配置-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="18" class="setting-icon" style="padding-right: 20px" @click="openSetting">
              <setttingIcon />
            </n-icon>
          </template>
          项目配置
        </n-tooltip>
      </div>
    </n-layout-header>
  </div>

  <NoticeModal ref="noticeModalRef" />
  <ProjectSetting ref="drawerSetting" />
</template>
<script lang="ts" setup>
import { ref, unref, computed, reactive, markRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import ProjectSetting from "./projectSetting/projectSetting.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb.vue";
import Menu from "@/layout/Sider/Menu.vue";
import AppLogo from "../components/AppLogo/AppLogo.vue";
import Avatar from "./avatar.vue";
import NoticeModal from "./noticeModal.vue";
import { SettingsOutline as setttingIcon } from "@vicons/ionicons5";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenExitOutlined as FullScreenExitIcon,
  FullscreenOutlined as FullscreenOutIcon,
  ReloadOutlined as ReloadIcon,
  BellOutlined as BellIcon,
} from "@vicons/antd";

const noticeModalRef = ref();
const router = useRouter();
const route = useRoute();
const state = reactive({
  fullscreenIcon: markRaw(FullscreenOutIcon),
});
const { getCollapsed, isBreadcrumb, isRefresh, navMode, navStyle, setProject } =
  useProjectSetting();
const drawerSetting = ref();

const inverted = computed(() => unref(navStyle) === "header-dark");

const handleCollapsed = () => {
  setProject({ collapsed: !unref(getCollapsed) });
};
const openSetting = () => {
  const { openDrawer } = drawerSetting.value;
  openDrawer();
};

const toggleFullscreenIcon = () =>
  (state.fullscreenIcon =
    document.fullscreenElement !== null
      ? markRaw(FullScreenExitIcon)
      : markRaw(FullScreenExitIcon));

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
const notice = () => {
  noticeModalRef.value.showModal = true;
};
const reloadPage = () => {
  router.push({
    path: "/redirect" + unref(route).fullPath,
  });
};
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
    line-height: 1.5;
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
