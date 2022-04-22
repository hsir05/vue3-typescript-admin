<template>
  <div class="tabs-view" :style="getChangeStyle">
    <div class="tabs-view-main">
      <div ref="navWrap" class="tabs-card" :class="{ 'tabs-card-scrollable': scrollable }">
        <span
          class="tabs-card-prev"
          :class="{ 'tabs-card-prev-hide': !scrollable }"
          @click="scrollPrev"
        >
          <n-icon size="16" color="#515a6e">
            <LeftOutlined />
          </n-icon>
        </span>
        <span
          class="tabs-card-next"
          :class="{ 'tabs-card-next-hide': !scrollable }"
          @click="scrollNext"
        >
          <n-icon size="16" color="#515a6e">
            <RightOutlined />
          </n-icon>
        </span>

        <div ref="navScroll" class="tabs-card-scroll">
          <div
            :id="`tag${tab.fullPath.split('/').join('\/')}`"
            v-for="(tab, index) in tabsList"
            :key="index"
            class="tabs-card-scroll-item"
            :class="{ 'active-item': activeKey === tab.path }"
            @click.stop="goPage(tab)"
            @contextmenu="handleContextMenu($event, tab)"
          >
            <span :class="{ 'tabs-card-scroll-item-active': activeKey === tab.path }">{{
              tab.meta?.title
            }}</span>
            <n-icon
              size="14"
              @click.stop="closeTabItem(tab)"
              class="ml-3px"
              v-if="tab.path !== baseHome"
            >
              <CloseOutIcon />
            </n-icon>
          </div>
        </div>
      </div>

      <div class="tabs-close">
        <n-dropdown
          trigger="hover"
          placement="bottom-end"
          :options="tabsOptions"
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

      <n-dropdown
        :show="showDropdown"
        :x="dropdownX"
        :y="dropdownY"
        @clickoutside="onClickOutside"
        placement="bottom-start"
        @select="closeHandleSelect"
        :options="tabsOptions"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  nextTick,
  ref,
  watch,
  computed,
  onMounted,
  unref,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppTabsStore } from "@/store/modules/useTabsStore";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { RouteItem } from "@/store/modules/useTabsStore";
import { locStorage } from "@/utils/storage";
import { MULTIPLE_TABS_KEY } from "@/config/constant";
import { PageEnum } from "@/enums/pageEnum";
import elementResizeDetectorMaker from "element-resize-detector";
import {
  ChevronDownOutline as ChevronDownIcon,
  CloseOutline as CloseOutIcon,
  RemoveOutline as RemoveOutIcon,
} from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";
import {
  ReloadOutlined as ReloadIcon,
  SwapOutlined as SwapOutIcon,
  LeftOutlined,
  RightOutlined,
} from "@vicons/antd";

export default defineComponent({
  name: "Tabs",
  components: {
    ChevronDownIcon,
    CloseOutIcon,
    RightOutlined,
    LeftOutlined,
  },
  props: {
    collapsed: {
      type: Boolean,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { currentRoute } = useRouter();
    const isCurrent = ref(PageEnum.BASE_HOME === unref(currentRoute).fullPath);

    const state = reactive({
      activeKey: route.fullPath,
      scrollable: false,
      showDropdown: false,
      dropdownX: 0,
      dropdownY: 0,
    });
    const navScroll: any = ref(null);
    const navWrap: any = ref(null);

    const tabsStore = useAppTabsStore();
    const { appTheme, navMode } = useProjectSetting();

    // 获取简易的路由对象
    const getSimpleRoute = (route: any): RouteItem => {
      const { fullPath, hash, meta, params, path, query } = route;
      return { fullPath, hash, meta, name: meta.title, params, path, query };
    };

    let cacheRoutes: RouteItem[] = [];
    const simpleRoute = getSimpleRoute(route);

    try {
      const routesStr = locStorage.get(MULTIPLE_TABS_KEY);
      //   cacheRoutes = routesStr ? JSON.parse(routesStr) : [simpleRoute];
      cacheRoutes = routesStr ? routesStr : [simpleRoute];
    } catch (e) {
      cacheRoutes = [simpleRoute];
    }

    // 初始化标签页
    tabsStore.initTabs(cacheRoutes);

    const tabsList = computed(() =>
      tabsStore.getTabsList.filter((item: RouteItem) => !item.meta?.hideTab)
    );

    window.addEventListener("beforeunload", () => {
      locStorage.set(MULTIPLE_TABS_KEY, tabsList.value);
      //   locStorage.set(TABS_ROUTES_KEY, JSON.stringify(tabsList.value));
    });
    const whiteList: string[] = [
      PageEnum.BASE_LOGIN_NAME,
      PageEnum.REDIRECT_NAME,
      PageEnum.ERROR_PAGE_NAME,
    ];

    watch(
      () => route.fullPath,
      (to) => {
        if (PageEnum.BASE_HOME === unref(currentRoute).fullPath) {
          isCurrent.value = true;
        } else {
          isCurrent.value = false;
        }
        if (whiteList.includes(route.name as string)) return;
        state.activeKey = to;
        tabsStore.addTab(getSimpleRoute(route));
        updateNavScroll(true);
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
          disabled: unref(isCurrent) || isDisabled,
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
      await tabsStore.closeCurrentTab(route);
      if (state.activeKey === route.fullPath) {
        const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
        state.activeKey = currentRoute.fullPath;
        router.push(currentRoute.fullPath);
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

    function handleContextMenu(e: any, item: RouteItem) {
      e.preventDefault();
      isCurrent.value = PageEnum.BASE_HOME === item.path;
      state.showDropdown = false;
      nextTick().then(() => {
        state.showDropdown = true;
        state.dropdownX = e.clientX;
        state.dropdownY = e.clientY;
      });
    }

    // scroll
    //动态组装样式 菜单缩进
    const getChangeStyle = computed(() => {
      const { collapsed } = props;
      const currentNavMode = unref(navMode);
      let lenNum = currentNavMode === "horizontal" ? "0px" : collapsed ? `64px` : `200px`;
      return {
        left: lenNum,
        width: `100%`,
      };
    });
    onMounted(() => {
      onElementResize();
    });

    function handleResize() {
      updateNavScroll(true);
    }

    async function updateNavScroll(autoScroll?: boolean) {
      await nextTick();
      if (!navScroll.value) return;
      const containerWidth = navScroll.value.offsetWidth;
      const navWidth = navScroll.value.scrollWidth;

      if (containerWidth < navWidth) {
        state.scrollable = true;
        if (autoScroll) {
          let tagList = navScroll.value.querySelectorAll(".tabs-card-scroll-item") || [];
          [...tagList].forEach((tag: HTMLElement) => {
            // fix SyntaxError
            if (tag.id === `tag${state.activeKey.split("/").join("\/")}`) {
              tag.scrollIntoView && tag.scrollIntoView();
            }
          });
        }
      } else {
        state.scrollable = false;
      }
    }

    function onElementResize() {
      let observer;
      observer = elementResizeDetectorMaker();
      observer.listenTo(navWrap.value, handleResize);
    }

    function scrollTo(value: number, amplitude: number) {
      const currentScroll = navScroll.value.scrollLeft;
      const scrollWidth =
        (amplitude > 0 && currentScroll + amplitude >= value) ||
        (amplitude < 0 && currentScroll + amplitude <= value)
          ? value
          : currentScroll + amplitude;
      navScroll.value && navScroll.value.scrollTo(scrollWidth, 0);
      if (scrollWidth === value) return;
      window.requestAnimationFrame(() => scrollTo(value, amplitude));
    }

    function scrollPrev() {
      const containerWidth = navScroll.value.offsetWidth;
      const currentScroll = navScroll.value.scrollLeft;
      if (!currentScroll) return;
      const scrollLeft = currentScroll > containerWidth ? currentScroll - containerWidth : 0;
      scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
    }

    function scrollNext() {
      const containerWidth = navScroll.value.offsetWidth;
      const navWidth = navScroll.value.scrollWidth;
      const currentScroll = navScroll.value.scrollLeft;
      if (navWidth - currentScroll <= containerWidth) return;
      const scrollLeft =
        navWidth - currentScroll > containerWidth * 2
          ? currentScroll + containerWidth
          : navWidth - containerWidth;
      scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
    }

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
      handleContextMenu,

      navScroll,
      navWrap,
      getChangeStyle,
      scrollPrev,
      scrollNext,
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
    .tabs-card-scrollable {
      padding: 0 32px;
      overflow: hidden;
    }
  }
  .tabs-card {
    -webkit-box-flex: 1;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
    position: relative;
    .tabs-card-prev,
    .tabs-card-next {
      width: 32px;
      text-align: center;
      position: absolute;
      line-height: 32px;
      cursor: pointer;
      .n-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
      }
    }

    .tabs-card-prev {
      left: 0;
    }
    .tabs-card-next {
      right: 0;
    }
    .tabs-card-next-hide,
    .tabs-card-prev-hide {
      display: none;
    }

    &-scroll {
      white-space: nowrap;
      overflow: hidden;

      &-item {
        background: $white;
        color: #666;
        height: 32px;
        padding: 6px 16px 4px;
        border-radius: 3px;
        margin-right: 6px;
        cursor: pointer;
        display: inline-block;
        position: relative;
        flex: 0 0 auto;

        span {
          float: left;
          vertical-align: middle;
        }

        &:hover {
          color: #515a6e;
        }

        .n-icon {
          height: 22px;
          width: 21px;
          margin-right: -6px;
          position: relative;
          vertical-align: middle;
          text-align: center;
          color: #808695;

          &:hover {
            color: #515a6e !important;
          }

          svg {
            height: 21px;
            display: inline-block;
          }
        }
      }

      .active-item {
        color: v-bind(appTheme);
      }
    }
  }
  .tabs-card-scroll-item {
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
  .tabs-card-scroll-item-active {
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
