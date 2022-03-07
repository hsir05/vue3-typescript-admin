<template>
  <n-menu
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :inverted="inverted"
    :options="menuOptions"
    accordion
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { menuOptions } from "./data";
export default defineComponent({
  name: "Menu",
  props: {
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
  },
  setup() {
    return {
      menuOptions,
    };
  },
});
</script>
