<template>
  <n-menu
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :inverted="inverted"
    :options="menuOptions"
    :value="getSelectedKeys"
    :expanded-keys="state.openKeys"
    :on-update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
    accordion
  />
</template>
<script lang="ts" setup>
import { toRefs, unref, ref, reactive, watch, computed } from "vue";
import { MenuOption } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { menuOptions } from "./data";
const props = defineProps({
  mode: {
    type: String,
    default: "vertical",
  },
  collapsed: {
    type: Boolean,
  },
  inverted: {
    type: Boolean,
    default: true,
  },
  //位置
  location: {
    type: String,
    default: "left",
  },
});
const { mode, collapsed, inverted, location } = toRefs(props);
// 当前路由
const currentRoute = useRoute();
const router = useRouter();
const selectedKeys = ref<string>(currentRoute.path as string);
const headerMenuSelectKey = ref<string>("");

const { navMode } = useProjectSetting();

// 获取当前打开的子菜单
const matched = currentRoute.matched;

const getOpenKeys = matched && matched.length ? matched.map((item) => item.path) : [];

const state = reactive({
  openKeys: getOpenKeys,
});

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    // // updateMenu();
    const matched = currentRoute.matched;
    state.openKeys = matched.map((item) => item.path);
    const activeMenu: string = (currentRoute.meta?.activeMenu as string) || "";
    // selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.path as string);

    if (activeMenu) {
      selectedKeys.value = activeMenu;
    } else if (currentRoute.query.orderState) {
      let path = currentRoute.path.split("/")[1];
      selectedKeys.value = `/${path}/${currentRoute.query.orderState}`;
    } else {
      selectedKeys.value = currentRoute.path as string;
    }
  }
);

//    function updateMenu() {
//   if (!settingStore.menuSetting.mixMenu) {
//     menus.value = generatorMenu(asyncRouteStore.getMenus);
//   } else {
//     //混合菜单
//     const firstRouteName: string = (currentRoute.matched[0].name as string) || '';
//     menus.value = generatorMenuMix(asyncRouteStore.getMenus, firstRouteName, props.location);
//     const activeMenu: string = currentRoute?.matched[0].meta?.activeMenu as string;
//     headerMenuSelectKey.value = (activeMenu ? activeMenu : firstRouteName) || '';
//   }
// }

//展开菜单
function menuExpanded(openKeys: string[]) {
  if (!openKeys) return;
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1);
  const isExistChildren = findChildrenLen(latestOpenKey as string);
  state.openKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys;
}

const getSelectedKeys = computed(() => {
  //   let location = props.location;
  return location.value === "left" ||
    (location.value === "header" && unref(navMode) === "horizontal")
    ? unref(selectedKeys)
    : unref(headerMenuSelectKey);
});

//查找是否存在子路由
function findChildrenLen(key: string) {
  if (!key) return false;
  const subRouteChildren: string[] = [];
  for (const { children, key } of unref(menuOptions)) {
    if (children && children.length) {
      subRouteChildren.push(key as string);
    }
  }
  return subRouteChildren.includes(key);
}

const clickMenuItem = (_: string, item: MenuOption) => {
  router.push({ path: item.path as string });
};
</script>
