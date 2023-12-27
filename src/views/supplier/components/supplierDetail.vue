<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="供应商详情"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">供应商详情</slot>
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
        <div class="title text-align-left">供应商信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="供应商名称：" path="supplierName">
              {{ form.supplierName }}
            </n-form-item>
            <n-form-item label="联系人：" path="contacts">
              {{ form.contacts }}
            </n-form-item>
            <n-form-item label="联系方式：" path="contactPhone">
              {{ form.contactPhone }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="供应商编码：" path="supplierNum">
              {{ form.supplierNum }}
            </n-form-item>
            <n-form-item label="所属城市：" path="address">
              {{ form.address }}
            </n-form-item>
            <n-form-item label="类型：" path="supplierType">
              {{ filterSupplierType(form.supplierType) }}
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="关联项目：" path="projectId">
              {{ filterProject(form.projectId) }}
            </n-form-item>
            <n-form-item label="累计应付款（元）：" path="payMoney">
              ¥{{ form.payMoney }}
            </n-form-item>
            <n-form-item label="累计未付款（元）：" path="payMoneyUndo">
              ¥{{ form.payMoneyUndo }}
            </n-form-item>
            <n-form-item label="供应商简介：" path="record">
              {{ form.record }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="关联合同：" path="contractId">
              {{ filterContract(form.contractId) }}
            </n-form-item>
            <n-form-item label="累计已付款（元）：" path="payMoneyDone">
              ¥{{ form.payMoneyDone }}
            </n-form-item>
            <n-form-item label="启用状态：" path="status">
              {{ form.status === '0' ? '启用' : '禁用' }}
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
import { getDictList, getProjectSelect, getContractSelect, getSupplierDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const form = ref({
  id: props.id,
  supplierName: '',
  contacts: '',
  contactPhone: '',
  supplierNum: '',
  address: '',
  supplierType: null,
  projectId: null,
  payMoney: null,
  payMoneyUndo: null,
  record: '',
  contractId: null,
  payMoneyDone: null,
  status: null,
  remark: ''
});
const supplier_type_opts = ref([]);
const project_opts = ref([]);
const contract_opts = ref([]);
const getOpts = async () => {
  const resSupplierType: any = await getDictList({
    dictType: 'sys_supplier_type'
  });
  supplier_type_opts.value = resSupplierType.data

  const resProject: any = await getProjectSelect();
  project_opts.value = resProject.data

  const resContract: any = await getContractSelect();
  contract_opts.value = resContract.data
}
const filterSupplierType = (value: String) => {
  const current: Array<any> = supplier_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterProject = (value: String) => {
  const current: Array<any> = project_opts.value.filter((item: any) => item.id === value)
  return current.length > 0 ? current[0].projectName : ''
}
const filterContract = (value: String) => {
  const current: Array<any> = contract_opts.value.filter((item: any) => item.id === value)
  return current.length > 0 ? current[0].contractName : ''
}
const getDetail = () => {
  getSupplierDetail({
    id: props.id
  }).then((res: any) => {
    form.value.supplierName = res.data.supplierName
    form.value.contacts = res.data.contacts
    form.value.contactPhone = res.data.contactPhone
    form.value.supplierNum = res.data.supplierNum
    form.value.address = res.data.address
    form.value.supplierType = res.data.supplierType
    form.value.projectId = res.data.projectId
    form.value.payMoney = res.data.payMoney
    form.value.payMoneyUndo = res.data.payMoneyUndo
    form.value.record = res.data.record
    form.value.contractId = res.data.contractId
    form.value.payMoneyDone = res.data.payMoneyDone
    form.value.status = res.data.status
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
.btns {
  margin: 20px 0;
  .btn {
    margin: 0 5px;
  }
}
</style>
