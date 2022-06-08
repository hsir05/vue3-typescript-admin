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
      <n-form-item label="设备类型" path="deviceChannelType">
        <n-select
          v-model:value="form.deviceChannelType"
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

    <ChannelModal ref="channelModalRef" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, h, onMounted, ref } from "vue";
import { NTag, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import ChannelModal from "./modal.vue";
import {
  CreateOutline as CreateIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
} from "@vicons/ionicons5";
import { TableDataItemInter, QueryFormInter } from "./type";
import { getDict } from "@/api/common/common";
import { CommonItemInter } from "@/interface/common/common";
import { getWalletChannelPage, walletUpgradeSeq, walletLowerSeq } from "@/api/marketing/marketing";
export default defineComponent({
  name: "PaymentChannel",
  components: { ChannelModal },
  setup() {
    const form = ref<QueryFormInter>({
      deviceChannelType: null,
      //   orderBusinessType: null,
    });
    const message = useMessage();
    const loading = ref(false);
    const channelModalRef = ref();

    const orderBusTypeData = ref<CommonItemInter[]>([]);
    const deviceChannelTypeData = ref<CommonItemInter[]>([]);

    const data = ref([]);
    const columns = [
      {
        title: "充值渠道",
        key: "customerWalletRechargeChannelShowName",
        align: "center",
      },
      {
        title: "序列",
        key: "customerWalletRechargeChannelShowSeq",
        align: "center",
      },
      {
        title: "状态",
        key: "customerWalletRechargeChannelLock",
        align: "center",
        render(row: TableDataItemInter) {
          return h(
            NTag,
            {
              type: row.customerWalletRechargeChannelLock === 0 ? "success" : "error",
            },
            {
              default: () => (row.customerWalletRechargeChannelLock === 0 ? "正常" : "锁定"),
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
                onClick: handleUp.bind(null, record.customerWalletRechargeChannelShowId),
                auth: ["dict001"],
              },
              {
                label: "后移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowIcon,
                onClick: handleDown.bind(null, record.customerWalletRechargeChannelShowId),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record.customerWalletRechargeChannelShowId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getSelectData();
    });

    const getSelectData = async () => {
      Promise.all([
        getDict({ parentEntryCode: "OBT0000" }),
        getDict({ parentEntryCode: "DCT0000" }),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);
          orderBusTypeData.value = dataArr[0].map(
            (item: { entryName: string; entryCode: string }) => {
              return { label: item.entryName, value: item.entryCode };
            }
          );

          deviceChannelTypeData.value = dataArr[1].map(
            (item: { entryName: string; entryCode: string }) => {
              return { label: item.entryName, value: item.entryCode };
            }
          );
          form.value.deviceChannelType = deviceChannelTypeData.value[0].value;
          //   form.value.orderBusinessType = orderBusTypeData.value[0].value;

          getData();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getData = async () => {
      loading.value = true;
      try {
        let option = {
          deviceChannelType: form.value.deviceChannelType,
        };
        let res = await getWalletChannelPage(option);
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function query(e: MouseEvent) {
      e.preventDefault();
      getData();
    }
    function handleSaveAfter() {
      getData();
    }

    function handleAdd() {
      const { handleModal } = channelModalRef.value;
      handleModal(form.value.deviceChannelType);
    }
    async function handleUp(customerWalletRechargeChannelShowId: string) {
      loading.value = true;
      try {
        let res = await walletUpgradeSeq({ customerWalletRechargeChannelShowId });
        message.success(window.$tips[res.code]);
        getData();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    async function handleDown(customerWalletRechargeChannelShowId: string) {
      loading.value = true;
      try {
        let res = await walletLowerSeq({ customerWalletRechargeChannelShowId });
        message.success(window.$tips[res.code]);
        getData();
        loading.value = false;
      } catch (err) {
        console.log(err);

        loading.value = false;
      }
    }

    function handleEdit(customerWalletRechargeChannelShowId: string) {
      const { handleModal } = channelModalRef.value;
      handleModal(form.value.deviceChannelType, customerWalletRechargeChannelShowId);
    }

    return {
      form,
      loading,
      channelModalRef,
      data,
      orderBusTypeData,
      deviceChannelTypeData,
      columns,
      handleAdd,
      handleSaveAfter,
      getRowKeyId: (row: TableDataItemInter) => row.customerWalletRechargeChannelShowId,

      query,
    };
  },
});
</script>
