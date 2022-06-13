<template>
  <BasicModal
    width="900px"
    title="兑换码详情"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
  >
    <n-descriptions label-placement="left" bordered :column="2" size="large">
      <n-descriptions-item label="任务名称" :span="2">{{data?.taskName}}</n-descriptions-item>
      <n-descriptions-item label="生成条数">{{data?.importCount}}</n-descriptions-item>
      <n-descriptions-item label="成功条数">{{data?.successCount}}</n-descriptions-item>
      <n-descriptions-item label="开始时间" :span="2">{{dayjs(data?.beginTime).format("YYYY-MM-DD HH:mm:ss") }}</n-descriptions-item>
      <n-descriptions-item label="结束时间" :span="2">{{ data?.endTime !=null ? dayjs(data.endTime).format("YYYY-MM-DD HH:mm:ss") : '暂无'}}</n-descriptions-item>
      <n-descriptions-item label="生成日志">{{data?.importLog}}</n-descriptions-item>
    </n-descriptions>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";
import {dataImportTaskDetail} from "@/api/common/common";
import dayjs from "dayjs";
export default defineComponent({
  name: "CodeDetailModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const loading = ref(false);
    const data = ref()
    const handleModal = (record: Recordable) => {
      getDetail(record.dataImportTaskId)
      const { showModal } = ModalRef.value;
      showModal();
    };

    const getDetail = async (dataImportTaskId: string) => {
      loading.value = true;
      try {
        let res = await dataImportTaskDetail({dataImportTaskId: dataImportTaskId});
        data.value = res.data
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };


    function handleReset() {
      data.value = null
    }

    return {
      loading,
      ModalRef,data,
      handleModal,
      handleReset,
      dayjs
    };
  },
});
</script>
