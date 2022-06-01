import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'
import echarts from '@/lib/echarts'
import { unref, nextTick, computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useEventListener } from '@/hooks/event/useEventListener'
import { useBreakpoint } from '@/hooks/event/useBreakpoint'
import { useTimeoutFn } from '@/hooks/core/useTimeout'
import { tryOnUnmounted } from '@vueuse/core'

export function useEcharts(elRef: Ref<HTMLDivElement>) {
  let chartInstance: echarts.ECharts | null = null
  let resizeFn = resize
  const cacheOptions = ref<EChartsOption>({})
  let removeResizeFn: Fn = () => {}

  resizeFn = useDebounceFn(resize, 200)

  const getOptions = computed((): EChartsOption => {
    return {
      ...cacheOptions.value as EChartsOption
    }
  })
  function initCharts() {
    const el = unref(elRef)
    if (!el || !unref(el)) {
      return
    }
    chartInstance = echarts.init(el)
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn
    })
    removeResizeFn = removeEvent
    const { widthRef, screenEnum } = useBreakpoint()
    if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn()
      }, 30)
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts()

          if (!chartInstance) return
        }
        clear && chartInstance?.clear()

        chartInstance?.setOption(unref(getOptions))
      }, 30)
    })
  }

  function resize() {
    chartInstance?.resize()
  }

//   watch(
//     () => getDarkMode,
//     () => {
//       if (chartInstance) {
//         chartInstance.dispose()
//         initCharts()
//         setOptions(cacheOptions.value)
//       }
//     }
//   )

  tryOnUnmounted(() => {
    if (!chartInstance) return
    removeResizeFn()
    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts()
    }
    return chartInstance
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
}
