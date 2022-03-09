<template>
  <n-divider title-placement="center" v-if="title">{{ title }}</n-divider>
  <div class="project-drawer-setting-item align-items-top">
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
import { toRefs } from "vue";
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
