<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="日期：" path="contractName">
        <n-date-picker class="n_date" v-model:formatted-value="year" value-format="yyyy" type="yearrange" clearable />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReturn">返回</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-auto cont">
      <div class="section">
        <div class="wrap flex flex-wrap overflow-hidden">
          <div v-for="(item, index) in dashData" :key="index" class="box flex flex-column jc-centerai-center">
            <div class="value">{{ item.value }}</div>
            <div class="label">{{ item.label }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="title flex ai-center">
          <span>销售数据趋势</span>
        </div>
        <div class="flex jc-between ai-center">
          <div id="chart1" ref="chart1Ref" class="flex-1 chart"></div>
        </div>
      </div>
      <div class="section">
        <div class="title flex ai-center">
          <span>项目情况</span>
        </div>
        <div class="flex jc-between ai-center">
          <div id="chart2" ref="chart2Ref" class="flex-1 chart"></div>
        </div>
      </div>
      <div class="section">
        <div class="title flex ai-center">
          <span>收款情况</span>
        </div>
        <div class="flex jc-between ai-center">
          <div id="chart3" ref="chart3Ref" class="flex-1 chart"></div>
        </div>
      </div>
      <div class="section">
        <div class="title flex ai-center">
          <span>付款情况</span>
        </div>
        <div class="flex jc-between ai-center">
          <div id="chart4" ref="chart4Ref" class="flex-1 chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from 'naive-ui';
import echarts from '@/utils/echarts';
import dayjs from "dayjs";
import { baseStore } from "@/store";
import { getDashboard } from "@/apis/index";
import { formatThousands } from "@/utils/index";

const router = useRouter()
const message = useMessage()
const collapse = computed(() => baseStore().collapse);
let year: any = ref([(new Date().getFullYear()).toString(), (new Date().getFullYear()).toString()]);
let dashData: any = ref([
  {
    label: '销售总额',
    value: '0元'
  },
  {
    label: '付款总额',
    value: '0元'
  },
  {
    label: '回款总额',
    value: '0元'
  },
  {
    label: '未付款总额',
    value: '0元'
  },
  {
    label: '客户总数',
    value: '0人'
  },
  {
    label: '新增客户',
    value: '0人'
  },
  {
    label: '项目总数',
    value: '0个'
  },
  {
    label: '合同总数',
    value: '0份'
  }
]);
let chartData: any = ref({
  sales: {
    date: [],
    project: [],
    contract: []
  },
  projects: [],
  finance: {
    years: [],
    ysMoeny: [],
    payMoeny: [],
    unPayMoeny: [],
    yfMoeny: [],
    payfkMoeny: [],
    unPayfkMoeny: []
  }
})
const chart1Ref = ref(null);
const chart2Ref = ref(null);
const chart3Ref = ref(null);
const chart4Ref = ref(null);
let myCharts: any = ref({
  echart1: null,
  echart2: null,
  echart3: null,
  echart4: null
})
const onReset = async () => {
  year.value = [(new Date().getFullYear()).toString(), (new Date().getFullYear()).toString()];
  await getList();
  initChart();
};
const onSearch = async () => {
  await getList();
  initChart();
};
const onReturn = () => {
  router.back()
};
const formatTime = (time: number): string => {
  return `${time / 3600 > 9 ? (time / 3600).toFixed(0) : '0' + (time / 3600).toFixed(0)}:${(time % 3600) / 60 > 9 ? Math.floor(((time % 3600) / 60)).toFixed(0) : '0' + Math.floor(((time % 3600) / 60)).toFixed(0)}:${time % 60 > 9 ? (time % 60).toFixed(0) : '0' + (time % 60).toFixed(0)}`
}
const getList = async () => {
  try {
    const { data: { contractMoney = 0, fkMoney = 0, payMoney = 0, unPayMoney = 0, custom = 0, customAdd = 0, project = 0, contract = 0, projects = [], sales = { date: [], project: [], contract: [] }, ysyf = {years: [], ysMoeny: [], payMoeny: [], unPayMoeny: [], yfMoeny: [], payfkMoeny: [], unPayfkMoeny: []} } } = await getDashboard({
      startYear: year.value && year.value.length > 0 ? year.value[0] : null,
      endYear: year.value && year.value.length > 1 ? year.value[1] : null
    }) as any
    dashData.value[0].value = formatThousands(contractMoney, 0) + '元'
    dashData.value[1].value = formatThousands(fkMoney, 0) + '元'
    dashData.value[2].value = formatThousands(payMoney, 0) + '元'
    dashData.value[3].value = formatThousands(unPayMoney, 0) + '元'
    dashData.value[4].value = formatThousands(custom, 0) + '人'
    dashData.value[5].value = formatThousands(customAdd, 0) + '人'
    dashData.value[6].value = formatThousands(project, 0) + '个'
    dashData.value[7].value = formatThousands(contract, 0) + '份'
    chartData.value.sales = sales
    chartData.value.projects = projects
    chartData.value.finance.years = ysyf.years
    chartData.value.finance.ysMoeny = ysyf.ysMoeny
    chartData.value.finance.payMoeny = ysyf.payMoeny
    chartData.value.finance.unPayMoeny = ysyf.unPayMoeny
    chartData.value.finance.yfMoeny = ysyf.yfMoeny
    chartData.value.finance.payfkMoeny = ysyf.payfkMoeny
    chartData.value.finance.unPayfkMoeny = ysyf.unPayfkMoeny
  } catch (e: any) {
    message.error(e.msg)
  }
};
const initChart = async () => {
  myCharts.value.echart1 = new echarts({
    ref: chart1Ref,
    options: {
      xAxis: {
        data: chartData.value.sales.date
      },
      series: [
        {
          type: 'line',
          name: '项目',
          data: chartData.value.sales.project
        },
        {
          type: 'line',
          name: '合同',
          data: chartData.value.sales.contract
        }
      ]
    }
  })
  myCharts.value.echart2 = new echarts({
    ref: chart2Ref,
    options: {
      xAxis: {
        data: chartData.value.projects.map(item => item.stageName)
      },
      series: [
        {
          type: 'bar',
          name: '项目数量',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.projects.map(item => item.num)
        }
      ]
    }
  })
  myCharts.value.echart3 = new echarts({
    ref: chart3Ref,
    options: {
      xAxis: {
        data: chartData.value.finance.years
      },
      series: [
        {
          type: 'bar',
          name: '应收总额',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.finance.ysMoeny
        },
        {
          type: 'bar',
          name: '已收额度',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.finance.payMoeny
        },
        {
          type: 'bar',
          name: '未收额度',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.finance.unPayMoeny
        }
      ]
    }
  })
  myCharts.value.echart4 = new echarts({
    ref: chart4Ref,
    options: {
      xAxis: {
        data: chartData.value.finance.years
      },
      series: [
        {
          type: 'bar',
          name: '应付总额',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.finance.yfMoeny
        },
        {
          type: 'bar',
          name: '已付额度',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.finance.payfkMoeny
        },
        {
          type: 'bar',
          name: '未付额度',
          barMaxWidth: 40,
          barMinWidth: 20,
          data: chartData.value.finance.unPayfkMoeny
        }
      ]
    }
  })
  watch(collapse, (_newValue, _oldValue) => {
    myCharts.value.echart1?.refresh();
    myCharts.value.echart2?.refresh();
    myCharts.value.echart3?.refresh();
    myCharts.value.echart4?.refresh();
  });
};
onMounted(async () => {
  await getList();
  initChart();
})
</script>

<style lang="scss" scoped>
.n_date {
  width: 200px;
}
.section {
  .wrap {
    .box {
      width: calc(25% - 80px);
      min-width: 168px;
      height: 80px;
      margin: 20px;
      padding: 12px;
      color: #fff;
      font-weight: bold;
      font-size: 24px;
      &:nth-child(1) {
        background: #71A3E2;
      }
      &:nth-child(2) {
        background: #91CD63;
      }
      &:nth-child(3) {
        background: #E8CC70;
      }
      &:nth-child(4) {
        background: #8D6FDB;
      }
      &:nth-child(5) {
        background: #91CD63;
      }
      &:nth-child(6) {
        background: #E8CC70;
      }
      &:nth-child(7) {
        background: #8D6FDB;
      }
      &:nth-child(8) {
        background: #71A3E2;
      }
    }
  }
  .title {
    margin: 24px 0 16px;
    span {
      font-size: 20px;
      font-weight: 600;
      color: #18233A;
    }
  }
  .chart {
    height: 300px;
  }
}
</style>