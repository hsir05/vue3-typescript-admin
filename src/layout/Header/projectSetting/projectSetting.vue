<template>
  <n-drawer v-model:show="isDrawer" :width="width" placement="right">
    <n-drawer-content :title="title">
      <div class="drawer">
        <n-divider title-placement="center">系统主题</n-divider>

        <div class="drawer-setting-item align-items-top">
          <span
            class="theme-item"
            v-for="(item, index) in appThemeList"
            :key="index"
            :style="{ 'background-color': item }"
            @click="toggleTheme(item)"
          >
            <n-icon size="12" v-if="item === appTheme">
              <CheckOutlined />
            </n-icon>
          </span>
        </div>

        <n-divider title-placement="center">显示</n-divider>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑导航</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="projectStore.isBreadcrumb" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示刷新按钮</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="projectStore.isRefresh" />
          </div>
        </div>

        <n-divider title-placement="center">动画</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">禁用动画</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="projectStore.isPageAnimate" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">动画类型</div>
          <div class="drawer-setting-item-select">
            <n-select
              v-model:value="projectStore.pageAnimateType"
              :options="animateOptions"
            />
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive } from "vue";
import {
  appThemeList,
  animates as animateOptions,
} from "@/config/projectSetting";
import { CheckOutlined } from "@vicons/antd";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { useAppProjectStore } from "@/store/modules/projectSetting";

export default defineComponent({
  name: "ProjectSetting",
  components: { CheckOutlined },
  props: {
    title: {
      type: String,
      default: "项目配置",
    },
    width: {
      type: Number,
      default: 291,
    },
  },
  setup(props) {
    const state = reactive({
      width: props.width,
      title: props.title,
      isDrawer: false,
    });
    const projectStore = useAppProjectStore();
    const { appTheme, setAppTheme } = useProjectSetting();

    function openDrawer() {
      state.isDrawer = true;
    }

    function closeDrawer() {
      state.isDrawer = false;
    }
    function toggleTheme(item: string) {
      setAppTheme(item);
    }

    return {
      ...toRefs(state),
      appThemeList,
      animateOptions,
      appTheme,
      projectStore,

      openDrawer,
      closeDrawer,
      toggleTheme,
    };
  },
});
</script>
<style lang="scss" scoped>
.drawer {
  &-setting-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    flex-wrap: wrap;
    &-title {
      flex: 1 1;
      font-size: 14px;
    }

    &-action {
      flex: 0 0 auto;
    }
    &-select {
      flex: 1;
    }
  }
  .align-items-top {
    align-items: flex-start;
    padding: 2px 0;
  }
  .theme-item {
    width: 20px;
    min-width: 20px;
    height: 20px;
    cursor: pointer;
    border: 1px solid #eee;
    border-radius: 2px;
    margin: 0 5px 5px 0;
    text-align: center;

    .n-icon {
      color: #fff;
    }
  }
}
</style>
