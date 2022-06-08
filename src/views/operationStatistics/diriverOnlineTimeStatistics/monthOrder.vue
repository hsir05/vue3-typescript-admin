<template>
  <n-card class="box-default" closable @close="handleClose(dayData.driver_no)">
    <div class="box-header with-border">
      {{ dayData.driver_no }}&nbsp;&nbsp;{{ dayData.driver_full_name }}
    </div>
    <div ref="chartRef" :style="{ height, width }"></div>
    <n-grid :x-gap="12" :y-gap="8" :cols="1">
      <n-grid-item class="">
        &nbsp;&nbsp;&nbsp;&nbsp;总计时长&nbsp;:&nbsp;{{ formatMinutes() }}
      </n-grid-item>
    </n-grid>
  </n-card>
</template>
<script lang="ts">
import { useEcharts } from "@/hooks/web/useEcharts";
import { defineComponent, onMounted, ref, Ref, toRefs } from "vue";
import { MonthResultInter} from './type';
export default defineComponent({
  name: "Order",
  props: {
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    height: {
      type: String as PropType<string>,
      default: "250px",
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
      type: Object as PropType<MonthResultInter>,
      require: true,
      default: () => {},
    },
    month:{
      type: String as PropType<string>,
      require: true,
    }
  },
  emits: ["get-is-show"],
  setup(props, { emit }) {
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions } = useEcharts(chartRef as Ref<HTMLDivElement>);
    const { dayData,month } = toRefs(props);

    function formatMinutes(){
      return (Math.floor(dayData.value.total_online_duration/60) == 0 ? '' : Math.floor(dayData.value.total_online_duration/60) + '小时') +
            (dayData.value.total_online_duration - (Math.floor(dayData.value.total_online_duration/60) * 60)) + '分钟'
    }
    let data = dayData.value.day_online_duration_list.map((item: { date: string; day_online_duration: number; }) => [item.date, item.day_online_duration])
    console.log(data)
    let dayEchartOption = {
      tooltip: {
        show: true,
        formatter: function (params: { value: any[]; }) {
          return params.value[0];
        },
      },
      visualMap: {
        min: 0,
        max: 1440,
        show: false,
        inRange: {
          color: ["#E2E2E2", "#367fa9"],
        },
      },
      calendar: {
        orient: "vertical",
        height: "80%",
        width: "100%",
        top: 40,
        left: 0,
        yearLabel: {
          show: false,
        },
        monthLabel: {
          show: false,
        },
        dayLabel: {
          nameMap: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        },
        splitArea: {
          show: true,
        },
        splitLine: {
          show: false,
        },
        itemStyle: {
          borderColor: "#f1f1f1",
          borderWidth: 0.5,
        },
        cellSize: 40,
        range: month,
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: data,
        label: {
          normal: {
            show: true,
            formatter: function (params: { value: any[]; }) {
              return params.value[1];
            },
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    };

    function handleClose(driverNo: string) {
      emit("get-is-show", driverNo);
    }

    //@ts-ignore
    onMounted(() => setOptions(dayEchartOption));
    return {
      chartRef,

      handleClose,
      formatMinutes
    };
  },
});
</script>
