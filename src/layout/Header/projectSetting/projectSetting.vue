<template>
  <BasicDrawer v-model:show="isDrawer" title="项目配置">
    <div class="project-drawer">
      <NavItem
        title="导航栏模式"
        :options="navModeOptions"
        :matchValue="navMode"
        @toggle-handle="toggleNavMode"
      />

      <NavItem
        title="导航栏风格"
        :options="navStyleOptons"
        :matchValue="navStyle"
        @toggle-handle="toggleNavStyle"
      />

      <n-divider title-placement="center">系统主题</n-divider>
      <div class="project-drawer-setting-item align-items-top">
        <span
          class="theme-item"
          v-for="(item, index) in appThemeList"
          :key="index"
          :style="{ 'background-color': item }"
          @click="setProject({ appTheme: item })"
        >
          <n-icon size="12" v-if="item === appTheme">
            <CheckOutlined />
          </n-icon>
        </span>
      </div>

      <n-divider title-placement="center">显示</n-divider>

      <SwitchItem title="显示多页签" :matchValue="isTabs" @toggle-handle="toggleTabs" />
      <SwitchItem
        title="显示面包屑导航"
        :disabled="navMode === 'horizontal'"
        :matchValue="isBreadcrumb"
        @toggle-handle="toggleBreadcrumb"
      />
      <SwitchItem title="显示刷新按钮" :matchValue="isRefresh" @toggle-handle="toggleRefresh" />
      <SwitchItem title="显示页脚" :matchValue="showFooter" @toggle-handle="toggleShowFooter" />

      <n-divider title-placement="center">动画</n-divider>

      <SwitchItem title="禁用动画" :matchValue="isPageAnimate" @toggle-handle="togglePageAnimate" />

      <div class="project-drawer-setting-item">
        <div class="project-drawer-setting-item-title">动画类型</div>
        <div class="project-drawer-setting-item-select">
          <n-select v-model:value="projectStore.pageAnimateType" :options="animateOptions" />
        </div>
      </div>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive } from "vue";
import {
  appThemeList,
  navStyles as navStyleOptons,
  navModes as navModeOptions,
  animates as animateOptions,
} from "@/config/setting";
import { CheckOutlined } from "@vicons/antd";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { useAppProjectStore } from "@/store/modules/useProjectSettingStore";
import { useAppTabsStore } from "@/store/modules/useTabsStore";
import NavItem from "./navItem.vue";
import SwitchItem from "./switchItem.vue";
import { locStorage } from "@/utils/storage";
import { MULTIPLE_TABS_KEY } from "@/config/config";
export default defineComponent({
  name: "ProjectSetting",
  components: { CheckOutlined, NavItem, SwitchItem },
  setup() {
    const state = reactive({
      isDrawer: false,
    });
    const projectStore = useAppProjectStore();
    const {
      appTheme,
      isBreadcrumb,
      isRefresh,
      showFooter,
      isPageAnimate,
      isTabs,
      navMode,
      navStyle,
      setProject,
    } = useProjectSetting();

    function openDrawer() {
      state.isDrawer = true;
    }

    function closeDrawer() {
      state.isDrawer = false;
    }
    function toggleTabs(bool: boolean) {
      if (!bool) {
        const tabsStore = useAppTabsStore();
        locStorage.set(MULTIPLE_TABS_KEY, tabsStore.getTabsList);
      }
      setProject({ isTabs: bool });
    }
    function toggleRefresh(bool: boolean) {
      setProject({ isRefresh: bool });
    }
    function toggleShowFooter(bool: boolean) {
      setProject({ showFooter: bool });
    }
    function toggleNavMode(mode: string) {
      setProject({ navMode: mode });
    }
    function toggleNavStyle(style: string) {
      setProject({ navStyle: style });
    }
    function toggleBreadcrumb(bool: boolean) {
      setProject({ isBreadcrumb: bool });
    }
    function togglePageAnimate(bool: boolean) {
      setProject({ isPageAnimate: bool });
    }

    return {
      ...toRefs(state),
      appThemeList,
      animateOptions,
      isBreadcrumb,
      isPageAnimate,
      isRefresh,
      isTabs,
      showFooter,
      appTheme,
      navMode,
      navStyle,
      navModeOptions,
      navStyleOptons,
      projectStore,

      openDrawer,
      closeDrawer,
      setProject,
      toggleTabs,
      toggleRefresh,
      toggleNavMode,
      toggleNavStyle,
      toggleShowFooter,
      toggleBreadcrumb,
      togglePageAnimate,
    };
  },
});
</script>
<style lang="scss" scoped>
.project-drawer {
  .n-divider:not(.n-divider--vertical) {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .theme-item {
    width: 20px;
    min-width: 20px;
    height: 20px;
    cursor: pointer;
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 0 5px 10px 0;
    text-align: center;
    .n-icon {
      color: #fff;
    }
  }
}
</style>
