<template>
  <BasicModal title="订单预付款出账记录" ref="ModalRef" :maskClosable="true">
    <n-data-table
      ref="table"
      :data="data"
      :columns="columns"
      class="box-border mt-10px"
      min-height="170px"
      :row-key="getRowKeyId"
      :pagination="false"
    />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, h } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";
import dayjs from "dayjs";
import { DataItemInter } from "../type";
export default defineComponent({
  name: "OrderAdvanceModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();

    const columns = [
      {
        title: "交易类型",
        key: "flowOutType",
        align: "center",
      },
      {
        title: "交易金额",
        key: "flowOutAmount",
        align: "center",
      },
      {
        title: "交易发起时间",
        key: "flowOutBeginTime",
        align: "center",
        render(record: DataItemInter) {
          return h("span", dayjs(record.flowOutBeginTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "交易结束时间",
        key: "flowOutEndTime",
        align: "center",
        render(record: DataItemInter) {
          return h("span", dayjs(record.flowOutEndTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "交易状态",
        key: "flowOutState",
        align: "center",
      },
      {
        title: "备注",
        key: "remark",
        align: "center",
      },
    ];

    const data = ref<DataItemInter[]>([]);

    const handleModal = (dataInfo: DataItemInter[]) => {
      data.value = dataInfo;
      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleReset() {
      data.value = [];
    }

    return {
      ModalRef,
      data,
      columns,
      getRowKeyId: (row: DataItemInter) => row.flowOutBeginTime,
      handleModal,
      handleReset,
    };
  },
});
</script>
