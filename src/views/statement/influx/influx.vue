<template>
  <div>
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="90"
      :model="queryForm"
    >
      <n-form-item label="流量方" label-placement="left">
        <n-select
          v-model:value="queryForm.influxCode"
          clearable
          filterable
          placeholder="选择流量方"
          style="width: 220px"
          :options="influxData"
        />
      </n-form-item>

      <n-form-item label="开通城市" label-placement="left">
        <n-select
          v-model:value="queryForm.cityCode"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 220px"
          :options="openCityData"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="时间区间" path="section">
          <n-date-picker
            v-model:value="queryForm.section"
            style="width: 220px"
            type="daterange"
            :shortcuts="rangeShortcuts"
            :update-value-on-close="true"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="query"
          >查找
        </n-button>
      </div>
    </n-form>

    <!-- 表格 -->
    <div class="bg-white mt-10px p-10px" style="height: calc(100% - 95px)">
      <div class="flex p-10px">
        <span class="font-semibold">对账单总计</span>
        <span
          >总报价 = 浮动前报价 + 浮动金额；支付金额 = 浮动前报价 + 代金券抵扣金额 + 支付浮动费 +
          会员折扣金额；</span
        >
      </div>
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border"
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />

      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="resultColumns"
        class="box-border"
        :row-key="getRowKeyId"
        :data="result"
        :pagination="false"
      />

      <!-- 分页 -->
      <n-pagination
        v-if="resultItemCount"
        v-model:page="page"
        v-model:page-size="pageSize"
        v-model:item-count="resultItemCount"
        :page-slot="5"
        :show-size-picker="true"
        :show-quick-jumper="true"
        class="mt-10px justify-end mr-10px"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ resultItemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, reactive, toRaw, onMounted, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "../type";
import { getAllOpenCity, getInfluxList } from "@/api/common/common";
import { getInflux, getInfluxDetail } from "@/api/statement/statement";
import dayjs from "dayjs";
import { pageSizes, rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "InfluxStatement",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const openCitData = ref([]);
    interface QueryFormInter {
      section: number[];
      companyId: string | null;
      influxCode: string | null;
      cityCode: string | null;
    }
    const queryForm = ref<QueryFormInter>({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      companyId: "75e642e0096b4a41a2b2ecf933c92247",
      influxCode: "IFT0001",
      cityCode: "allCity",
    });
    const itemCount = ref(null);
    const resultItemCount = ref(null);
    const pagination = reactive({
      page: 0,
      pageSize: 10,
    });
    const openCityData = ref();
    const influxData = ref();
    const message = useMessage();

    const data = ref([]);
    const result = ref([]);
    const columns = [
      {
        title: "报价信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "浮动前总报价",
            key: "beforeFloatTotalCost",
            align: "center",
          },
          {
            title: "浮动金额",
            key: "orderFloatCost",
            align: "center",
          },
          {
            title: "总报价",
            key: "orderTotalCost",
            align: "center",
          },
        ],
      },
      {
        title: "支付信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "代金券抵扣金额",
            key: "customerCouponDenomination",
            align: "center",
          },
          {
            title: "支付浮动费",
            key: "orderPayFlostCost",
            align: "center",
          },
          {
            title: "会员折扣金额",
            key: "orderPayMemberDiscountCost",
            align: "center",
          },
          {
            title: "支付金额",
            key: "orderPayAmount",
            align: "center",
          },
        ],
      },
      {
        title: "抽成信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "总抽成金额",
            key: "totalDivideAmount",
            align: "center",
          },
          {
            title: "流量方抽成金额",
            key: "influxDivideAmount",
            align: "center",
          },
        ],
      },
    ];

    const resultColumns = [
      {
        title: "订单信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "流量方订单号",
            key: "influxOrderNo",
            align: "center",
          },
        ],
      },
      {
        title: "报价信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "浮动前总报价",
            key: "beforeFloatTotalCost",
            align: "center",
          },
          {
            title: "浮动率",
            key: "orderFloatRate",
            align: "center",
          },
          {
            title: "浮动最大金额",
            key: "orderMaxFloatPrice",
            align: "center",
          },
          {
            title: "浮动金额",
            key: "orderFloatCost",
            align: "center",
          },
          {
            title: "总报价",
            key: "beforeFloatTotalCost",
            align: "center",
          },
        ],
      },
      {
        title: "支付信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "代金券抵扣金额",
            key: "customerCouponDenomination",
            align: "center",
          },
          {
            title: "支付浮动率",
            key: "orderPayFloatRate",
            align: "center",
          },
          {
            title: "支付浮动最大金额",
            key: "totalDivideAmount",
            align: "center",
          },
          {
            title: "支付浮动费",
            key: "orderPayFloatCost",
            align: "center",
          },
          {
            title: "会员折扣",
            key: "orderPayMemberDiscountRate",
            align: "center",
          },
          {
            title: "会员折扣金额",
            key: "orderPayMemberDiscountCost",
            align: "center",
          },
        ],
      },
      {
        title: "抽成信息",
        key: "flowSquare",
        align: "center",
        children: [
          {
            title: "支付金额",
            key: "orderPayAmount",
            align: "center",
          },
          {
            title: "总抽成金额",
            key: "totalDivideAmount",
            align: "center",
          },
          {
            title: "流量方抽成",
            key: "influxDivideAmount",
            align: "center",
          },
        ],
      },
    ];
    onMounted(() => {
      getOpenCity();
      getInfluxData();
      getData();
      getPageData({ page: 0, pageSize: 10 });
    });

    async function getInfluxData() {
      try {
        let res = await getInfluxList();
        influxData.value = res.data.map((item: { entryName: string; entryCode: string }) => {
          let obj = {
            label: item.entryName,
            value: item.entryCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    }

    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data.map((item: { cityName: string; cityCode: string }) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
        openCityData.value.unshift({ label: "不限", value: "allCity" });
      } catch (err) {
        console.log(err);
      }
    }

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    async function getData() {
      try {
        let option = {
          cityCode: queryForm.value.cityCode as string,
          influxCode: queryForm.value.influxCode as string,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        };
        let res = await getInflux(option);
        data.value = res.data;
      } catch (err) {
        console.log(err);
      }
    }

    async function getPageData(page: { page: number; pageSize: number }) {
      try {
        let option = {
          ...page,
          cityCode: queryForm.value.cityCode as string,
          influxCode: queryForm.value.influxCode as string,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        };
        let res = await getInfluxDetail(option);
        resultItemCount.value = res.data.count;
        result.value = res.data.list;
      } catch (err) {
        console.log(err);
      }
    }

    async function downloadBtn() {
      try {
        let option = {
          influxCode: "qwe",
          cityCode: "qwe",
          beginDate: "qwe",
          endDate: "qwe",
          page: 0,
          influxName: "qwe",
        };
        // let res = await downloadInflux(option);
        console.log(option);
        //创建一个隐藏的a链接
        // const link = document.createElement("a");
        // let blob = new Blob([res.data], { type: "application/vnd.ms-excel" }); //文件流处理
        // link.style.display = "none"; //去除a标签的样式
        // link.href = URL.createObjectURL(blob);
        // link.download = "文件";
        // document.body.appendChild(link);
        // link.click();
      } catch (err) {
        console.log(err);
      }
    }

    function handlePage(page: number) {
      pagination.page = page;
      getPageData(toRaw(pagination));
    }
    // 每页显示
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      getPageData(toRaw(pagination));
    }

    return {
      loading,
      openCitData,
      queryForm,
      columns,
      resultColumns,
      data,
      itemCount,
      pageSizes,
      resultItemCount,
      ...toRefs(pagination),
      result,
      queryFormRef,
      influxData,
      openCityData,
      getRowKeyId: (row: tableDataItem) => row.id,
      rangeShortcuts,

      query,
      downloadBtn,
      handlePage,
      handlePageSize,
    };
  },
});
</script>
