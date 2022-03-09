<template>
  <div class="project-drawer-setting-item">
    <div class="project-drawer-setting-item-title">{{ title }}</div>
    <div class="project-drawer-setting-item-action">
      <n-switch v-model:value="matchValue" :disabled="disabled" :on-update:value="toggleSwitch" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  matchValue: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["toggleHandle"]);
const { title, matchValue, disabled } = toRefs(props);

const toggleSwitch = (bool: boolean) => {
  emit("toggleHandle", bool);
};
</script>
