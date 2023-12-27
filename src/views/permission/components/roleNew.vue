<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.roleId ? '编辑角色' : '新增角色'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 500px;" 
  >
    <template #header>
      <slot name="header">{{ props.roleId ? '编辑角色' : '新增角色' }}</slot>
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
            <n-form-item label="角色名称：" path="roleName">
              <n-input class="n_input" v-model:value="form.roleName" placeholder="请输入角色名称" />
            </n-form-item>
            <n-form-item label="角色编码：" path="roleKey">
              <n-input class="n_input" v-model:value="form.roleKey" placeholder="请输入角色编码" />
            </n-form-item>
            <n-form-item label="排序号：" path="roleSort">
              <n-input-number type="number" class="n_input" v-model:value="form.roleSort" :show-button="false" placeholder="请输入排序号"></n-input-number>
            </n-form-item>
            <n-form-item label="状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
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
import { getRoleDetail, addRole, editRole } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'roleId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  roleId: props.roleId,
  roleName: '',
  roleKey: '',
  roleSort: null,
  status: null
});
const opts = ref([]);
const rules = {
  roleName: {required: true, message: "角色名称不能为空", trigger: ['blur', 'change']},
  roleKey: {required: true, message: "角色编码不能为空", trigger: ['blur', 'change']},
  roleSort: {required: true, type: 'number', message: "排序号不能为空", trigger: ['blur', 'change']}
};
const getDetail = async () => {
  const res: any = await getRoleDetail({
    roleId: props.roleId
  })
  form.value.roleName = res.data.roleName
  form.value.roleKey = res.data.roleKey
  form.value.roleSort = res.data.roleSort
  form.value.status = res.data.status
}
const onSubmit = async () => {
  let f = addRole
  let params: any = {
    roleName: form.value.roleName,
    roleKey: form.value.roleKey,
    roleSort: form.value.roleSort,
    status: form.value.status
  }
  if(props.roleId) {
    f = editRole
    params['roleId'] = props.roleId
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('角色已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  if(props.roleId) {
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
