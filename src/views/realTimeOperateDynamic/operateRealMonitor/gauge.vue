<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from "vue";
import { useEcharts } from "@/hooks/web/useEcharts";
export default defineComponent({
  name: "Gauge",
  props: {
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    height: {
      type: String as PropType<string>,
      default: "350px",
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
      type: Number,
      default: () => 0,
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);

    const { setOptions } = useEcharts(chartRef as Ref<HTMLDivElement>);

    onMounted(() => {
      setOptions({
        title: {
          text: props.text,
          left: "180",
          subtext: props.subtext,
          top: 13,
        },
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            type: "gauge",
            center: ["50%", "60%"], // 仪表位置
            radius: "75%", //仪表大小
            detail: { formatter: "{value}%" },
            data: [{ value: props.data }],
          },

          //   {
          //     type: "gauge",
          //     axisLine: {
          //       lineStyle: {
          //         width: 20,
          //         color: [
          //           [0.3, "#67e0e3"],
          //           [0.7, "#37a2da"],
          //           [1, "#fd666d"],
          //         ],
          //       },
          //     },
          //     pointer: {
          //       itemStyle: {
          //         color: "auto",
          //       },
          //     },
          //     axisTick: {
          //       distance: -20,
          //       length: 5,
          //       lineStyle: {
          //         color: "#fff",
          //         width: 2,
          //       },
          //     },
          //     splitLine: {
          //       distance: -50,
          //       length: 30,
          //       lineStyle: {
          //         color: "#fff",
          //         width: 4,
          //       },
          //     },
          //     center: ["50%", "53%"],
          //     axisLabel: {
          //       color: "auto",
          //       distance: 40,
          //       fontSize: 18,
          //     },
          //     detail: {
          //       valueAnimation: true,
          //       formatter: "{value} %",
          //       color: "auto",
          //     },
          //     data: [
          //       {
          //         value: 70,
          //       },
          //     ],
          //   },
        ],
      });
    });
    return { chartRef };
  },
});
</script>
