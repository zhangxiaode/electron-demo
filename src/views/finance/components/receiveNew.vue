<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.id ? '编辑收款' : '新增收款'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.id ? '编辑收款' : '新增收款' }}</slot>
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
        <div class="title text-align-left">收款信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="合同名称：" path="contractName">
              <n-input class="n_input" v-model:value="form.contractName" placeholder="请输入合同名称" />
            </n-form-item>
            <n-form-item label="负责人：" path="leader">
              <n-input class="n_input" v-model:value="form.leader" placeholder="请输入负责人" />
            </n-form-item>
            <n-form-item label="联系方式：" path="phone">
              <n-input class="n_input" v-model:value="form.phone" placeholder="请输入11位手机号" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="项目名称：" path="projectName">
              <n-input class="n_input" v-model:value="form.projectName" placeholder="请输入项目名称" />
            </n-form-item>
            <n-form-item label="所属城市：" path="address">
              <n-input class="n_input" v-model:value="form.address" placeholder="请输入所属城市" />
            </n-form-item>
            <n-form-item label="类型：" path="paymentType">
              <n-select class="n_input" v-model:value="form.paymentType" :options="payment_type_opts" label-field="dictLabel" value-field="dictCode" clearable />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="应收总额（元）：" path="ysMoeny">
              <n-input-number type="number" class="n_input" v-model:value="form.ysMoeny" :show-button="false" placeholder="请输入应收总额">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="未收金额（元）：" path="unPayMoeny">
              <n-input-number type="number" class="n_input" v-model:value="form.unPayMoeny" :show-button="false" placeholder="请输入未收金额">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="是否有效：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="收款金额（元）：" path="payMoeny">
              <n-input-number type="number" class="n_input" v-model:value="form.payMoeny" :show-button="false" placeholder="请输入收款金额">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="收款时间：" path="payDate">
              <n-date-picker class="n_date" v-model:formatted-value="form.payDate" value-format="yyyy-MM-dd" type="date" clearable />
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
import { useRoute } from "vue-router";
import { getDictList, addPayment, editPayment, getPaymentDetail } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  id: props.id,
  contractName: '',
  leader: '',
  phone: '',
  projectName: '',
  address: '',
  paymentType: null,
  ysMoeny: null,
  unPayMoeny: null,
  status: '1',
  payMoeny: null,
  payDate: null,
  remark: ''
});
const payment_type_opts = ref([]);
const rules = {
  contractName: {required: true, message: "合同名称不能为空", trigger: ['blur', 'change']},
  leader: {required: true, message: "负责人不能为空", trigger: ['blur', 'change']},
  phone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "手机号格式错误", trigger: ['blur', 'change']},
  paymentType: {required: true, message: "类型不能为空", trigger: ['blur', 'change']},
};
const getOpts = async () => {
  const resPaymentType: any = await getDictList({
    dictType: 'sys_pay_type'
  });
  payment_type_opts.value = resPaymentType.data
}
const getDetail = () => {
  getPaymentDetail({
    id: props.id
  }).then((res: any) => {
    form.value.contractName = res.data.contractName
    form.value.leader = res.data.leader
    form.value.phone = res.data.phone
    form.value.projectName = res.data.projectName
    form.value.address = res.data.address
    form.value.paymentType = res.data.paymentType
    form.value.ysMoeny = res.data.ysMoeny
    form.value.unPayMoeny = res.data.unPayMoeny
    form.value.status = res.data.status
    form.value.payMoeny = res.data.payMoeny
    form.value.payDate = res.data.payDate
    form.value.remark = res.data.remark
  })
}
const onSubmit = async () => {
  let f = addPayment
  let params: any = {
    contractName: form.value.contractName,
    leader: form.value.leader,
    phone: form.value.phone,
    projectName: form.value.projectName,
    address: form.value.address,
    paymentType: form.value.paymentType,
    ysMoeny: form.value.ysMoeny,
    unPayMoeny: form.value.unPayMoeny,
    status: form.value.status,
    payMoeny: form.value.payMoeny,
    payDate: form.value.payDate,
    remark: form.value.remark
  }
  if(props.id) {
    f = editPayment
    params['id'] = props.id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('收款记录已更新')
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
