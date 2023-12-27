<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="操作日志详情"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">操作日志详情</slot>
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
        <div class="title text-align-left">操作信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="日志id：" path="operId">
              {{ form.operId }}
            </n-form-item>
            <n-form-item label="操作模块：" path="title">
              {{ form.title }}
            </n-form-item>
            <n-form-item label="业务类型：" path="businessType">
              {{ form.businessType === 0 ? '其它' : form.businessType === 1 ? '新增' : form.businessType === 2 ? '修改' : form.businessType === 3 ? '删除' : form.businessType === 4 ? '授权' : form.businessType === 5 ? '导出' : form.businessType === 6 ? '导入' : form.businessType === 7 ? '强退' : form.businessType === 8 ? '生成代码' : form.businessType === 9 ? '清空数据' : '--' }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="操作类别：" path="operatorType">
              {{ form.operatorType === 0 ? '其它' : form.operatorType === 1 ? '后台用户' : form.operatorType === 2 ? '手机端用户' : '--' }}
            </n-form-item>
            <n-form-item label="操作人员：" path="operName">
              {{ form.operName }}
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">接口信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="请求地址：" path="operUrl">
              {{ form.operUrl }}
            </n-form-item>
            <n-form-item label="请求方式：" path="requestMethod">
              {{ form.requestMethod }}
            </n-form-item>
            <n-form-item label="请求参数：" path="operParam">
              <div class="mr-20">{{ form.operParam }}</div>
            </n-form-item>
            <n-form-item label="返回参数：" path="jsonResult">
              <div class="mr-20">{{ form.jsonResult }}</div>
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="错误消息：" path="errorMsg">
              {{ form.errorMsg || '--' }}
            </n-form-item>
            <n-form-item label="操作地点：" path="operLocation">
              {{ form.operLocation }}
            </n-form-item>
            <n-form-item label="状态：" path="status">
              {{ form.status === 1 ? '正常' : '停用' }}
            </n-form-item>
            <n-form-item label="操作日期：" path="operTime">
              {{ form.operTime }}
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
import { useRoute } from "vue-router";
import {  } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'operId', 'detail'])
const visable = computed(() => props.visable);
const detail = computed(() => props.detail);
const emits = defineEmits(['close'])

const form = ref({
  operId: props.operId,
  title: '',
  businessType: null,
  operatorType: null,
  operName: '',
  operUrl: '',
  requestMethod: '',
  operParam: '',
  jsonResult: '',
  errorMsg: '',
  operLocation: '',
  status: null,
  operTime: ''
});
const getDetail = async () => {
  // const res: any = await getMenuDetail({
  //   operId: props.operId
  // })
  // form.value.title = res.data.title
  // form.value.businessType = res.data.businessType
  // form.value.operatorType = res.data.operatorType
  // form.value.operName = res.data.operName
  // form.value.operUrl = res.data.operUrl
  // form.value.requestMethod = res.data.requestMethod
  // form.value.operParam = res.data.operParam
  // form.value.jsonResult = res.data.jsonResult
  // form.value.errorMsg = res.data.errorMsg
  // form.value.operLocation = res.data.operLocation
  // form.value.status = res.data.status
  // form.value.operTime = res.data.operTime

  form.value.title = props.detail.title
  form.value.businessType = props.detail.businessType
  form.value.operatorType = props.detail.operatorType
  form.value.operName = props.detail.operName
  form.value.operUrl = props.detail.operUrl
  form.value.requestMethod = props.detail.requestMethod
  form.value.operParam = props.detail.operParam
  form.value.jsonResult = props.detail.jsonResult
  form.value.errorMsg = props.detail.errorMsg
  form.value.operLocation = props.detail.operLocation
  form.value.status = props.detail.status
  form.value.operTime = props.detail.operTime
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  if(props.operId) {
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
.mr-20 {
  margin-right: 20px;
}
</style>
