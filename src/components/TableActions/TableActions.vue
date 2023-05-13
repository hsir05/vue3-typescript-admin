<template>
  <div class="table-action">
    <div class="table-action-content">
      <template v-for="action in getActions" :key="action.label">
        <n-popconfirm v-if="action.popConfirm" v-bind="action.popConfirm">
          <template #trigger>
            <n-button v-bind="action" quaternary size="small">
              <span :style="`font-size: ${action.size ? action.size : '14px'};`">{{
                action.label
              }}</span>
            </n-button>
          </template>
          {{ action.popConfirm?.title }}
        </n-popconfirm>

        <template v-else>
          <n-button v-bind="action" v-if="!action.showBtn" quaternary size="small">
            <span :style="`font-size: ${action.size ? action.size : '14px'}; `">{{
              action.label
            }}</span>
          </n-button>
        </template>
      </template>

      <template v-if="dropDownActions && options.length">
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <slot name="more"></slot>
          <n-button v-if="!$slots.more" icon-placement="right" size="small" quaternary>
            <div class="more-btn">
              <span style="`color: rgba(87, 107, 149, 1) `">更多</span>
              <n-icon size="14">
                <ChevronDownIcon />
              </n-icon>
            </div>
          </n-button>
        </n-dropdown>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, computed, toRaw } from "vue";
import { ActionItem, DropDownActions } from "@/interface/table/table";
import { ChevronDownOutline as ChevronDownIcon } from "@vicons/ionicons5";
// import { DropdownOption } from "naive-ui";

const props = defineProps({
  actions: {
    type: Array as PropType<ActionItem[]>,
    default: null,
  },
  dropDownActions: {
    type: Object as PropType<DropDownActions>,
    default: () => {
      return { actions: [] };
    },
  },
  handleSelect: {
    type: Object as PropType<Fn>,
    requied: true,
  },
});
// const { hasPermission } = usePermission();

const getActions = computed(() => {
  return (toRaw(props.actions) || [])
    .filter(() => {
      return [];
    })
    .map((action) => {
      return {
        ...action,
      };
    });
});
// const options: DropdownOption = computed(() => {
//   return (toRaw(props.dropDownActions.actions) || [])
//     .filter((item) => !item.showBtn)
//     .map((drop) => {
//       return {
//         ...drop,
//       };
//     });
// });
const options = (props.dropDownActions.actions as []).filter(
  (item: { showBtn: boolean }) => !item.showBtn
);
// .map((drop) => {
//     return {
//         ...drop,
//     };
// })
</script>
<style lang="scss" scoped>
.table-action-content {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
}

.more-btn {
  @include flex(center, flex-start);
}
</style>
