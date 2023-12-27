<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.menuId ? '编辑菜单' : '新增菜单'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.menuId ? '编辑菜单' : '新增菜单' }}</slot>
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
            <n-form-item label="上级菜单：" path="parentId">
              <n-tree-select
                class="n_input"
                key-field="id"
                clearable
                v-model:value="form.parentId"
                :options="opts"
                :disabled="!!props.parentId"
              />
            </n-form-item>
            <n-form-item label="菜单名称：" path="menuName">
              <n-input class="n_input" v-model:value="form.menuName" placeholder="请输入菜单名称" />
            </n-form-item>
            <n-form-item label="菜单类型：" path="menuType">
              <n-select class="n_input" v-model:value="form.menuType" max-tag-count="responsive" :options="menuTypeOpts" />
            </n-form-item>
            <n-form-item label="排序：" path="orderNum">
              <n-input-number type="number" class="n_input" v-model:value="form.orderNum" :show-button="false" placeholder="请输入排序" />
            </n-form-item>
            <n-form-item label="状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
            <!-- <n-form-item label="图标：" path="icon">
              <n-upload
                class="flex ai-center"
                v-model:value="form.icon"
                ref="upload"
                accept="image/*"
                :default-upload="false"
                :show-preview-button="false"
                :show-file-list="true"
                @change="selectFile"
              >
                <img v-if="!!form.icon" :src="'/api' + form.icon" class="w-96 h-96" />
                <n-button v-else text>上传图标</n-button>
              </n-upload>
            </n-form-item> -->
          </div>
          <div class="flex-1">
            <n-form-item label="是否外链：" path="isFrame">
              <n-switch v-model:value="form.isFrame" checked-value="0" unchecked-value="1"  />
            </n-form-item>
            <n-form-item v-if="form.isFrame === '0'" label="外链地址：" path="path">
              <n-input class="n_input" v-model:value="form.path" placeholder="请输入外链地址" />
            </n-form-item>
            <n-form-item label="是否显示：" path="visible">
              <n-switch v-model:value="form.visible" checked-value="0" unchecked-value="1" />
            </n-form-item>
            <n-form-item label="权限字符串：" path="perms">
              <n-input class="n_input" v-model:value="form.perms" placeholder="请输入权限字符串" />
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
import { getTreeselectMenu, getMenuDetail, addMenu, editMenu, uploadFile } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'menuId', 'parentId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const formRef = ref<FormInst | null>(null)
const form: any = ref({
  menuId: props.menuId,
  parentId: null,
  menuName: '',
  menuType: null,
  orderNum: null,
  // icon: null,
  status: null,
  isFrame: null,
  path: '',
  visible: null,
  perms: '',
  remark: ''
});
const opts: any = ref([]);
const menuTypeOpts = ref([
  {
    label: '目录',
    value: 'M'
  },
  {
    label: '菜单',
    value: 'C'
  },
  {
    label: '按钮',
    value: 'F'
  }
]);
const rules = {
  menuName: {required: true, message: "菜单名称不能为空", trigger: ['blur', 'change']},
  orderNum: {required: true, type: 'number', message: "排序不能为空", trigger: ['blur', 'change']},
  perms: {required: true, message: "路由地址不能为空", trigger: ['blur', 'change']}
};
const selectFile = async ({file}: any) => {
  const fd = new FormData()
  fd.append('file', file.file)
  try {
    const {data: { path }} = await uploadFile(fd) as any
    form.value.icon = path
    formRef.value?.validate()
  } catch (e: any) {
    const {msg} = e
    message.error(msg)
  }
}
const getDetail = async () => {
  const res: any = await getMenuDetail({
    menuId: props.menuId
  })
  form.value.parentId = res.data.parentId
  form.value.menuName = res.data.menuName
  form.value.menuType = res.data.menuType
  form.value.orderNum = parseInt(res.data.orderNum)
  form.value.status = res.data.status
  // form.value.icon = res.data.icon
  form.value.isFrame = res.data.isFrame
  form.value.path = res.data.path
  form.value.visible = res.data.visible
  form.value.perms = res.data.perms
  form.value.remark = res.data.remark
}
const getTree = async () => {
  const res: any = await getTreeselectMenu();
  opts.value = res.data
}
const onSubmit = async () => {
  let f = addMenu
  let params: any = {
    parentId: form.value.parentId,
    menuName: form.value.menuName,
    menuType: form.value.menuType,
    orderNum: form.value.orderNum,
    // icon: form.value.icon,
    status: form.value.status,
    isFrame: form.value.isFrame,
    path: form.value.path,
    visible: form.value.visible,
    perms: form.value.perms,
    remark: form.value.remark
  }
  if(props.menuId) {
    f = editMenu
    params['menuId'] = props.menuId
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('菜单已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(async () => {
  if(props.parentId) {
    form.value.parentId = props.parentId
  }
  if(props.menuId) {
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
