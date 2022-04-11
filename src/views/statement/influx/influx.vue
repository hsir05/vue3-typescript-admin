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
          :options="openCityList.result"
        />
      </n-form-item>

      <n-form-item label="开通城市" label-placement="left">
        <n-select
          v-model:value="queryForm.cityCode"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 220px"
          :options="openCityList.result"
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
          >查找</n-button
        >
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

      <div class="flex p-10px">
        <span class="font-semibold">对账单详情</span>
        <div>
          如果对账单超过20000条，将以多个文件的形式导出！
          <n-button
            attr-type="button"
            :loading="loading"
            class="ml-10px"
            type="primary"
            @click="downloadBtn"
            ><template #icon>
              <n-icon>
                <DownloadIcon />
              </n-icon> </template
            >下载对帐单</n-button
          >
        </div>
      </div>
      <n-table :single-line="false" class="text-center">
        <thead>
          <tr>
            <th>订单信息</th>
            <th colspan="4">报价信息</th>
            <th colspan="8">支付信息</th>
            <th colspan="2">抽成信息</th>
          </tr>

          <tr>
            <th>流量方订单号</th>
            <th>浮动前总报价</th>
            <th>浮动率</th>
            <th>浮动最大金额</th>
            <th>浮动金额</th>
            <th>总报价</th>
            <th>支付浮动率</th>
            <th>支付浮动最大金额</th>
            <th>支付浮动费</th>
            <th>会员折扣</th>
            <th>会员折扣</th>
            <th>会员折扣金额</th>
            <th>支付金额</th>
            <th>总抽成金额</th>
            <th>流量方抽成</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in result.list" :key="index">
            <template v-for="(val, ind) in item" :key="ind">
              <td v-if="ind < item.length - 1">{{ val }}</td>
            </template>
          </tr>
        </tbody>
      </n-table>

      <!-- 分页 -->
      <n-pagination
        v-if="itemCount"
        v-model:page="page"
        v-model:page-size="pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        :show-size-picker="true"
        :show-quick-jumper="true"
        class="mt-10px justify-end mr-10px"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, reactive, onMounted, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import openCityList from "@/config/openCityList.json";
import { DownloadOutlined as DownloadIcon } from "@vicons/antd";
import { tableDataItem } from "../type";
import { downloadInflux, getInfluxDetail } from "@/api/statement/statement";
import { pageSizes, rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "InfluxStatement",
  components: {
    DownloadIcon,
  },
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date("2022-03-16"), new Date("2022-03-18")],
      cityCode: "allCity",
      influxCode: null,
      influxName: null,
    });
    const itemCount = ref(10);
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });
    const message = useMessage();

    const data = ref([]);
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

    onMounted(() => {
      getDetail();
    });

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

    async function getDetail() {
      try {
        let option = {
          influxCode: "IFT0001",
          cityCode: "allCity",
          beginDate: "2022-03-01",
          endDate: "2022-03-24",
          page: 0,
          pageSize: 10,
        };
        let res = await getInfluxDetail(option);
        console.log(res);

        setTimeout(() => {}, 1000);
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
        let res = await downloadInflux(option);
        //创建一个隐藏的a链接
        const link = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" }); //文件流处理
        link.style.display = "none"; //去除a标签的样式
        link.href = URL.createObjectURL(blob);
        link.download = "文件";
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        console.log(err);
      }
    }

    function handlePage(page: number) {
      pagination.page = page;
    }
    // 每页显示
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
    }

    return {
      loading,
      openCityList,
      queryForm,
      columns,
      data,
      itemCount,
      pageSizes,
      ...toRefs(pagination),
      result: {
        recordsFiltered: 22,
        list: [
          [
            "YM20220301142825116292",
            16,
            0.7,
            28,
            -4.8,
            11.2,
            0,
            0.7,
            28,
            -4.8,
            0.95,
            -0.56,
            10.64,
            11.2,
            1.68,
            "2022-03-01T06:29:36.185+00:00",
          ],
          [
            "YM20220301143156459126",
            16,
            0.7,
            28,
            -4.8,
            11.2,
            0,
            0.7,
            28,
            -4.8,
            0.95,
            -0.56,
            10.64,
            11.2,
            1.68,
            "2022-03-01T06:32:49.432+00:00",
          ],
          [
            "YM20220301143333862446",
            50,
            1,
            0,
            0,
            50,
            -6,
            1,
            0,
            0,
            0.95,
            -2.2,
            41.8,
            50,
            7.5,
            "2022-03-01T06:34:57.608+00:00",
          ],
          [
            "YM20220318141549221835",
            59.3,
            0.7,
            28,
            -14.49,
            44.81,
            0,
            0.7,
            28,
            -14.49,
            0.95,
            -1.69,
            43.12,
            44.81,
            6.72,
            "2022-03-18T06:17:41.149+00:00",
          ],
          [
            "YM20220317180907236134",
            54,
            0.75,
            28,
            -13.5,
            40.5,
            -20,
            0.75,
            28,
            -13.5,
            0.95,
            -1.03,
            19.47,
            40.5,
            6.08,
            "2022-03-18T07:55:33.207+00:00",
          ],
          [
            "YM20220318160732128763",
            129,
            0.7,
            28,
            -28,
            101,
            -15,
            0.7,
            28,
            -28,
            0.95,
            -4.3,
            30.9,
            101,
            15.15,
            "2022-03-18T08:26:27.806+00:00",
          ],
          [
            "YM20220318173928998124",
            35,
            0.75,
            28,
            -8.75,
            26.25,
            0,
            0.75,
            28,
            -8.75,
            0.95,
            -1.31,
            24.94,
            26.25,
            3.94,
            "2022-03-18T09:41:30.106+00:00",
          ],
          [
            "YM20220321145913326131",
            28,
            1,
            0,
            0,
            28,
            -20,
            1,
            0,
            0,
            0.95,
            -0.4,
            7.6,
            28,
            4.2,
            "2022-03-21T07:27:05.320+00:00",
          ],
          [
            "YM20220321154511368272",
            157,
            0.7,
            28,
            -28,
            129,
            -10,
            0.7,
            28,
            -28,
            0.95,
            -5.95,
            113.05,
            129,
            19.35,
            "2022-03-21T07:48:47.702+00:00",
          ],
          [
            "YM20220322095305591680",
            16,
            0.7,
            28,
            -4.8,
            11.2,
            0,
            0.7,
            28,
            -4.8,
            1,
            0,
            11.2,
            11.2,
            1.68,
            "2022-03-22T02:18:15.103+00:00",
          ],
        ],
        recordsTotal: 22,
      },
      queryFormRef,
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
