<template>
  <n-card class="box-default" closable @close="handleClose(dayData.driver_no)">
    <div class="box-header with-border">
      {{ dayData.driver_no }}&nbsp;&nbsp;{{ dayData.driver_full_name }}
    </div>
    <div ref="chartRef" :style="{ height, width }"></div>
    <n-grid :x-gap="12" :y-gap="8" :cols="2">
      <n-grid-item class="">
        &nbsp;&nbsp;&nbsp;&nbsp;总计时长&nbsp;:&nbsp;{{ dayData.total_online_duration }}
      </n-grid-item>
      <n-grid-item class=" text-right">
        操作&nbsp;:&nbsp;
        <n-button size="tiny" text type="tertiary" title="操作记录" style="font-size:14px" @click="showModel(dayData.operation_company_driver_id)">
          <template #icon>
            <n-icon>
              <ListIcon/>
            </n-icon>
          </template>
        </n-button>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>
<script lang="ts">
import {useEcharts} from "@/hooks/web/useEcharts";
import {defineComponent, onMounted, ref, Ref, toRefs} from "vue";
import {ResultInter} from './type';
import {List as ListIcon} from "@vicons/ionicons5"

export default defineComponent({
  name: "Order",
  components: {ListIcon},
  props: {
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    height: {
      type: String as PropType<string>,
      default: "100px",
    },
    legendData: {
      type: Array as PropType<string[]>,
      require: true,
      default: () => [],
    },
    xAxisData: {
      type: Array as PropType<string[]>,
      require: true,
      default: () => [],
    },
    dayData: {
      type: Object as PropType<ResultInter>,
      require: true,
      default: () => {
      },
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  emits: ["get-is-show","show-model"],
  setup(props, {emit}) {
    const chartRef = ref<HTMLDivElement | null>(null);
    const {setOptions} = useEcharts(chartRef as Ref<HTMLDivElement>);
    const {dayData} = toRefs(props);
    let data = [
      [0, 0, dayData.value.online_duration_0],
      [0, 1, dayData.value.online_duration_1],
      [0, 2, dayData.value.online_duration_2],
      [0, 3, dayData.value.online_duration_3],
      [0, 4, dayData.value.online_duration_4],
      [0, 5, dayData.value.online_duration_5],
      [0, 6, dayData.value.online_duration_6],
      [0, 7, dayData.value.online_duration_7],
      [0, 8, dayData.value.online_duration_8],
      [0, 9, dayData.value.online_duration_9],
      [0, 10, dayData.value.online_duration_10],
      [0, 11, dayData.value.online_duration_11],
      [1, 0, dayData.value.online_duration_12],
      [1, 1, dayData.value.online_duration_13],
      [1, 2, dayData.value.online_duration_14],
      [1, 3, dayData.value.online_duration_15],
      [1, 4, dayData.value.online_duration_16],
      [1, 5, dayData.value.online_duration_17],
      [1, 6, dayData.value.online_duration_18],
      [1, 7, dayData.value.online_duration_19],
      [1, 8, dayData.value.online_duration_20],
      [1, 9, dayData.value.online_duration_21],
      [1, 10, dayData.value.online_duration_22],
      [1, 11, dayData.value.online_duration_23],
    ];
    let seriesData = data.map(function (item) {
      return [item[1], item[0], item[2] || "-"];
    });
    let dayEchartOption = {
      animation: true,
      grid: {height: "60%", width: "90%", y: "10%"},
      xAxis: {
        type: "category",
        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        axisTick: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: ["上午", "下午"],
        splitArea: {show: true},
        inverse: true,
      },
      visualMap: {
        min: 0,
        max: 60,
        show: false,
        inRange: {color: ["#BBD7E8", 'rgba(54, 128, 168, 1)']},
      },
      series: [
        {
          name: "Punch Card",
          type: "heatmap",
          data: seriesData,
          label: {normal: {show: true}},
          itemStyle: {emphasis: {shadowBlur: 20, shadowColor: "rgba(0, 0, 0, 0.5)"}},
        },
      ],
    };

    function handleClose(driverNo: string) {
      emit("get-is-show", driverNo)
    }

    function showModel(driverId: string){
      emit("show-model", driverId)
    }

    //@ts-ignore
    onMounted(() => setOptions(dayEchartOption));
    return {
      chartRef,

      handleClose,
      showModel
    };
  }
});
</script>

