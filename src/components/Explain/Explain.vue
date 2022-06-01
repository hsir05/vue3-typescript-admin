<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-icon size="20" class="mr-15px cursor-pointer" @click="handle">
        <HelpCircIcon />
      </n-icon>
    </template>
    {{ title }}
  </n-tooltip>

  <Modal
    ref="explainModalRef"
    :width="width"
    :title="title"
    :maskClosable="true"
    :closeOnEsc="true"
  >
    <slot></slot>
  </Modal>
</template>
<script lang="ts" setup>
import { toRefs, ref } from "vue";
import Modal from "@/components/Modal/Modal.vue";
import { HelpCircleOutline as HelpCircIcon } from "@vicons/ionicons5";

const props = defineProps({
  title: {
    type: String,
    default: "配置说明",
  },
  width: {
    type: String,
    default: "600px",
  },
});
const { title } = toRefs(props);

const explainModalRef = ref();

const handle = () => {
  const { showModal } = explainModalRef.value;
  showModal();
};
</script>
