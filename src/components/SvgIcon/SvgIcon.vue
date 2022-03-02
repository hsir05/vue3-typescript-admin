<template>
  <svg :class="svgClass" v-bind="$attrs" class="svg-icon-spin" :style="style">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>
<script lang="ts" setup>
import { computed } from "vue";
const props = defineProps({
  svgClass: { type: String, default: " " },
  prefix: { type: String, default: "icon" },
  name: { type: String, default: " " },
  color: { type: String, default: "" },
  size: { type: String, default: "" },
});
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
const style = computed(() => {
  if (!props.size) {
    return {};
  }
  const s = `${props.size.replace("px", "")}px`;
  return {
    width: s,
    height: s,
  };
});

const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`;
  }
  return "svg-icon";
});

</script>
<style lang="scss">
.svg-icon-spin {
  width: 18px;
  height: 18px;
  color: inherit;
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  margin: 5px;
  &:focus{
      outline: 0;
  }
}
</style>