<template>
  <div class="busy-type-item" :class="{ striped: striped }">
    <span class="vehicle-type-item">{{ title }}</span>
    <n-checkbox-group :value="list" @update:value="updateValue" size="large">
      <n-checkbox
        :value="val.busType"
        :disabled="val.disabled"
        :key="val.busType"
        v-for="val in checkboxList"
      />
    </n-checkbox-group>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  striped: {
    type: Boolean,
    default: () => false,
  },
  list: {
    type: Array as PropType<Number[]>,
    require: true,
    default: () => [],
  },
});

const checkboxList = [
  {
    busType: 1,
    checked: true,
    disabled: false,
  },
  {
    busType: 2,
    checked: 1,
    disabled: false,
  },
  {
    busType: 3,
    checked: 1,
    disabled: false,
  },
  {
    busType: 4,
    checked: 1,
    disabled: false,
  },
  {
    busType: 5,
    checked: 1,
    disabled: false,
  },
  {
    busType: 6,
    checked: 1,
    disabled: false,
  },
];

const emit = defineEmits(["on-update-value"]);

const updateValue = (value: Number[]) => {
  emit("on-update-value", value);
};
</script>
