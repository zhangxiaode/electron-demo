<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.dictCode ? '编辑字典项' : '新增字典项'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.dictCode ? '编辑字典项' : '新增字典项' }}</slot>
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
            <n-form-item label="字典类型：" path="dictType">
              <n-select class="n_input" v-model:value="form.dictType" disabled label-field="dictName" value-field="dictType" max-tag-count="responsive" :options="dictTypeOpts" />
            </n-form-item>
            <n-form-item label="数据键值：" path="dictValue">
              <n-input class="n_input" v-model:value="form.dictValue" placeholder="请输入数据键值" />
            </n-form-item>
            <n-form-item label="数据标签：" path="dictLabel">
              <n-input class="n_input" v-model:value="form.dictLabel" placeholder="请输入数据标签" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="显示排序：" path="dictSort">
              <n-input-number type="number" class="n_input" v-model:value="form.dictSort" :show-button="false" placeholder="请输入显示排序"></n-input-number>
            </n-form-item>
            <n-form-item label="状态：" path="status">
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
import { FormInst, useMessage } from 'naive-ui'
import { useRoute } from "vue-router";
import { getDictDetail, getDictTypeList, addDict, editDict } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'dictCode'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  dictCode: props.dictCode,
  dictType: route.query.dictType,
  dictValue: '',
  remark: '',
  status: null,
  dictLabel: '',
  dictSort: ''
});
const dictTypeOpts = ref([]);
const rules = {
  dictValue: {required: true, message: "数据键值不能为空", trigger: ['blur', 'change']},
  dictLabel: {required: true, message: "数据标签不能为空", trigger: ['blur', 'change']},
  dictSort: {required: true, type: 'number', message: "显示排序不能为空", trigger: ['blur', 'change']}
};
const getDictTypes = async () => {
  const res: any = await getDictTypeList({});
  dictTypeOpts.value = res.rows
}
const getDetail = async () => {
  const res: any = await getDictDetail({
    dictCode: props.dictCode
  })
  form.value.dictValue = res.data.dictValue
  form.value.status = res.data.status
  form.value.remark = res.data.remark
  form.value.dictLabel = res.data.dictLabel
  form.value.dictSort = res.data.dictSort
}
const onSubmit = async () => {
  let f = addDict
  let params: any = {
    dictType: form.value.dictType,
    dictValue: form.value.dictValue,
    dictLabel: form.value.dictLabel,
    dictSort: form.value.dictSort,
    status: form.value.status,
    remark: form.value.remark
  }
  if(props.dictCode) {
    f = editDict
    params['dictCode'] = props.dictCode
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
  getDictTypes()
  if(props.dictCode) {
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
