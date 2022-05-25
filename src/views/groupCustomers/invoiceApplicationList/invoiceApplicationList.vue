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
      <n-form-item label="集团客户名称" path="groupCustomerNameLike">
        <n-input
          v-model:value="queryValue.groupCustomerNameLike"
          clearable
          placeholder="输入集团客户名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="申请时间(起始)" path="invoiceApplicationTimeGe">
        <n-date-picker
          v-model:value="queryValue.invoiceApplicationTimeGe"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>
      <n-form-item label="申请时间(结束)" path="invoiceApplicationTimeLe">
        <n-date-picker
          v-model:value="queryValue.invoiceApplicationTimeLe"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="发票申请状态" path="invoiceApplicationStateEq">
        <n-select
          clearable
          filterable
          v-model:value="queryValue.invoiceApplicationStateEq"
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
    <InvoiceDrawer ref="invoiceDrawerRef" :width="700" @on-save-after="handleSaveAfter" />

    <BackModal ref="backModalRef" @on-save-after="handleSaveAfter" />
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
import { invoiceAppOptions, invoiceAppObj } from "@/config/form";
import { TableDataItemInter, QueryFormInter } from "./type";
import BackModal from "./backModal.vue";
import { getGroupInvoiceAppPage } from "@/api/groupCustomers/groupCustomers";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "InvoiceApplicationList",
  components: { BasicTable, InvoiceDrawer, BackModal },
  setup() {
    const loading = ref(false);
    const invoiceDrawerRef = ref();
    const basicTableRef = ref();
    const sendMailRef = ref();
    const backModalRef = ref();
    const itemCount = ref(null);
    const queryValue = ref<QueryFormInter>({
      groupCustomerNameLike: null,
      invoiceApplicationTimeGe: null,
      invoiceApplicationTimeLe: null,
      invoiceApplicationStateEq: null,
    });

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
        title: "集团客户名称",
        key: "groupCustomerName",
        align: "center",
      },
      {
        title: "发票申请类型",
        key: "invoiceApplicationType",
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
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleSee.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "开票",
                type: "primary",
                icon: TicketIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 0 ? false : true,
                onClick: handleConfirmInvoice.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "重新开票",
                type: "primary",
                icon: CopyIcon,
                isIconBtn: true,
                isShow:
                  record.invoiceApplicationState === 0 && record.invoiceWay === 1 ? false : true,
                onClick: handleReInvoice.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "打印",
                type: "primary",
                icon: PrintIcon,
                isIconBtn: true,
                isShow:
                  record.invoiceApplicationState === 0 && record.invoiceWay === 1 ? false : true,
                onClick: handlePrint.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "寄出",
                type: "primary",
                icon: MailOpenIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 6 ? false : true,
                onClick: handleMail.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "重寄",
                type: "primary",
                icon: MailIcon,
                isIconBtn: true,
                isShow:
                  record.invoiceApplicationState === 0 && record.invoiceWay === 1 ? false : true,
                onClick: handleMail.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "退回",
                type: "primary",
                icon: ArrowBackIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 0 ? false : true,
                onClick: handleBack.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
              {
                label: "作废",
                type: "primary",
                icon: ArrowBackIcon,
                isIconBtn: true,
                isShow: record.invoiceApplicationState === 4 ? false : true,
                onClick: handleBack.bind(null, record.groupCustomerInvoiceApplicationId),
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
                onClick: handleDownload.bind(null, record.groupCustomerInvoiceApplicationId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getGroupInvoiceAppPage({ page, search: search });
        console.log(res.data);
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleSee(groupCustomerInvoiceApplicationId: string) {
      const { openDrawer } = invoiceDrawerRef.value;
      openDrawer(groupCustomerInvoiceApplicationId);
    }

    // 邮寄
    function handleMail(groupCustomerInvoiceApplicationId: string) {
      const { handleModal } = sendMailRef.value;
      handleModal(groupCustomerInvoiceApplicationId);
    }
    // 打印
    function handlePrint(groupCustomerInvoiceApplicationId: string) {
      console.log(groupCustomerInvoiceApplicationId);
    }
    // 确认开票
    function handleConfirmInvoice(groupCustomerInvoiceApplicationId: string) {
      console.log(groupCustomerInvoiceApplicationId);
    }
    // 重新邮寄
    function handleReInvoice(groupCustomerInvoiceApplicationId: string) {
      console.log(groupCustomerInvoiceApplicationId);
    }
    // 退回
    function handleBack(groupCustomerInvoiceApplicationId: string) {
      console.log(groupCustomerInvoiceApplicationId);
      const { handleModal } = backModalRef.value;
      handleModal(groupCustomerInvoiceApplicationId);
    }
    async function handleDownload(groupCustomerInvoiceApplicationId: string) {
      // try {
      //     let res = await downloadRelativeItinerary({groupCustomerInvoiceApplicationId})
      console.log(groupCustomerInvoiceApplicationId);
      //      // 创建一个新的url，此url指向新建的Blob对象
      //     // let url = window.URL.createObjectURL(new Blob([data]))
      //     let url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(res);
      //     // 创建a标签，并隐藏改a标签
      //     let link = document.createElement('a')
      //     link.style.display = 'none'
      //     // a标签的href属性指定下载链接
      //     link.href = url
      //     //setAttribute() 方法添加指定的属性，并为其赋指定的值。
      //     link.setAttribute('download', '发票关联行程单' + '.xlsx')
      //     document.body.appendChild(link)
      //     link.click()
      // } catch (err) {
      //     console.log(err);
      // }
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        groupCustomerNameLike: null,
        invoiceApplicationTimeGe: null,
        invoiceApplicationTimeLe: null,
        invoiceApplicationStateEq: null,
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      invoiceDrawerRef,
      basicTableRef,
      invoiceAppOptions,
      backModalRef,
      columns,
      itemCount,

      reloadPage,
      sendMailRef,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
