<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { DEFER_FUND_CHART } from "@/config/flags";

type ChartBreakdown = { label: string; value: number };

const props = defineProps({
  breakdown: {
    type: Array as PropType<ChartBreakdown[]>,
    required: true,
  },
});

type EchartsModule = typeof import("echarts/core");

let echartsPromise: Promise<EchartsModule> | null = null;
let echartsCore: EchartsModule | null = null;

const loadEcharts = () => {
  if (echartsCore) return Promise.resolve(echartsCore);
  if (!echartsPromise) {
    echartsPromise = Promise.all([
      import("echarts/core"),
      import("echarts/charts").then((m) => ({ PieChart: m.PieChart })),
      import("echarts/components").then((m) => ({
        TooltipComponent: m.TooltipComponent,
        LegendComponent: m.LegendComponent,
      })),
      import("echarts/renderers").then((m) => ({ CanvasRenderer: m.CanvasRenderer })),
    ]).then(([core, { PieChart }, { TooltipComponent, LegendComponent }, { CanvasRenderer }]) => {
      core.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);
      core.registerTheme?.("swan", {
        textStyle: { fontFamily: "Inter, system-ui, sans-serif", color: "#173883" },
      });
      echartsCore = core;
      return core;
    });
  }
  return echartsPromise;
};

const chartEl = ref<HTMLDivElement | null>(null);
let chartInstance: import("echarts/core").ECharts | null = null;
let resizeBound = false;
const defer = DEFER_FUND_CHART;
const mounted = ref(false);

const totalValue = computed(() => props.breakdown.reduce((acc, item) => acc + Number(item.value ?? 0), 0));
const totalLabel = computed(() => `${Math.round(totalValue.value)}%`);

const ariaLabel = computed(() => {
  if (!props.breakdown.length) return "Program fund use chart";
  const summary = props.breakdown.map((item) => `${item.label} ${item.value}%`).join(", ");
  return `Program fund use chart: ${summary}`;
});

const handleResize = () => {
  chartInstance?.resize();
};

const drawChart = async () => {
  if (!chartEl.value || !props.breakdown.length) return;
  const echarts = await loadEcharts();
  await nextTick();
  if (!chartInstance) {
    chartInstance = echarts.init(chartEl.value, "swan", { renderer: "canvas" });
    if (!resizeBound) {
      window.addEventListener("resize", handleResize, { passive: true });
      resizeBound = true;
    }
  }

  const total = totalValue.value;
  chartInstance.setOption(
    {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["60%", "85%"],
          avoidLabelOverlap: true,
          label: { show: false },
          emphasis: {
            scale: true,
            label: { show: true, fontSize: 14, fontWeight: 600 },
          },
          data: props.breakdown.map((item) => ({ name: item.label, value: item.value })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: totalLabel.value,
            fontSize: 24,
            fontWeight: 700,
            fill: "#173883",
          },
        },
      ],
    },
    true
  );
  mounted.value = true;
};

const mountChart = async () => {
  if (mounted.value) return;
  await drawChart();
};

onMounted(() => {
  if (!defer) {
    mountChart();
  }
});

watch(
  () => props.breakdown,
  () => {
    if (defer && !mounted.value) return;
    drawChart();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (resizeBound) {
    window.removeEventListener("resize", handleResize);
    resizeBound = false;
  }
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <div class="card chart-card p-5">
    <button
      v-if="defer && !mounted"
      type="button"
      class="btn mb-4 focus-ring focus:outline-none"
      @click="mountChart"
    >
      View breakdown
    </button>
    <div ref="chartEl" class="h-64 md:h-72" role="img" :aria-label="ariaLabel"></div>
    <p class="sr-only">Total allocation {{ totalLabel }}</p>
  </div>
</template>

<style scoped>
.chart-card {
  min-height: 18rem;
}
</style>
