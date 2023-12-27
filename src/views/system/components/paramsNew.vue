<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.configId ? '编辑参数' : '新增参数'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.configId ? '编辑参数' : '新增参数' }}</slot>
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
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="参数名称：" path="configName">
              <n-input class="n_input" v-model:value="form.configName" placeholder="请输入参数名称" />
            </n-form-item>
            <n-form-item label="参数键：" path="configKey">
              <n-input class="n_input" v-model:value="form.configKey" placeholder="请输入参数键" />
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              <n-input class="textarea" type="textarea" v-model:value="form.remark" placeholder="请输入备注" :show-count="true" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="参数类型：" path="configType">
              <n-switch v-model:value="form.configType" checked-value="Y" unchecked-value="否" />
            </n-form-item>
            <n-form-item label="参数值：" path="configValue">
              <n-input class="n_input" v-model:value="form.configValue" placeholder="请输入参数值" />
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
import { FormInst, useMessage } from 'naive-ui'
import { useRoute } from "vue-router";
import { getConfigDetail, addConfig, editConfig } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'configId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  configId: props.configId,
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'N',
  remark: ''
});
const rules = {
  configName: {required: true, message: "参数名称不能为空", trigger: ['blur', 'change']},
  configKey: {required: true, message: "参数键不能为空", trigger: ['blur', 'change']},
  configValue: {required: true, message: "参数值不能为空", trigger: ['blur', 'change']},
  configType: {required: true, message: "参数类型不能为空", trigger: ['blur', 'change']}
};
const getDetail = async () => {
  const res: any = await getConfigDetail({
    configId: props.configId
  })
  form.value.configName = res.data.configName
  form.value.configKey = res.data.configKey
  form.value.configValue = res.data.configValue
  form.value.configType = res.data.configType
  form.value.remark = res.data.remark
}
const onSubmit = async () => {
  let f = addConfig
  let params: any = {
    configName: form.value.configName,
    configKey: form.value.configKey,
    configValue: form.value.configValue,
    configType: form.value.configType,
    remark: form.value.remark
  }
  if(props.configId) {
    f = editConfig
    params['configId'] = props.configId
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('参数已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  if(props.configId) {
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
