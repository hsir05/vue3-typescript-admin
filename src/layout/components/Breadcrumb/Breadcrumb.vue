<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="item in options" :key="item.key">
      <n-dropdown :options="item.children" :on-select="closeHandleSelect">
        {{ item.label }}
      </n-dropdown>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
// import routerInstance from "@/router";
import { routeModuleList } from "@/router/index";
import { cloneDeep } from "lodash-es";

const currentRoute = useRoute();
const router = useRouter();

// const routerOptions = cloneDeep(routerInstance.options.routes);
const routerOptions = cloneDeep(routeModuleList);

interface BreadcrumbInter {
  label: string;
  key: string;
  children?: BreadcrumbInter[];
}

function getCurrentRoute(arr: RouteRecordRaw[]) {
  let rotueArr: BreadcrumbInter[] = [];
  for (let key of arr) {
    if (key.path === currentRoute.path) {
      rotueArr.push({ key: key.path, label: key.meta?.title as string });
      break;
    } else if (key.children && key.children.length > 0) {
      let item: RouteRecordRaw | undefined = key.children.find(
        (item: RouteRecordRaw) => item.path === currentRoute.path
      );
      if (item) {
        let child: BreadcrumbInter[] = [];
        if (key.children && key.children.length > 0) {
          for (let value of key.children) {
            if (!value.meta?.activeBreadcrumb) {
              child.push({ key: value.path, label: value.meta?.title as string });
            }
          }
        }
        rotueArr.push({
          label: key.meta?.title as string,
          key: key.path,
          children: child,
        });
        break;
      }
    }
  }
  return rotueArr;
}

const options = ref<BreadcrumbInter[]>([]);

options.value = getCurrentRoute(routerOptions);
options.value.push({ label: currentRoute.meta?.title as string, key: currentRoute.path });

watch(
  () => router.currentRoute.value.path,
  () => {
    options.value = [];
    options.value = getCurrentRoute(routerOptions);
    options.value.push({ label: currentRoute.meta?.title as string, key: currentRoute.path });
  },
  { immediate: true }
);

const closeHandleSelect = (key: string) => {
  router.push({ path: key });
};
</script>
