<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.id ? '编辑供应商' : '新增供应商'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.id ? '编辑供应商' : '新增供应商' }}</slot>
    </template>
    <slot>
      <n-form
        class="form"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">供应商信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="供应商名称：" path="supplierName">
              <n-input class="n_input" v-model:value="form.supplierName" placeholder="请输入供应商名称" />
            </n-form-item>
            <n-form-item label="联系人：" path="contacts">
              <n-input class="n_input" v-model:value="form.contacts" placeholder="请输入联系人" />
            </n-form-item>
            <n-form-item label="联系方式：" path="contactPhone">
              <n-input class="n_input" v-model:value="form.contactPhone" placeholder="请输入11位手机号" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="供应商编码：" path="supplierNum">
              <n-input class="n_input" v-model:value="form.supplierNum" placeholder="请输入供应商编码" />
            </n-form-item>
            <n-form-item label="所属城市：" path="address">
              <n-input class="n_input" v-model:value="form.address" placeholder="请输入所属城市" />
            </n-form-item>
            <n-form-item label="类型：" path="supplierType">
              <n-select class="n_input" v-model:value="form.supplierType" label-field="dictLabel" value-field="dictCode" :options="supplier_type_opts" />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="关联项目：" path="projectId">
              <n-select class="n_input" v-model:value="form.projectId" label-field="projectName" value-field="id" :options="project_opts" />
            </n-form-item>
            <n-form-item label="累计应付款（元）：" path="payMoney">
              <n-input-number type="number" class="n_input" v-model:value="form.payMoney" :show-button="false" placeholder="请输入累计应付款（元）">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="累计未付款（元）：" path="payMoneyUndo">
              <n-input-number type="number" class="n_input" v-model:value="form.payMoneyUndo" :show-button="false" placeholder="请输入累计未付款（元）">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="供应商简介：" path="record">
              <n-input class="textarea" type="textarea" v-model:value="form.record" placeholder="请输入供应商简介" :show-count="true" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="关联合同：" path="contractId">
              <n-select class="n_input" v-model:value="form.contractId" label-field="contractName" value-field="id" :options="contract_opts" />
            </n-form-item>
            <n-form-item label="累计已付款（元）：" path="payMoneyDone">
              <n-input-number type="number" class="n_input" v-model:value="form.payMoneyDone" :show-button="false" placeholder="请输入累计已付款（元）">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="启用状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              <n-input class="textarea" type="textarea" v-model:value="form.remark" placeholder="请输入备注" :show-count="true" />
            </n-form-item>
          </div>
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
import { getDictList, getProjectSelect, getContractSelect, addSupplier, editSupplier, getSupplierDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
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
const rules = {
  supplierName: {required: true, message: "供应商名称不能为空", trigger: ['blur', 'change']},
  contacts: {required: true, message: "联系人不能为空", trigger: ['blur', 'change']},
  contactPhone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "手机号格式错误", trigger: ['blur', 'change']},
  supplierType: {required: true, message: "类型不能为空", trigger: ['blur', 'change']}
};
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
const onSubmit = async () => {
  let f = addSupplier
  let params: any = {
    supplierName: form.value.supplierName,
    contacts: form.value.contacts,
    contactPhone: form.value.contactPhone,
    supplierNum: form.value.supplierNum,
    address: form.value.address,
    supplierType: form.value.supplierType,
    projectId: form.value.projectId,
    payMoney: form.value.payMoney,
    payMoneyUndo: form.value.payMoneyUndo,
    record: form.value.record,
    contractId: form.value.contractId,
    payMoneyDone: form.value.payMoneyDone,
    status: form.value.status,
    remark: form.value.remark
  }
  if(props.id) {
    f = editSupplier
    params['id'] = props.id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('供应商已更新')
        emits('close')
      })
    }
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
