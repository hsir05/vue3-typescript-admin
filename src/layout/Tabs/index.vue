<template>
  <div class="tabs-view">
    <div class="tabs-view-main">
      <div class="tabs-card">
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          v-for="(tab, index) in tabsList"
          :key="index"
          :options="tabsOptions"
          @clickoutside="onClickOutside"
          @select="closeHandleSelect"
        >
          <div class="tab-card-scroll-item" @click="goPage(tab)">
            <span :class="[activeKey === tab.path ? 'tab-card-scroll-item-active' : '']">{{
              tab.meta?.title
            }}</span>
            <n-icon
              size="18"
              class="ml-5px"
              v-if="tab.path !== baseHome"
              @click.stop="closeTabItem(tab)"
            >
              <CloseOutIcon />
            </n-icon>
          </div>
        </n-dropdown>
      </div>

      <div class="tabs-close">
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          :options="tabsOptions"
          @clickoutside="onClickOutside"
          @select="closeHandleSelect"
          class="tabs-close"
        >
          <span class="tabs-close-btn">
            <n-icon size="18">
              <ChevronDownIcon />
            </n-icon>
          </span>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, computed, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppTabsStore } from "@/store/modules/useTabsStore";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { RouteItem } from "@/store/modules/useTabsStore";
import { locStorage } from "@/utils/storage";
import { TABS_ROUTES_KEY } from "@/config/config";
import { PageEnum } from "@/enums/pageEnum";
import {
  ChevronDownOutline as ChevronDownIcon,
  CloseOutline as CloseOutIcon,
  RemoveOutline as RemoveOutIcon,
} from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";
import { ReloadOutlined as ReloadIcon, SwapOutlined as SwapOutIcon } from "@vicons/antd";

export default defineComponent({
  name: "Tabs",
  components: {
    ChevronDownIcon,
    CloseOutIcon,
  },
  setup() {
    const state = reactive({
      activeKey: "",
      showDropdown: false,
    });
    const route = useRoute();
    const router = useRouter();

    const tabsStore = useAppTabsStore();

    const { appTheme } = useProjectSetting();

    // 获取简易的路由对象
    const getSimpleRoute = (route: any): RouteItem => {
      const { fullPath, hash, meta, params, path, query } = route;
      return { fullPath, hash, meta, name: meta.title, params, path, query };
    };

    let cacheRoutes: RouteItem[] = [];
    const simpleRoute = getSimpleRoute(route);

    try {
      const routesStr = locStorage.get(TABS_ROUTES_KEY);
      cacheRoutes = routesStr ? JSON.parse(routesStr) : [simpleRoute];
    } catch (e) {
      cacheRoutes = [simpleRoute];
    }

    // const routes = router.getRoutes();
    // cacheRoutes.forEach((cacheRoute) => {
    //   const route = routes.find((route) => route.path === cacheRoute.path);
    //   if (route) {
    //     cacheRoute.meta = route.meta || cacheRoute.meta;
    //     cacheRoute.name = (route.name || cacheRoute.name) as string;
    //   }
    // });
    // 初始化标签页
    tabsStore.initTabs(cacheRoutes);

    const tabsList = computed(() =>
      tabsStore.getTabsList.filter((item: RouteItem) => !item.meta?.hideTab)
    );

    // 在页面关闭或刷新之前，保存数据
    window.addEventListener("beforeunload", () => {
      locStorage.set(TABS_ROUTES_KEY, JSON.stringify(tabsList.value));
    });
    const whiteList: string[] = [
      PageEnum.BASE_LOGIN_NAME,
      PageEnum.REDIRECT_NAME,
      PageEnum.ERROR_PAGE_NAME,
    ];

    watch(
      () => route.fullPath,
      (to) => {
        if (whiteList.includes(route.name as string)) return;
        state.activeKey = to;
        tabsStore.addTab(getSimpleRoute(route));
        // updateNavScroll(true);
      },
      { immediate: true }
    );

    const tabsOptions = computed(() => {
      const isDisabled = unref(tabsList).length <= 1;
      return [
        {
          label: "刷新当前",
          key: "1",
          icon: renderIcon(ReloadIcon),
        },
        {
          label: "关闭当前",
          key: "2",
          disabled: isDisabled,
          icon: renderIcon(RemoveOutIcon),
        },
        {
          label: "关闭其他",
          key: "3",
          disabled: isDisabled,
          icon: renderIcon(SwapOutIcon),
        },
        {
          label: "关闭全部",
          key: "4",
          disabled: isDisabled,
          icon: renderIcon(CloseOutIcon),
        },
      ];
    });

    function goPage(e: RouteItem) {
      const { fullPath } = e;
      if (fullPath === route.fullPath) return;
      state.activeKey = fullPath;
      router.push({ path: fullPath });
    }
    function closeTabItem(e: RouteItem) {
      const { fullPath } = e;
      const routeInfo = tabsList.value.find((item: RouteItem) => item.fullPath == fullPath);
      removeTab(routeInfo as RouteItem);
    }
    const removeTab = async (route: RouteItem) => {
      try {
        await tabsStore.closeCurrentTab(route);
        if (state.activeKey === route.fullPath) {
          const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
          state.activeKey = currentRoute.fullPath;
          router.push(currentRoute.fullPath);
        }
      } catch (err) {
        console.log(err);
      }
    };

    function onClickOutside() {
      state.showDropdown = false;
    }
    function closeOther(route: any) {
      tabsStore.closeOtherTabs(route);
      state.activeKey = route.fullPath;
      router.replace(route.fullPath);
    }
    function closeAll(e: RouteItem) {
      tabsStore.closeAllTab(e);
      router.replace(PageEnum.BASE_HOME);
    }
    function reloadPage() {
      router.push({
        path: "/redirect" + unref(route).fullPath,
      });
    }
    const closeHandleSelect = (key: any) => {
      switch (key) {
        //刷新
        case "1":
          reloadPage();
          break;
        //关闭
        case "2":
          removeTab(route as RouteItem);
          break;
        //关闭其他
        case "3":
          closeOther(route);
          break;
        //关闭所有
        case "4":
          closeAll(route as RouteItem);
          break;
      }
      // updateNavScroll();
      state.showDropdown = false;
    };

    return {
      ...toRefs(state),
      tabsOptions,
      tabsList,
      appTheme,
      baseHome: PageEnum.BASE_HOME,

      goPage,
      closeTabItem,
      onClickOutside,
      closeHandleSelect,
    };
  },
});
</script>
<style lang="scss" scoped>
.tabs-view {
  $w: 35px;
  width: 100%;
  padding: 5px 0 0;
  display: flex;
  transition: all 0.2s ease-in-out;
  background-color: #f2f3f5;
  &-main {
    height: $w;
    display: flex;
    padding: 0 5px;
    max-width: 100%;
    min-width: 100%;
    box-sizing: border-box;
  }
  .tabs-card {
    -webkit-box-flex: 1;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
    position: relative;
  }
  .tab-card-scroll-item {
    background: $white;
    color: #333639;
    height: 25px;
    padding: 4px 10px;
    border-radius: 3px;
    margin-right: 6px;
    cursor: pointer;
    display: inline-block;
    position: relative;
    flex: 0 0 auto;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
  }
  .tabs-card-next-hide,
  .tabs-card-prev-hide {
    display: none;
  }
  .tab-card-scroll-item-active {
    color: v-bind(appTheme);
  }
  .tabs-close {
    min-width: $w;
    width: $w;
    height: $w;
    line-height: $w;
    text-align: center;
    background: $white;
    display: inline-block;
    border-radius: 2px;
    cursor: pointer;
    &-btn {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
