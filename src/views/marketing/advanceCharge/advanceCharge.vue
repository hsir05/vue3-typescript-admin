<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="form"
    >
      <n-form-item label="设备类型" path="deviceChannelType">
        <n-select
          v-model:value="form.deviceChannelType"
          clearable
          filterable
          placeholder="选择设备类型"
          style="width: 260px"
          :options="deviceChannelTypeData"
        />
      </n-form-item>

      <n-button attr-type="button" type="primary" @click="query">查询</n-button>
    </n-form>

    <!-- 表格 -->
    <div class="p-10px mb-10px bg-white">
      <n-button attr-type="button" type="primary" class="mb-10px" @click="handleAdd">新增</n-button>

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
import { defineComponent, h, onMounted, ref } from "vue";
import { FormInst, useMessage, NTag } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import ChannelModal from "./modal.vue";
import { CommonItemInter } from "@/interface/common/common";

import {
  CreateOutline as CreateIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
} from "@vicons/ionicons5";
import { getDict } from "@/api/common/common";
import { getAdvanceList, lowerAdvanceSeq, upgradeAdvanceSeq } from "@/api/marketing/marketing";
import { TableDataItemInter, QueryFormInter } from "./type";
export default defineComponent({
  name: "AdvanceCharge",
  components: { ChannelModal },
  setup() {
    const form = ref<QueryFormInter>({
      deviceChannelType: "DCT0001",
    });
    const loading = ref(false);
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const channelModalRef = ref();
    const deviceChannelTypeData = ref<CommonItemInter[]>([]);

    const data = ref([]);
    const columns = [
      {
        title: "支付渠道",
        key: "orderAdvancePayChannelTypeShowName",
        align: "center",
      },
      {
        title: "序列",
        key: "orderAdvancePayChannelTypeSeq",
        align: "center",
      },
      {
        title: "状态",
        key: "orderAdvancePayChannelTypeLock",
        align: "center",
        render(row: TableDataItemInter) {
          return h(
            NTag,
            {
              type: row.orderAdvancePayChannelTypeLock === 0 ? "success" : "error",
            },
            {
              default: () => (row.orderAdvancePayChannelTypeLock === 0 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "前移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowBackIcon,
                onClick: handleUp.bind(null, record.orderAdvancePayChannelTypeShowId),
                auth: ["dict001"],
              },
              {
                label: "后移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowIcon,
                onClick: handleDown.bind(null, record.orderAdvancePayChannelTypeShowId),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record.orderAdvancePayChannelTypeShowId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getDevicesData();
    });

    const getDevicesData = async () => {
      try {
        let res = await getDict({ parentEntryCode: "DCT0000" });
        deviceChannelTypeData.value = res.data.map(
          (item: { entryName: string; entryCode: string }) => {
            return { label: item.entryName, value: item.entryCode };
          }
        );

        getData();
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async () => {
      try {
        loading.value = true;
        let res = await getAdvanceList({
          deviceChannelType: form.value.deviceChannelType as string,
        });
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

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

    function handleAdd() {
      const { handleModal } = channelModalRef.value;
      handleModal(form.value.deviceChannelType);
    }
    async function handleUp(orderAdvancePayChannelTypeShowId: string) {
      loading.value = true;
      try {
        let res = await upgradeAdvanceSeq({ orderAdvancePayChannelTypeShowId });
        getData();
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    async function handleDown(orderAdvancePayChannelTypeShowId: string) {
      loading.value = true;
      try {
        let res = await lowerAdvanceSeq({ orderAdvancePayChannelTypeShowId });
        getData();
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);

        loading.value = false;
      }
    }

    function handleEdit(orderAdvancePayChannelTypeShowId: string) {
      const { handleModal } = channelModalRef.value;
      handleModal(form.value.deviceChannelType, orderAdvancePayChannelTypeShowId);
    }

    return {
      form,
      loading,
      channelModalRef,
      data,
      options: [],
      columns,
      deviceChannelTypeData,
      getRowKeyId: (row: TableDataItemInter) => row.orderAdvancePayChannelTypeShowId,
      handleAdd,
      query,
    };
  },
});
</script>
