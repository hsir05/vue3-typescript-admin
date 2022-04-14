<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from "vue";
import { useEcharts } from "@/hooks/web/useEcharts";
export default defineComponent({
  name: "Line",
  props: {
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
      type: Array as PropType<number[]>,
    },
    xAxisData: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);

    const { setOptions } = useEcharts(chartRef as Ref<HTMLDivElement>);

    onMounted(() => {
      setOptions({
        title: {
          text: props.text,
          subtext: props.subtext,
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
          data: props.xAxisData,
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "value",
            splitArea: {
              show: true,
              areaStyle: {
                color: ["rgba(255,255,255,0.2)", "rgba(226,226,226,0.2)"],
              },
            },
          },
        ],

        series: [
          {
            data: props.data,
            label: {
              show: true,
              position: "top",
            },
            barMaxWidth: 80,
            type: "bar",
            itemStyle: {
              color: function (params) {
                const colorList = [
                  "#c23531",
                  "#1eafdd",
                  "#91c7ae",
                  "#63869e",
                  "#e56c3d",
                  "#d7b027",
                  "#2f4554",
                  "#61a0a8",
                  "#d48265",
                  "#91c7ae",
                ];
                return colorList[params.dataIndex];
              },
            },
          },
        ],
      });
    });
    return { chartRef };
  },
});
</script>
