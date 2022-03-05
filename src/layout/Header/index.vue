<template>
  <n-layout-header content-style="height:45px">
    <div class>
      <span class @click="handleCollapsed">
        <n-icon size="18" v-if="getCollapsed" class="setting-icon">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else class="setting-icon">
          <MenuFoldOutlined />
        </n-icon>
      </span>
    </div>
    <div class="header-right-set">
      <!--切换全屏-->
      <n-tooltip placement="bottom">
        <template #trigger>
          <n-icon size="18" class="setting-icon">
            <component :is="fullscreenIcon" @click="toggleFullScreen" />
          </n-icon>
        </template>
        <span>全屏</span>
      </n-tooltip>

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

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="18" class="setting-icon" @click="openSetting">
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
import { SettingsOutline as setttingIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";
import ProjectSetting from "./projectSetting/projectSetting.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@vicons/antd";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";
import {
  FullscreenExitOutlined as FullScreenExitIcon,
  FullscreenOutlined as FullscreenOutIcon,
} from "@vicons/antd";

export default defineComponent({
  name: "Header",
  components: {
    FullScreenExitIcon,
    FullscreenOutIcon,
    setttingIcon,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ProjectSetting,
  },
  setup() {
    const state = reactive({
      fullscreenIcon: "FullscreenOutIcon",
    });
    const { getCollapsed, setCollapsed } = useProjectSetting();
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

    // 监听全屏切换事件
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

    return {
      ...toRefs(state),
      drawerSetting,
      getCollapsed,
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

      openSetting,
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
  }
  .header-username {
    font-size: 14px;
    margin-left: 10px;
  }
  .setting-icon {
    padding: 20px 25px;
    cursor: pointer;
  }
}
</style>
