<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.id ? '编辑项目' : '新增项目'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.id ? '编辑项目' : '新增项目' }}</slot>
    </template>
    <slot>
      <n-form
        :key="costKey"
        class="form"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">项目信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="项目名称：" path="projectName">
              <n-input class="n_input" v-model:value="form.projectName" placeholder="请输入项目名称" />
            </n-form-item>
            <n-form-item label="项目对接人：" path="projectAcceptUser">
              <n-input class="n_input" v-model:value="form.projectAcceptUser" placeholder="请输入项目对接人" />
            </n-form-item>
            <n-form-item label="对接人电话：" path="acceptUserPhone">
              <n-input class="n_input" v-model:value="form.acceptUserPhone" placeholder="请输入11位手机号" />
            </n-form-item>
            <n-form-item label="项目阶段：" path="currStage">
              <n-select class="n_input" v-model:value="form.currStage" label-field="dictLabel" value-field="dictCode" :options="curr_stage_opts" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="学院/部门：" path="deptName">
              <n-input class="n_input" v-model:value="form.deptName" placeholder="请输入学院/部门" />
            </n-form-item>
            <n-form-item label="专业：" path="speciality">
              <n-input class="n_input" v-model:value="form.speciality" placeholder="请输入专业" />
            </n-form-item>
            <n-form-item label="产品领域：" path="productArea">
              <n-select class="n_input" v-model:value="form.productArea" label-field="dictLabel" value-field="dictCode" :options="product_area_opts" />
            </n-form-item>
            <n-form-item label="项目等级：" path="projectLevel">
              <n-select class="n_input" v-model:value="form.projectLevel" label-field="dictLabel" value-field="dictCode" :options="project_level_opts" />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">基本信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="客户名称：" path="customName">
              <n-input class="n_input" v-model:value="form.customName" placeholder="请输入客户名称" />
            </n-form-item>
            <n-form-item label="销售渠道：" path="channel">
              <n-select class="n_input" v-model:value="form.channel" label-field="dictLabel" value-field="dictCode" :options="project_channel_opts" />
            </n-form-item>
            <n-form-item label="销售员：" path="salesperson">
              <n-input class="n_input" v-model:value="form.salesperson" placeholder="请输入销售员" />
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              <n-input class="textarea" type="textarea" v-model:value="form.remark" placeholder="请输入备注" :show-count="true" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="预计签约时间：" path="reserDate">
              <n-date-picker class="n_date" v-model:formatted-value="form.reserDate" value-format="yyyy-MM-dd" type="date" clearable />
            </n-form-item>
            <n-form-item label="预计签约金额：" path="reserSignMoney">
              <n-input-number type="number" class="n_input" v-model:value="form.reserSignMoney" :show-button="false" placeholder="请输入预计签约金额">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="启用状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
            <n-form-item label="推进记录：" path="records">
              <div class="flex jc-between">
                <div class="flex-1 flex flex-column flex-between ai-center">
                  <n-input v-for="(item, index) in form.records" :key="index" class="record" type="textarea" v-model:value="item.projectRecord" placeholder="请输入推进记录" :show-count="true" />
                </div>
                <n-icon class="addCircleSharp" :size="32" @click="onAddRecord()">
                  <AddCircleSharp />
                </n-icon>
              </div>
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">项目成本:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="项目编码：" path="projectCode">
              <n-input class="n_input" v-model:value="form.projectCode" placeholder="请输入项目编码" />
            </n-form-item>
            <n-form-item label="联系方式：" path="phone">
              <n-input class="n_input" v-model:value="form.phone" placeholder="请输入11位手机号" />
            </n-form-item>
            <n-form-item label="签约金额（元）：" path="signMoney">
              <n-input-number type="number" class="n_input" v-model:value="form.signMoney" :show-button="false" placeholder="请输入签约金额">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="税金（元）：" path="taxes">
              <n-input-number type="number" class="n_input" v-model:value="form.taxes" :show-button="false" placeholder="请输入税金">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="开始实施日期：" path="signStartDate">
              <n-date-picker class="n_date" v-model:formatted-value="form.signStartDate" value-format="yyyy-MM-dd" type="date" clearable />
            </n-form-item>
            <n-form-item label="毛利润率（%）：" path="profitRate">
              <n-input-number type="number" class="n_input" v-model:value="form.profitRate" :show-button="false" placeholder="请输入毛利润率">
                <template #suffix>%</template>
              </n-input-number>
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="合同编码：" path="contractCode">
              <n-input class="n_input" v-model:value="form.contractCode" placeholder="请输入合同编码" />
            </n-form-item>
            <n-form-item label="签约日期：" path="signDate">
              <n-date-picker class="n_date" v-model:formatted-value="form.signDate" value-format="yyyy-MM-dd" type="date" clearable />
            </n-form-item>
            <n-form-item label="成本总计（元）：">
              {{ cost }}
            </n-form-item>
            <n-form-item label="毛利润（元）：" path="profit">
              <n-input-number type="number" class="n_input" v-model:value="form.profit" :show-button="false" placeholder="请输入毛利润">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="开始验收日期：" path="signEndDate">
              <n-date-picker class="n_date" v-model:formatted-value="form.signEndDate" value-format="yyyy-MM-dd" type="date" clearable />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left flex ai-center">
         费用明细:
          <n-icon class="addCircleSharp" :size="32" @click="onAdd()">
            <AddCircleSharp />
          </n-icon>
        </div>
        <div v-for="(item, index) in form.costs" :key="index" class="flex jc-between">
          <n-form-item label="费用名目：">
            <n-input class="n_input" v-model:value="item.name" placeholder="请输入费用名目" />
          </n-form-item>
          <n-form-item label="费用金额：">
            <n-input-number type="number" class="n_input" v-model:value="item.money" :show-button="false" placeholder="请输入费用金额">
              <template #prefix>¥</template>
            </n-input-number>
          </n-form-item>
          <n-icon class="addCircleSharp" :size="32" @click="onDelete(index)">
            <RemoveCircle />
          </n-icon>
        </div>
      </n-form>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" type="primary" @click="onSubmit()">提交</n-button>
        <n-button class="btn" @click="updateShow()">取消</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { FormInst, FormItemRule, useMessage } from 'naive-ui'
import { AddCircleSharp, RemoveCircle } from '@vicons/ionicons5'
import { useRoute } from "vue-router";
import { getDictList, addProject, editProject, getProjectDetail } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const cost = computed(() => {
  let total = 0;
  form.value.costs.map((item: any) => {
    if (item.money) {
      total += item.money
    }
  })
  return total
});
const emits = defineEmits(['close'])

const costKey = ref(Date.now());
const formRef = ref<FormInst | null>(null)
const form: any = ref({
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
const rules = {
  projectName: {required: true, message: "项目名称不能为空", trigger: ['blur', 'change']},
  projectAcceptUser: {required: true, message: "项目对接人不能为空", trigger: ['blur', 'change']},
  acceptUserPhone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "手机号格式错误", trigger: ['blur', 'change']},
  phone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "手机号格式错误", trigger: ['blur', 'change']},
  currStage: {required: true, message: "项目阶段不能为空", trigger: ['blur', 'change']},
  productArea: {required: true, message: "产品领域不能为空", trigger: ['blur', 'change']},
  projectLevel: {required: true, message: "项目等级不能为空", trigger: ['blur', 'change']},
  customName: {required: true, message: "客户名称不能为空", trigger: ['blur', 'change']}
};
const onAddRecord = () => {
  form.value.records.push({
    projectRecord: ''
  })
}
const onAdd = () => {
  form.value.costs.push({
    name: '',
    money: null
  })
  costKey.value = Date.now()
}
const onDelete = (index) => {
  form.value.costs.splice(index, 1)
  costKey.value = Date.now()
}
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
const onSubmit = async () => {
  let f = addProject
  let params: any = {
    projectName: form.value.projectName,
    projectAcceptUser: form.value.projectAcceptUser,
    acceptUserPhone: form.value.acceptUserPhone,
    currStage: form.value.currStage,
    deptName: form.value.deptName,
    speciality: form.value.speciality,
    productArea: form.value.productArea,
    projectLevel: form.value.projectLevel,
    customName: form.value.customName,
    channel: form.value.channel,
    salesperson: form.value.salesperson,
    status: form.value.status,
    reserDate: form.value.reserDate,
    reserSignMoney: form.value.reserSignMoney,
    records: form.value.records.map((item: any) => ({
      projectId: props.id,
      projectRecord: item.projectRecord
    })),
    remark: form.value.remark,
    projectCode: form.value.projectCode,
    phone: form.value.phone,
    signMoney: form.value.signMoney,
    taxes: form.value.taxes,
    signStartDate: form.value.signStartDate,
    profitRate: form.value.profitRate,
    contractCode: form.value.contractCode,
    signDate: form.value.signDate,
    cost: form.value.cost,
    profit: form.value.profit,
    signEndDate: form.value.signEndDate,
    costs: form.value.costs
  }
  if(props.id) {
    f = editProject
    params['id'] = props.id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('项目已更新')
        emits('close')
      })
    }
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
  margin: 5px 0;
}
.addCircleSharp {
  margin: 4px;
}
.btns {
  margin: 20px 0;
  .btn {
    margin: 0 5px;
  }
}
</style>
