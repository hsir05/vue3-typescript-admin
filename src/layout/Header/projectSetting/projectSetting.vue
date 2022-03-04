<template>
  <n-drawer v-model:show="isDrawer" :width="width" placement="right">
    <n-drawer-content :title="title">
      <n-divider title-placement="center">系统主题</n-divider>

      <div class="drawer-setting-item align-items-top">
          <span
            class="theme-item"
            v-for="(item, index) in appThemeList"
            :key="index"
            :style="{ 'background-color': item }"
            @click="toggleTheme(item)"
          >
            <n-icon size="12" v-if="item === designStore.appTheme">
              <CheckOutlined />
            </n-icon>
          </span>
        </div>
      
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive } from "vue";
import { appThemeList } from "@/config/projectSetting"
export default defineComponent({
  name: "ProjectSetting",
  props: {
    title: {
      type: String,
      default: "项目配置",
    },
    width: {
      type: Number,
      default: 280,
    },
  },
  setup(props) {
    const state = reactive({
      width: props.width,
      title: props.title,
      isDrawer: false,
    });
    function openDrawer() {
      state.isDrawer = true;
    }

    function closeDrawer() {
      state.isDrawer = false;
    }
    function toggleTheme(item: string){
        console.log(item);
        
    } 

    return {
      ...toRefs(state),
      appThemeList,
      openDrawer,
      closeDrawer,
      toggleTheme,
    };
  },
});
</script>
