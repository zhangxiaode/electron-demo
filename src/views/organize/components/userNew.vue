<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.userId ? '编辑用户' : '新增用户'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.userId ? '编辑用户' : '新增用户' }}</slot>
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
        <div class="title text-align-left">必填信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="用户名：" path="userName">
              <n-input class="n_input" v-model:value="form.userName" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="昵称：" path="nickName">
              <n-input class="n_input" v-model:value="form.nickName" placeholder="请输入昵称" />
            </n-form-item>
            <n-form-item label="所属部门：" path="deptId">
              <n-tree-select
                class="n_input"
                key-field="id"
                v-model:value="form.deptId"
                :options="deptOpts"
              />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="岗位：" path="postIds">
              <n-select class="n_input" v-model:value="form.postIds" label-field="postName" value-field="postId" multiple max-tag-count="responsive" :options="postOpts" />
            </n-form-item>
            <n-form-item label="角色：" path="roleIds">
              <n-select class="n_input" v-model:value="form.roleIds" label-field="roleName" value-field="roleId" multiple max-tag-count="responsive" :options="roleOpts" />
            </n-form-item>
            <n-form-item v-if="!props.userId" label="密码：" path="password">
              <n-input class="n_input" type="password" v-model:value="form.password" placeholder="请输入密码" />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="状态：" path="status">
              <n-select class="n_input" v-model:value="form.status" max-tag-count="responsive" :options="statusOpts" />
            </n-form-item>
            <n-form-item label="手机号：" path="phonenumber">
              <n-input class="n_input" v-model:value="form.phonenumber" placeholder="请输入11位手机号" />
            </n-form-item>
            <n-form-item label="邮箱地址：" path="email">
              <n-input class="n_input" v-model:value="form.email" placeholder="请输入邮箱地址" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="用户类型：" path="userType">
              <n-select class="n_input" v-model:value="form.userType" label-field="dictLabel" value-field="dictCode" max-tag-count="responsive" :options="userTypes" />
            </n-form-item>
            <n-form-item label="性别：" path="sex">
              <n-select class="n_input" v-model:value="form.sex" max-tag-count="responsive" :options="sexOpts" />
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
import { getDictList, getTreeselectDept, getRoleOptionsList, getPostOptionList, getUserDetail, editUser, addUser } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'userId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  userId: props.userId,
  userName: '',
  nickName: '',
  password: '',
  postIds: [],
  roleIds: [],
  deptId: '',
  phonenumber: '',
  email: '',
  userType: null,
  sex: null,
  remark: '',
  status: '0'
});
const postOpts = ref([]);
const roleOpts = ref([]);
const deptOpts = ref([]);
const userTypes = ref([]);
const statusOpts = ref([
  {
    label: '正常',
    value: '0'
  },
  {
    label: '停用',
    value: '1'
  }
]);
const sexOpts = ref([
  {
    label: '男',
    value: '0'
  },
  {
    label: '女',
    value: '1'
  },
  {
    label: '未知',
    value: '2'
  }
]);
const rules = {
  userName: {required: true, message: "用户名不能为空", trigger: ['blur', 'change']},
  nickName: {required: true, message: "昵称不能为空", trigger: ['blur', 'change']},
  password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
  postIds: {required: true, type: 'array', message: "岗位不能为空", trigger: ['blur', 'change']},
  roleIds: {required: true, type: 'array', message: "角色不能为空", trigger: ['blur', 'change']},
  deptId: {required: true, message: "所属部门不能为空", trigger: ['blur', 'change']},
  phonenumber: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "手机号格式错误", trigger: ['blur', 'change']},
  email: {validator: (rule: FormItemRule, value: string) => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value), message: "邮箱格式错误", trigger: ['blur', 'change']}
};
const getPosts = async () => {
  const res: any = await getPostOptionList();
  postOpts.value = res.data
}
const getRoles = async () => {
  const res: any = await getRoleOptionsList();
  roleOpts.value = res.data
}
const getDepts = async () => {
  const res: any = await getTreeselectDept();
  deptOpts.value = res.data
}
const getUserTypes = async () => {
  const res: any = await getDictList({
    dictType: 'sys_user_type'
  });
  userTypes.value = res.data
}
const getDetail = async () => {
  const res: any = await getUserDetail({
    userId: props.userId
  })
  form.value.userName = res.data.userName
  form.value.nickName = res.data.nickName
  form.value.password = res.data.password
  form.value.postIds = res.postIds
  form.value.roleIds = res.roleIds
  form.value.deptId = res.data.deptId
  form.value.phonenumber = res.data.phonenumber
  form.value.email = res.data.email
  form.value.userType = res.data.userType
  form.value.sex = res.data.sex
  form.value.remark = res.data.remark
  form.value.status = res.data.status
}
const onSubmit = async () => {
  let f = addUser
  let params: any = {
    deptId: form.value.deptId,
    userName: form.value.userName,
    nickName: form.value.nickName,
    password: form.value.password,
    phonenumber: form.value.phonenumber,
    email: form.value.email,
    userType: form.value.userType,
    sex: form.value.sex,
    status: form.value.status,
    remark: form.value.remark,
    postIds: form.value.postIds,
    roleIds: form.value.roleIds
  }
  if(props.userId) {
    f = editUser
    params['userId'] = props.userId
    delete params.password
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('账户已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  getUserTypes()
  getPosts()
  getRoles()
  getDepts()
  if(props.userId) {
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
