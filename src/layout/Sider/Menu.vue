<template>
  <n-menu
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :inverted="inverted"
    :options="menuOptions"
    :on-update:value="handle"
    accordion
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { MenuOption } from "naive-ui";
import { useRouter } from "vue-router";

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
    const router = useRouter();

    const handle = (key: string, item: MenuOption) => {
      console.log(key);
      router.push({ path: item.path as string });
    };
    return {
      menuOptions,

      handle,
    };
  },
});
</script>
