<template>
  <n-modal v-model:show="isModal" auto-focus :close-on-esc="false" :mask-closable="false">
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
      内容
      <template #footer>
        <n-button @click="cancel">取消</n-button>
        <n-button type="primary" class="ml-10px" @click="ok">确认</n-button>
      </template>
    </n-card>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { CloseOutline as CloseOutIcon } from "@vicons/ionicons5";
export default defineComponent({
  name: "DictTem",
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
  },
  setup() {
    const isModal = ref(false);

    const showModal = () => {
      isModal.value = true;
    };
    const ok = () => {
      console.log("ok");
    };
    const cancel = () => {
      isModal.value = false;
    };

    return {
      isModal,
      showModal,
      ok,
      cancel,
    };
  },
});
</script>
