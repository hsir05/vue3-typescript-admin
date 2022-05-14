<template>
  <div class="bg-white mt-10px p-10px" style="height: calc(100% - 95px)">
    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border mb-15px"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="false"
    />
    <div class="flex mb-20px">
      <span>用户增长曲线</span>
      <n-date-picker
        v-model:value="month"
        style="width: 250px"
        @update:value="handleDate"
        type="month"
      />
    </div>
    <Order />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import Order from "./order.vue";
// import { getInfluxList } from "@/api/common/common";
export default defineComponent({
  name: "UsersStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const month = ref(null);
    const message = useMessage();

    const data = ref([]);

    const columns = [
      {
        title: "流量方",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "完成单量",
        key: "finishOrder",
        align: "center",
      },
      {
        title: "取消单量",
        key: "cancelOrder",
        align: "center",
      },
      {
        title: "无效单量",
        key: "invalidOrder",
        align: "center",
      },
      {
        title: "总计",
        key: "total",
        align: "center",
      },
    ];

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      loading.value = true;
      //   try {
      //     let openCity = await getOpenCity();
      //     console.log(openCity);

      //     let influx = await getInfluxList();
      //     console.log(influx);

      //     let res = await getCityOder({
      //       cityCode: "allCity",
      //       beginDate: "2022-03-16",
      //       endDate: "2022-03-18",
      //     });
      //     console.log(res);
      //     loading.value = false;
      //   } catch (err) {
      //     console.log(err);
      //     loading.value = false;
      //   }
    };

    function handleDate(value: string) {
      console.log(value);
      message.success("验证成功");
    }

    return {
      loading,
      month,
      columns,
      data,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,
      handleDate,
    };
  },
});
</script>
<style lang="scss" scoped></style>
