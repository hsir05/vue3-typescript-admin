<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="120"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="form"
    >
      <n-form-item label="订单业务类型" path="orderType">
        <n-select
          v-model:value="form.orderType"
          clearable
          filterable
          placeholder="选择订单业务类型"
          style="width: 260px"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="设备类型" path="equipType">
        <n-select
          v-model:value="form.equipType"
          clearable
          filterable
          placeholder="选择设备类型"
          style="width: 260px"
          :options="options"
        />
      </n-form-item>

      <n-button attr-type="button" type="primary" @click="query">查询</n-button>
    </n-form>

    <!-- 表格 -->
    <div class="p-10px mb-10px bg-white">
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border max-w-580px"
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />
    </div>

    <ChannelModal ref="channelModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref } from "vue";
import { FormInst, useMessage, NTag } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import ChannelModal from "./modal.vue";
import {
  CreateOutline as CreateIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
} from "@vicons/ionicons5";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "PaymentChannel",
  components: { ChannelModal },
  setup() {
    const form = ref({
      orderType: null,
      equipType: null,
    });
    const loading = ref(false);
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const channelModalRef = ref();

    const data = ref([
      {
        id: "1312312",
        paymentChannel: "钱包支付",
        sort: 1,
        status: 1,
      },
    ]);
    const columns = [
      {
        title: "支付渠道",
        key: "paymentChannel",
        align: "center",
      },
      {
        title: "序列",
        key: "sort",
        align: "center",
      },
      {
        title: "状态",
        key: "status",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.status === 1 ? "success" : "error",
            },
            {
              default: () => (row.status === 1 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "前移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowBackIcon,
                onClick: handleUp.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "后移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowIcon,
                onClick: handleDown.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    function query(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleUp(record: Recordable) {
      console.log("点击了编辑", record.id);
    }
    function handleDown(record: Recordable) {
      console.log("点击了编辑", record.id);
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { handleModal } = channelModalRef.value;
      handleModal("编辑钱包支付渠道", record);
    }

    return {
      form,
      loading,
      channelModalRef,
      data,
      options: [],
      columns,
      getRowKeyId: (row: tableDataItem) => row.id,

      query,
    };
  },
});
</script>
