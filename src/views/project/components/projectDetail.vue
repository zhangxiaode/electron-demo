<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="项目详情"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">项目详情</slot>
    </template>
    <slot>
      <n-form
        :key="costKey"
        class="form"
        ref="formRef"
        :model="form"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">项目信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="项目名称：" path="projectName">
              {{ form.projectName }}
            </n-form-item>
            <n-form-item label="项目对接人：" path="projectAcceptUser">
              {{ form.projectAcceptUser }}
            </n-form-item>
            <n-form-item label="对接人电话：" path="acceptUserPhone">
              {{ form.acceptUserPhone }}
            </n-form-item>
            <n-form-item label="项目阶段：" path="currStage">
              {{ filterCurrStage(form.currStage) }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="学院/部门：" path="deptName">
              {{ form.deptName }}
            </n-form-item>
            <n-form-item label="专业：" path="speciality">
              {{ form.speciality }}
            </n-form-item>
            <n-form-item label="产品领域：" path="productArea">
              {{ filterProductArea(form.productArea) }}
            </n-form-item>
            <n-form-item label="项目等级：" path="projectLevel">
              {{ filterProjectLevel(form.projectLevel) }}
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">基本信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="客户名称：" path="customName">
              {{ form.customName }}
            </n-form-item>
            <n-form-item label="销售渠道：" path="channel">
              {{ filterProjectChannel(form.channel) }}
            </n-form-item>
            <n-form-item label="销售员：" path="salesperson">
              {{ form.salesperson }}
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              {{ form.remark }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="预计签约时间：" path="reserDate">
              {{ form.reserDate }}
            </n-form-item>
            <n-form-item label="预计签约金额：" path="reserSignMoney">
              {{ form.reserSignMoney }}
            </n-form-item>
            <n-form-item label="启用状态：" path="status">
              {{ form.status === '0' ? '启用' : '禁用' }}
            </n-form-item>
            <n-form-item label="推进记录：" path="record">
              <div>
                <div v-for="(item, index) in form.records" :key="index" class="record">{{ item.projectRecord }}</div>
              </div>
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">项目成本:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="项目编码：" path="projectCode">
              {{ form.projectCode }}
            </n-form-item>
            <n-form-item label="联系方式：" path="phone">
              {{ form.phone }}
            </n-form-item>
            <n-form-item label="签约金额（元）：" path="signMoney">
              {{ form.signMoney }}
            </n-form-item>
            <n-form-item label="税金（元）：" path="taxes">
              {{ form.taxes }}
            </n-form-item>
            <n-form-item label="开始实施日期：" path="signStartDate">
              {{ form.signStartDate }}
            </n-form-item>
            <n-form-item label="毛利润率（%）：" path="profitRate">
              {{ form.profitRate }}%
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="合同编码：" path="contractCode">
              {{ form.contractCode }}
            </n-form-item>
            <n-form-item label="签约日期：" path="signDate">
              {{ form.signDate }}
            </n-form-item>
            <n-form-item label="成本总计（元）：" path="cost">
              {{ cost }}
            </n-form-item>
            <n-form-item label="毛利润（元）：" path="profit">
              {{ form.profit }}
            </n-form-item>
            <n-form-item label="开始验收日期：" path="signEndDate">
              {{ form.signEndDate }}
            </n-form-item>
          </div>
        </div>
        <div v-if="form.costs.length > 0" class="title text-align-left flex ai-center">费用明细</div>
        <div v-if="form.costs.length > 0" class="flex jc-between">
          <div class="flex-1">
            <n-form-item v-for="(item, index) in form.costs" :key="index" :label="item.name + ':'">
              <div>{{ item.money }}</div>
            </n-form-item>
          </div>
          <div class="flex-1">
          </div>
        </div>
      </n-form>
    </slot>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useMessage } from 'naive-ui'
import { useRoute } from "vue-router";
import { getDictList, getProjectDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const cost = computed(() => {
  let total = 0;
  form.value.costs.map((item: any) => {
    total += Number(item.money)
  })
  return total
});
const emits = defineEmits(['close'])

const costKey = ref(Date.now());
const form = ref({
  id: props.id,
  projectName: '',
  projectAcceptUser: '',
  acceptUserPhone: '',
  currStage: null,
  deptName: '',
  speciality: '',
  productArea: null,
  projectLevel: null,
  customName: '',
  channel: null,
  salesperson: '',
  remark: '',
  reserDate: null,
  reserSignMoney: null,
  status: '1',
  records: [{
    projectRecord: ''
  }],
  projectCode: '',
  phone: '',
  signMoney: null,
  taxes: null,
  signStartDate: null,
  profitRate: null,
  contractCode: '',
  signDate: null,
  cost: null,
  profit: null,
  signEndDate: null,
  costs: []
});
const curr_stage_opts = ref([]);
const product_area_opts = ref([]);
const project_level_opts = ref([]);
const project_channel_opts = ref([]);
const getOpts = async () => {
  const resProductArea: any = await getDictList({
    dictType: 'sys_product_area'
  });
  product_area_opts.value = resProductArea.data

  const resCurrStage: any = await getDictList({
    dictType: 'sys_curr_stage'
  });
  curr_stage_opts.value = resCurrStage.data

  const resProjectLevel: any = await getDictList({
    dictType: 'sys_project_level'
  });
  project_level_opts.value = resProjectLevel.data

  const resProjectChannel: any = await getDictList({
    dictType: 'sys_project_channel'
  });
  project_channel_opts.value = resProjectChannel.data
}
const filterProductArea = (value: String) => {
  const current: Array<any> = product_area_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterCurrStage = (value: String) => {
  const current: Array<any> = curr_stage_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterProjectLevel = (value: String) => {
  const current: Array<any> = project_level_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterProjectChannel = (value: String) => {
  const current: Array<any> = project_channel_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const getDetail = () => {
  getProjectDetail({
    id: props.id
  }).then((res: any) => {
    form.value.projectName = res.data.projectName
    form.value.projectAcceptUser = res.data.projectAcceptUser
    form.value.acceptUserPhone = res.data.acceptUserPhone
    form.value.currStage = res.data.currStage
    form.value.deptName = res.data.deptName
    form.value.speciality = res.data.speciality
    form.value.productArea = res.data.productArea
    form.value.projectLevel = res.data.projectLevel
    form.value.customName = res.data.customName
    form.value.channel = res.data.channel
    form.value.salesperson = res.data.salesperson
    form.value.status = res.data.status
    form.value.reserDate = res.data.reserDate
    form.value.reserSignMoney = res.data.reserSignMoney
    form.value.records = res.data.records
    form.value.remark = res.data.remark
    form.value.projectCode = res.data.projectCode
    form.value.phone = res.data.phone
    form.value.signMoney = res.data.signMoney
    form.value.taxes = res.data.taxes
    form.value.signStartDate = res.data.signStartDate
    form.value.profitRate = res.data.profitRate
    form.value.contractCode = res.data.contractCode
    form.value.signDate = res.data.signDate
    form.value.cost = res.data.cost
    form.value.profit = res.data.profit
    form.value.signEndDate = res.data.signEndDate
    form.value.costs = res.data.costs || []
    costKey.value = Date.now()
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  getOpts();
  if(props.id) {
    getDetail();
  }
})
</script>

<style lang="scss" scoped>
.form {
  padding: 20px;
  max-height: 500px; 
  overflow: auto;
}
.title {
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
}
.n_input {
  width: 300px;
  text-align: left;
}
.n_date {
  width: 300px;
  text-align: left;
}
.textarea {
  width: 300px;
  height: 80px;
  text-align: left;
}
.record {
  margin: 9px 0;
}
.btns {
  margin: 20px 0;
  .btn {
    margin: 0 5px;
  }
}
</style>
