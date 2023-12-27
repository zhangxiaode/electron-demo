<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="重置密码"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 500px;" 
  >
    <template #header>
      <slot name="header">重置密码</slot>
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
            <n-form-item label="用户名：" path="userName">
              <n-input class="n_input" v-model:value="form.userName" disabled placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="新密码：" path="password">
              <n-input class="n_input" type="password" v-model:value="form.password" placeholder="请输入新密码" />
            </n-form-item>
            <n-form-item label="确认密码：" path="passwordConfirm">
              <n-input class="n_input" type="password" v-model:value="form.passwordConfirm" placeholder="请确认密码" />
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
import { getUserDetail, resetUserPwd } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'userId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form = ref({
  userId: props.userId,
  userName: '',
  password: '',
  passwordConfirm: ''
});
const opts = ref([]);
const rules = {
  password: {required: true, message: "新密码不能为空", trigger: ['blur', 'change']},
  passwordConfirm: {required: true, message: "确认密码不能为空", trigger: ['blur', 'change']}
};
const getDetail = async () => {
  const res: any = await getUserDetail({
    userId: props.userId
  })
  form.value.userName = res.data.userName
}
const onSubmit = () => {
  if(form.value.password !== form.value.passwordConfirm) {
    message.error('密码输入不一致，请检查！')
    return
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      resetUserPwd({
        userId: props.userId,
        password: form.value.password,
      }).then(() => {
        message.success('密码已重置')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
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
