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
      default: "280px",
    },
  },
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);

    const { setOptions } = useEcharts(chartRef as Ref<HTMLDivElement>);

    onMounted(() => {
      setOptions({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "Pressure",
            type: "gauge",
            detail: {
              formatter: "{value}",
            },
            data: [
              {
                value: 50,
                name: "SCORE",
              },
            ],
          },
        ],
      });
    });
    return { chartRef };
  },
});
</script>
