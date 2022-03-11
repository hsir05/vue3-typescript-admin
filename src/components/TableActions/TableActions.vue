<template>
  <div class="table-action">
    <div class="items-center justify-center">
      <template v-for="action in getActions" :key="action.label">
        <n-button v-bind="action" class="mx-2" v-if="!action.popConfirm">
          <template #icon v-if="action.icon"> <n-icon :component="action.icon" /> </template
          >{{ action.label }}</n-button
        >

        <n-popconfirm v-else v-bind="action.popConfirm">
          <template #trigger>
            <n-button v-bind="action" class="mx-2">
              <template #icon v-if="action.icon"> <n-icon :component="action.icon" /> </template
              >{{ action.label }}</n-button
            >
          </template>
          {{ action.popConfirm?.title }}
        </n-popconfirm>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, toRaw } from "vue";
import { ActionItem } from "@/interface/table/table";
import { usePermission } from "@/hooks/web/usePermissions";
export default defineComponent({
  name: "TableActions",
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
    },
  },
  setup(props) {
    // const permissions: string[] = ["dict001", "dict002"];

    const { hasPermission } = usePermission();

    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return hasPermission(action.auth);
        })
        .map((action) => {
          return {
            ...action,
          };
        });
    });

    return {
      getActions,
    };
  },
});
</script>
