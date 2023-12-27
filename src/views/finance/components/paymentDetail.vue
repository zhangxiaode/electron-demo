<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="付款详情"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">付款详情</slot>
    </template>
    <slot>
      <n-form
        class="form"
        ref="formRef"
        :model="form"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">付款信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="合同名称：" path="contractName">
              {{ form.contractName }}
            </n-form-item>
            <n-form-item label="负责人：" path="leader">
              {{ form.leader }}
            </n-form-item>
            <n-form-item label="联系方式：" path="phone">
              {{ form.phone }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="项目名称：" path="projectName">
              {{ form.projectName }}
            </n-form-item>
            <n-form-item label="所属城市：" path="address">
              {{ form.address }}
            </n-form-item>
            <n-form-item label="类型：" path="paymentType">
              {{ filterPaymentType(form.paymentType) }}
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="应付总额（元）：" path="yfMoeny">
              {{ form.yfMoeny }}
            </n-form-item>
            <n-form-item label="未付金额（元）：" path="unPayMoeny">
              {{ form.unPayMoeny }}
            </n-form-item>
            <n-form-item label="是否有效：" path="status">
              {{ form.status === '0' ? '有效' : '无效' }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="付款金额（元）：" path="payMoeny">
              {{ form.payMoeny }}
            </n-form-item>
            <n-form-item label="付款时间：" path="payDate">
              {{ form.payDate }}
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              {{ form.remark }}
            </n-form-item>
          </div>
        </div>
      </n-form>
    </slot>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useMessage } from 'naive-ui'
import { getDictList, getFkpaymentDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const form = ref({
  id: props.id,
  contractName: '',
  leader: '',
  phone: '',
  projectName: '',
  address: '',
  paymentType: null,
  yfMoeny: null,
  unPayMoeny: null,
  status: '1',
  payMoeny: null,
  payDate: null,
  remark: ''
});
const payment_type_opts = ref([]);
const getOpts = async () => {
  const resPaymentType: any = await getDictList({
    dictType: 'sys_fk_type'
  });
  payment_type_opts.value = resPaymentType.data
}
const filterPaymentType = (value: String) => {
  const current: Array<any> = payment_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const getDetail = () => {
  getFkpaymentDetail({
    id: props.id
  }).then((res: any) => {
    form.value.contractName = res.data.contractName
    form.value.leader = res.data.leader
    form.value.phone = res.data.phone
    form.value.projectName = res.data.projectName
    form.value.address = res.data.address
    form.value.paymentType = res.data.paymentType
    form.value.yfMoeny = res.data.yfMoeny
    form.value.unPayMoeny = res.data.unPayMoeny
    form.value.status = res.data.status
    form.value.payMoeny = res.data.payMoeny
    form.value.payDate = res.data.payDate
    form.value.remark = res.data.remark
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  getOpts()
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
</style>
