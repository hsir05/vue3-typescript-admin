<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, toRefs, Ref } from "vue";
import { useEcharts } from "@/hooks/web/useEcharts";
type ArrItemInter = number[];
const props = defineProps({
  width: {
    type: String as PropType<string>,
    default: "100%",
  },
  height: {
    type: String as PropType<string>,
    default: "300px",
  },
  text: {
    type: String,
    default: () => "",
  },
  subtext: {
    type: String,
    default: () => "",
  },
  data: {
    type: Array as PropType<ArrItemInter[]>,
    require: true,
    default: () => [],
  },
  legendData: {
    type: Array as PropType<string[]>,
    // require: true,
    default: () => ["用户总数"],
  },
  xAxisData: {
    type: Array as PropType<string[]>,
    require: true,
    default: () => [],
  },
});
const chartRef = ref<HTMLDivElement | null>(null);
const lineData = ref<ArrItemInter[]>([]);
const { setOptions } = useEcharts(chartRef as Ref<HTMLDivElement>);
const { width, height, text, subtext, data, legendData, xAxisData } = toRefs(props);

watch(data, (newValue) => {
  lineData.value = newValue;
  initLine();
});
lineData.value = data.value;

onMounted(() => {
  initLine();
});

const initLine = () => {
  let option = {
    title: {
      text: text,
      subtext: subtext,
    },
    legend: {
      data: legendData,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          width: 1,
          color: "#019680",
        },
      },
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        data: lineData.value,
        name: legendData.value[0],
        label: {
          show: true,
          position: "top",
        },
        type: "line",
      },
    ],
  };
  // @ts-ignore
  setOptions(option);
};
</script>
