<template>
  <div class="table-action">
    <div class="table-action-content">
      <template v-for="action in getActions" :key="action.label">
        <n-popconfirm v-if="action.popConfirm" v-bind="action.popConfirm">
          <template #trigger>
            <n-tooltip trigger="hover" v-if="action.isIconBtn">
              <template #trigger>
                <n-button v-bind="action" size="tiny" style="font-size: 16px">
                  <template #icon v-if="action.icon">
                    <n-icon :component="action.icon" />
                  </template>
                </n-button>
              </template>
              {{ action.label }}
            </n-tooltip>

            <n-button v-bind="action" class="mx-2" v-else>
              <template #icon v-if="action.icon"> <n-icon :component="action.icon" /> </template
              >{{ action.label }}
            </n-button>
          </template>
          {{ action.popConfirm?.title }}
        </n-popconfirm>

        <n-tooltip trigger="hover" v-else-if="action.isIconBtn">
          <template #trigger>
            <n-button
              type="primary"
              size="tiny"
              v-bind="action"
              style="font-size: 16px"
              class="mr-10px"
            >
              <n-icon :component="action.icon" />
            </n-button>
          </template>
          {{ action.label }}
        </n-tooltip>

        <n-button v-bind="action" class="mx-2" v-else>
          <template #icon v-if="action.icon">
            <n-icon :component="action.icon" />
          </template>
          {{ action.label }}
        </n-button>
      </template>

      <n-dropdown
        v-if="dropDownActions && getDropdownList.length"
        trigger="hover"
        :options="getDropdownList"
        @select="select"
      >
        <slot name="more"></slot>
        <n-button type="primary" v-if="!$slots.more" icon-placement="right">
          <div class="flex items-center">
            <span>更多</span>
            <n-icon size="14">
              <ChevronDownIcon />
            </n-icon>
          </div>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, toRaw } from "vue";
import { ActionItem } from "@/interface/table/table";
import { usePermission } from "@/hooks/web/usePermissions";
import { ChevronDownOutline as ChevronDownIcon } from "@vicons/ionicons5";
export default defineComponent({
  name: "TableActions",
  components: { ChevronDownIcon },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    select: {
      type: Function as PropType<Function>,
      default: () => {},
    },
  },
  setup(props) {
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

    const getDropdownList = computed(() => {
      return (toRaw(props.dropDownActions) || [])
        .filter((drop) => {
          return hasPermission(drop.auth);
        })
        .map((drop) => {
          return {
            ...drop,
          };
        });
    });

    return {
      getActions,
      getDropdownList,
    };
  },
});
</script>
<style lang="scss" scoped>
.table-action-content {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
