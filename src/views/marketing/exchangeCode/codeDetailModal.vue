<template>
  <BasicModal
    width="650px"
    title="兑换码详情"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="任务名称">0001</n-descriptions-item>
      <n-descriptions-item label="生成条数">22</n-descriptions-item>
      <n-descriptions-item label="成功条数">22</n-descriptions-item>
      <n-descriptions-item label="开始时间" :span="2">2022-04-06 11:55:00</n-descriptions-item>
      <n-descriptions-item label="结束时间" :span="2">2020-04-24 08:51:10</n-descriptions-item>
      <n-descriptions-item label="生成日志">22</n-descriptions-item>
    </n-descriptions>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";

export default defineComponent({
  name: "CodeDetailModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const loading = ref(false);

    const handleModal = () => {
      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleValidate() {}

    function handleReset() {}

    return {
      loading,
      ModalRef,
      handleModal,
      handleReset,
      handleValidate,
    };
  },
});
</script>
