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
      :model="queryValue"
    >
      <n-form-item label="客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryValue.customerPhoneLike"
          clearable
          placeholder="输入客户手机号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="申请时间(起始)" path="invoiceApplicationTimeLE">
        <n-date-picker
          v-model:value="queryValue.invoiceApplicationTimeLE"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>
      <n-form-item label="申请时间(结束)" path="invoiceApplicationTimeGE">
        <n-date-picker
          v-model:value="queryValue.invoiceApplicationTimeGE"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="发票申请状态" path="invoiceApplicationStateEQ">
        <n-select
          clearable
          filterable
          v-model:value="queryValue.invoiceApplicationStateEQ"
          style="width: 150px"
          placeholder="发票申请状态"
          :options="invoiceAppOptions"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <InvoiceDrawer ref="invoiceDrawerRef" :width="770" @on-save-after="handleSaveAfter" />

    <SendMail ref="sendMailRef" @on-save-after="handleSaveAfter" />

    <ReturnInvoiceModal ref="returnInvoiceModalRef" @on-save-after="handleSaveAfter" />

    <InvoiceModal ref="invoiceModalRef" @on-save-after="handleSaveAfter" />
    <RepeatSendMailModal ref="repeatSendMailModalRef" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  DownloadOutline as GitIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  EyeOutline as EyeIcon,
  MailOutline as MailIcon,
  PrintOutline as PrintIcon,
  TicketOutline as TicketIcon,
  MailOpenOutline as MailOpenIcon,
  CopyOutline as CopyIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import InvoiceDrawer from "./invoiceDrawer.vue";
import { useMessage, useDialog } from "naive-ui";
import ReturnInvoiceModal from "./returnInvoiceModal.vue";
import InvoiceModal from "./invoiceModal.vue";
import SendMail from "./sendModal.vue";
import RepeatSendMailModal from "./repeatSendMailModal.vue";
import { downloadFile } from "@/api/common/common";
import { TableDataItemInter } from "./type";
import { invoiceAppOptions, invoiceAppObj } from "@/config/form";
import {
  getInvoiceAppPage,
  downloadRelativeItinerary,
  invoicePrint,
  invoiceReOpen,
  invoiceInvalid,
} from "@/api/individualCustomers/individualCustomers";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "InvoiceApplicationList",
  components: {
    BasicTable,
    InvoiceDrawer,
    SendMail,
    RepeatSendMailModal,
    ReturnInvoiceModal,
    InvoiceModal,
  },
  setup() {
    const loading = ref(false);
    const invoiceDrawerRef = ref();
    const basicTableRef = ref();
    const sendMailRef = ref();
    const invoiceModalRef = ref();
    const returnInvoiceModalRef = ref();
    const repeatSendMailModalRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      invoiceApplicationTimeLE: null,
      invoiceApplicationTimeGE: null,
      invoiceApplicationStateEQ: null,
      customerPhoneLike: null,
    });
    const dialog = useDialog();
    const message = useMessage();

    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "客户手机号",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "发票申请类型",
        key: "invoiceApplicationTypeName",
        align: "center",
      },
      {
        title: "发票金额(元)",
        key: "invoiceAmount",
        align: "center",
      },

      {
        title: "发票类型",
        key: "invoiceType",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", row.invoiceType === 0 ? "个人发票" : "公司发票");
        },
      },

      {
        title: "发票抬头",
        key: "invoiceTitle",
        align: "center",
      },
      {
        title: "纳税人识别号",
        key: "taxpayerIdentificationNumber",
        align: "center",
      },

      {
        title: "发票内容",
        key: "invoiceContent",
        align: "center",
      },
      {
        title: "申请时间",
        key: "invoiceApplicationTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.invoiceApplicationTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "发票申请状态",
        key: "invoiceApplicationState",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", invoiceAppObj[record.invoiceApplicationState]);
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        with: 280,
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleSee.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "开票",
                type: "primary",
                icon: TicketIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 0 ? false : true,
                onClick: handleConfirmInvoice.bind(
                  null,
                  record.customerInvoiceApplicationId,
                  record.invoiceWay
                ),
                auth: ["dict001"],
              },
              {
                label: "重新开票",
                type: "primary",
                icon: CopyIcon,
                isIconBtn: true,
                isShow:
                  record.invoiceApplicationState === 1 && record.invoiceWay === 1 ? false : true,
                onClick: handleReInvoice.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "打印",
                type: "primary",
                icon: PrintIcon,
                isIconBtn: true,
                isShow:
                  record.invoiceApplicationState === 1 && record.invoiceWay === 1 ? false : true,
                onClick: handlePrint.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "寄出",
                type: "primary",
                icon: MailOpenIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 6 ? false : true,
                onClick: handleMail.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "重寄",
                type: "primary",
                icon: MailIcon,
                isIconBtn: true,
                isShow:
                  record.invoiceApplicationState === 1 && record.invoiceWay === 0 ? false : true,
                onClick: handleRepeatMail.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "退回",
                type: "primary",
                icon: ArrowBackIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 0 ? false : true,
                onClick: handleBack.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "作废",
                type: "primary",
                icon: ArrowBackIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 4 ? false : true,
                onClick: handleInvalid.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "导出相关行程单",
                type: "primary",
                icon: GitIcon,
                isIconBtn: true,
                isShow:
                  (record.invoiceApplicationState === 1 ||
                    record.invoiceApplicationState === 6 ||
                    record.invoiceApplicationState === 7) &&
                  record.invoiceApplicationTypeCode === "IAT0002"
                    ? false
                    : true,
                onClick: handleDownload.bind(null, record.customerInvoiceApplicationId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getInvoiceAppPage({ page, search: search });
        console.log(res.data);
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    function handleSee(customerInvoiceApplicationId: string) {
      const { openDrawer } = invoiceDrawerRef.value;
      openDrawer(customerInvoiceApplicationId);
    }
    // 开票
    function handleConfirmInvoice(customerInvoiceApplicationId: string) {
      const { handleModal } = invoiceModalRef.value;
      handleModal(customerInvoiceApplicationId);
    }
    // 退回
    function handleBack(customerInvoiceApplicationId: string) {
      console.log(customerInvoiceApplicationId);
      const { handleModal } = returnInvoiceModalRef.value;
      handleModal(customerInvoiceApplicationId);
    }
    async function handleDownload(customerInvoiceApplicationId: string) {
      try {
        loading.value = true;
        let res = await downloadRelativeItinerary({ customerInvoiceApplicationId });
        await downloadFile(res, "发票相关行程单");
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    // 寄出
    function handleMail(customerInvoiceApplicationId: string) {
      const { handleModal } = sendMailRef.value;
      handleModal(customerInvoiceApplicationId);
    }
    // 重寄
    function handleRepeatMail(customerInvoiceApplicationId: string) {
      const { handleModal } = repeatSendMailModalRef.value;
      handleModal(customerInvoiceApplicationId);
    }
    // 作废
    async function handleInvalid(customerInvoiceApplicationId: string) {
      dialog.warning({
        title: "提示",
        content: "确定作废?",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          try {
            loading.value = false;
            let res = await invoiceInvalid({ customerInvoiceApplicationId });
            message.success(window.$tips[res.code]);
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        },
        onNegativeClick: () => {},
      });
    }
    // 打印
    async function handlePrint(customerInvoiceApplicationId: string) {
      console.log(customerInvoiceApplicationId);
      try {
        loading.value = true;
        let res = await invoicePrint({ customerInvoiceApplicationId });
        console.log(res);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    // 重新开票
    function handleReInvoice(customerInvoiceApplicationId: string) {
      console.log(customerInvoiceApplicationId);
      dialog.warning({
        title: "提示",
        content: "重开会作废之前的发票，确认要重开吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          try {
            loading.value = false;
            let res = await invoiceReOpen({ customerInvoiceApplicationId });
            message.success(window.$tips[res.code]);
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        },
        onNegativeClick: () => {},
      });
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    };
    const reset = () => {
      queryValue.value = {
        invoiceApplicationTimeLE: null,
        invoiceApplicationTimeGE: null,
        invoiceApplicationStateEQ: null,
        customerPhoneLike: null,
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    }

    function handlePage(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    }

    return {
      queryValue,
      data,
      loading,
      invoiceDrawerRef,
      sendMailRef,
      basicTableRef,
      invoiceAppOptions,
      returnInvoiceModalRef,
      repeatSendMailModalRef,
      invoiceModalRef,
      getRowKeyId: (row: TableDataItemInter) => row.customerInvoiceApplicationId,
      columns,
      itemCount,

      reloadPage,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
