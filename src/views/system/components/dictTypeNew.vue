<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.dictId ? '编辑字典类型' : '新增字典类型'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.dictId ? '编辑字典类型' : '新增字典类型' }}</slot>
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
            <n-form-item label="字典名称：" path="dictName">
              <n-input class="n_input" v-model:value="form.dictName" placeholder="请输入字典名称" />
            </n-form-item>
            <n-form-item label="状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="字典类型：" path="dictType">
              <n-input class="n_input" v-model:value="form.dictType" placeholder="请输入字典类型" />
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
import { FormInst, useMessage } from 'naive-ui'
import { addDictType, getDictTypeDetail, editDictType } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'dictId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  dictId: props.dictId,
  dictName: '',
  status: null,
  remark: '',
  dictType: ''
});
const rules = {
  dictName: {required: true, message: "字典名称不能为空", trigger: ['blur', 'change']},
  dictType: {required: true, message: "字典类型不能为空", trigger: ['blur', 'change']}
};
const getDetail = async () => {
  const res: any = await getDictTypeDetail({
    dictId: props.dictId
  })
  form.value.dictName = res.data.dictName
  form.value.status = res.data.status
  form.value.remark = res.data.remark
  form.value.dictType = res.data.dictType
}
const onSubmit = async () => {
  let f = addDictType
  let params: any = {
    dictName: form.value.dictName,
    status: form.value.status,
    remark: form.value.remark,
    dictType: form.value.dictType
  }
  if(props.dictId) {
    f = editDictType
    params['dictId'] = props.dictId
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('字典项已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  if(props.dictId) {
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
