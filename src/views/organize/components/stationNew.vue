<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.post_id ? '编辑岗位' : '新增岗位'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.post_id ? '编辑岗位' : '新增岗位' }}</slot>
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
            <n-form-item label="岗位名称：" path="postName">
              <n-input class="n_input" v-model:value="form.postName" placeholder="请输入岗位名称" />
            </n-form-item>
            <n-form-item label="排序：" path="postSort">
              <n-input-number type="number" class="n_input" v-model:value="form.postSort" :show-button="false" placeholder="请输入排序"></n-input-number>
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="岗位编码：" path="postCode">
              <n-input class="n_input" v-model:value="form.postCode" placeholder="请输入岗位编码" />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
          </div>
          <div class="flex-1">
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
import { addPost, editPost, getPostDetail } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'post_id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form: any = ref({
  postId: props.post_id,
  postName: '',
  postSort: null,
  postCode: '',
  status: '1',
  remark: ''
});
const opts = ref([]);
const rules = {
  postName: {required: true, message: "岗位名称不能为空", trigger: ['blur', 'change']},
  postSort: {required: true, type: 'number', message: "排序不能为空", trigger: ['blur', 'change']},
  postCode: {required: true, message: "岗位编码不能为空", trigger: ['blur', 'change']}
};
const getDetail = () => {
  getPostDetail({
    post_id: props.post_id
  }).then((res: any) => {
    form.value.postName = res.data.postName
    form.value.postSort = Number(res.data.postSort)
    form.value.postCode = res.data.postCode
    form.value.status = res.data.status
    form.value.remark = res.data.remark
  })
}
const onSubmit = async () => {
  let f = addPost
  let params: any = {
    postName: form.value.postName,
    postSort: form.value.postSort,
    postCode: form.value.postCode,
    status: form.value.status,
    remark: form.value.remark
  }
  if(props.post_id) {
    f = editPost
    params['postId'] = props.post_id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('岗位已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  if(props.post_id) {
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
