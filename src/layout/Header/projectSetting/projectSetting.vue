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
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive } from "vue";
import { appThemeList } from "@/config/projectSetting";
import { CheckOutlined } from "@vicons/antd";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";

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
      appTheme,

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
