<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.dept_id ? '编辑部门' : '新增部门'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.dept_id ? '编辑部门' : '新增部门' }}</slot>
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
        <div class="title text-align-left">基本信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="上级部门：" path="parentId">
              <n-tree-select
                clearable
                class="n_input"
                :key-field="props.dept_id ? 'deptId' : 'id'"
                :label-field="props.dept_id ? 'deptName' : 'label'"
                v-model:value="form.parentId"
                :options="opts"
                :disabled="!!props.parent_id"
              />
            </n-form-item>
            <n-form-item label="部门名称：" path="deptName">
              <n-input class="n_input" v-model:value="form.deptName" placeholder="请输入部门名称" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="排序：" path="orderNum">
              <n-input-number type="number" class="n_input" v-model:value="form.orderNum" :show-button="false" placeholder="请输入排序" />
            </n-form-item>
            <n-form-item label="部门编码：" path="deptCode">
              <n-input class="n_input" v-model:value="form.deptCode" placeholder="请输入部门编码" />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
            <n-form-item label="负责人：" path="leader">
              <n-input class="n_input" v-model:value="form.leader" placeholder="请输入负责人" />
            </n-form-item>
            <n-form-item label="电子邮箱：" path="email">
              <n-input class="n_input" v-model:value="form.email" placeholder="请输入电子邮箱" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="办公电话：" path="phone">
              <n-input class="n_input" v-model:value="form.phone" placeholder="请输入11位手机号" />
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
import { addDept, editDept, getDeptDetail, excludeDept, getTreeselectDept } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'dept_id', 'parent_id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form: any= ref({
  deptId: props.dept_id,
  parentId: null,
  deptName: '',
  deptCode: '',
  orderNum: null,
  status: '1',
  leader: '',
  email: '',
  phone: '',
  remark: ''
});
const opts = ref([]);
const rules = {
  deptName: {required: true, message: "部门名称不能为空", trigger: ['blur', 'change']},
  deptCode: {required: true, message: "部门编码不能为空", trigger: ['blur', 'change']},
  orderNum: {required: true, type: 'number', message: "排序不能为空", trigger: ['blur', 'change']},
  email: {validator: (rule: FormItemRule, value: string) => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value), message: "邮箱格式错误", trigger: ['blur', 'change']}
};
const getDetail = async () => {
  const res: any = await getDeptDetail({
    dept_id: props.dept_id
  })
  form.value.parentId = res.data.parentId
  form.value.deptName = res.data.deptName
  form.value.deptCode = res.data.deptCode
  form.value.orderNum = parseInt(res.data.orderNum)
  form.value.status = res.data.status
  form.value.leader = res.data.leader
  form.value.email = res.data.email
  form.value.phone = res.data.phone
  form.value.remark = res.data.remark
}
const getTree = async () => {
  let res: any = null
  if(props.dept_id) {
    res = await excludeDept({ dept_id: props.dept_id })
  } else {
    res = await getTreeselectDept();
  }
  opts.value = res.data
}
const onSubmit = async () => {
  let f = addDept
  let params: any = {
    parentId: form.value.parentId,
    deptName: form.value.deptName,
    deptCode: form.value.deptCode,
    orderNum: form.value.orderNum,
    status: form.value.status,
    leader: form.value.leader,
    email: form.value.email,
    phone: form.value.phone,
    remark: form.value.remark
  }
  if(props.dept_id) {
    f = editDept
    params['deptId'] = props.dept_id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('部门已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(async () => {
  if(props.parent_id) {
    form.value.parentId = props.parent_id
  }
  if(props.dept_id) {
    await getDetail();
  }
  getTree();
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
