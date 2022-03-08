<template>
  <div class="drawer-setting-item">
    <div class="drawer-setting-item-title">{{ title }}</div>
    <div class="drawer-setting-item-action">
      <n-switch v-model:value="matchValue" :disabled="disabled" :on-update:value="toggleSwitch" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, toRefs } from "vue";

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
</style>
