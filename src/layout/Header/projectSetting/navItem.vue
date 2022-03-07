<template>
  <n-divider title-placement="center" v-if="title">{{ title }}</n-divider>
  <div class="drawer-setting-item align-items-top">
    <div class="align-items-top" v-for="(item, index) in options" :key="index">
      <n-tooltip placement="top">
        <template #trigger>
          <SvgIcon :name="item.icon" size="60" @click="toggleNavStyle(item.value)" />
        </template>
        <span>{{ item.label }}</span>
      </n-tooltip>
      <div class="text-center">
        <n-badge dot color="#19be6b" v-show="matchValue === item.value" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon/SvgIcon.vue";

interface OptionsItem {
  value: string;
  label: string;
  icon: string;
}

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  options: {
    type: Array as PropType<OptionsItem[]>,
    default: () => [],
  },
  matchValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["toggleHandle"]);
const { title, options, matchValue } = toRefs(props);

const toggleNavStyle = (item: string) => {
  emit("toggleHandle", item);
};
</script>
<style lang="scss" scoped>
.drawer-setting-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  flex-wrap: wrap;
  justify-content: space-around;
  &-title {
    flex: 1 1;
    font-size: 14px;
  }
  &-action {
    flex: 0 0 auto;
  }
}
.align-items-top {
  align-items: flex-start;
  padding: 2px 0;
  cursor: pointer;
}
</style>
