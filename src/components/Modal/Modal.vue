<template>
  <n-modal
    v-model:show="isModal"
    auto-focus
    :close-on-esc="closeOnEsc"
    :mask-closable="maskClosable"
    :on-after-leave="afterLeave"
  >
    <n-card
      :style="{ width: width, height: height }"
      :title="title"
      :bordered="true"
      size="huge"
      role="dialog"
      aria-modal="true"
      footer-style="text-align: right"
    >
      <template #header-extra>
        <n-icon size="18" class="cursor-pointer" @click.stop="cancel">
          <CloseOutIcon />
        </n-icon>
      </template>
      <slot></slot>

      <!-- <template #footer>
                <n-button @click="cancel">取消</n-button>
                <n-button type="primary" class="ml-10px" :loading="loading" @click="ok">确认</n-button>
            </template> -->
    </n-card>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { CloseOutline as CloseOutIcon } from "@vicons/ionicons5";
export default defineComponent({
  name: "Modal",
  components: { CloseOutIcon },
  props: {
    title: {
      type: String,
      default: "编辑",
    },
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "auto",
    },
    maskClosable: {
      type: Boolean,
      defalut: false,
    },
    closeOnEsc: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["on-ok", "on-cancel"],
  setup(_, { emit }) {
    const isModal = ref(false);

    const showModal = () => {
      isModal.value = true;
    };
    const ok = () => {
      emit("on-ok");
    };
    const cancel = () => {
      isModal.value = false;
      emit("on-cancel");
    };

    const afterLeave = () => {
      isModal.value = false;
      emit("on-cancel");
    };

    return {
      isModal,
      afterLeave,
      showModal,
      ok,
      cancel,
    };
  },
});
</script>
