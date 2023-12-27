<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.id ? '编辑客户' : '新增客户'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.id ? '编辑客户' : '新增客户' }}</slot>
    </template>
    <slot>
      <n-form
        class="form clinetNewForm"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="180px"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">客户信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="客户名称：" path="customName">
              <n-input class="n_input" v-model:value="form.customName" placeholder="请输入客户名称" />
            </n-form-item>
            <n-form-item label="所在地：" path="address">
              <n-input class="n_input" v-model:value="form.address" placeholder="请输入所在地" />
            </n-form-item>
            <n-form-item label="客户性质：" path="customNature">
              <n-select class="n_input" v-model:value="form.customNature" label-field="dictLabel" value-field="dictCode" :options="custom_nature_opts" />
            </n-form-item>
            <n-form-item label="启用状态：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="客户类型：" path="customType">
              <n-select class="n_input" v-model:value="form.customType" label-field="dictLabel" value-field="dictCode" :options="custom_type_opts" />
            </n-form-item>
            <n-form-item label="学院/部门：" path="deptName">
              <n-input class="n_input" v-model:value="form.deptName" placeholder="请输入学院/部门" />
            </n-form-item>
            <n-form-item label="附件：" path="attachfiles">
              <n-upload
                multiple
                ref="upload"
                :headers="{ 'Authorization': token }"
                v-model:file-list="form.attachfiles"
                action="/api/common/fileUpload/upload"
                :default-upload="true"
                :show-file-list="true"
                :show-preview-button="false"
                :show-download-button="false"
                :show-remove-button="true"
                @change="selectFile"
              >
                <n-button icon-placement="left" dashed strong>
                  <template #icon>
                    <n-icon>
                      <CloudUpload />
                    </n-icon>
                  </template>
                  上传附件
                </n-button>
              </n-upload>
            </n-form-item>
          </div>
        </div>
        <div class="title flex jc-between ai-center">
          <div class="flex-1">基本信息:</div>
          <n-button type="primary" @click="onAddContact()">新增联系人</n-button>
        </div>
        <div class="header flex ai-center">
          <n-form-item label=" ">
            <n-input class="n_input" v-model:value="query" placeholder="输入学院/部门检索" @input="handleChangeQuery" />
          </n-form-item>
        </div>
        <div v-for="(item, index) in form.contacts.filter((item: any) => (query && (item.secondary.includes(query) || item.deptOne.includes(query))) || !query)" :key="index" class="contacts">
          <div class="subTitle text-align-left">联系人{{ index + 1 }}信息:</div>
          <div class="flex jc-between">
            <div class="flex-1">
              <n-form-item v-if="customTypeLable === '学校'" label="学院：" :path="`contacts[${index}].secondary`">
                <n-input class="n_input" v-model:value="item.secondary" placeholder="请输入学院" />
              </n-form-item>
              <n-form-item v-if="customTypeLable === '学校'" label="系：" :path="`contacts[${index}].xi`">
                <n-input class="n_input" v-model:value="item.xi" placeholder="请输入系" />
              </n-form-item>
              <n-form-item v-if="customTypeLable === '学校'" label="专业：" :path="`contacts[${index}].speciality`">
                <n-input class="n_input" v-model:value="item.speciality" placeholder="请输入专业" />
              </n-form-item>
              <n-form-item v-if="customTypeLable === '企业'" label="一级部门：" :path="`contacts[${index}].deptOne`">
                <n-input class="n_input" v-model:value="item.deptOne" placeholder="请输入一级部门" />
              </n-form-item>
              <n-form-item v-if="customTypeLable === '企业'" label="二级部门：" :path="`contacts[${index}].deptTwo`">
                <n-input class="n_input" v-model:value="item.deptTwo" placeholder="请输入二级部门" />
              </n-form-item>
              <n-form-item label="联系人：" :path="`contacts[${index}].contact`" :rule="{'required': true, 'message': '联系人不能为空', 'trigger': ['input', 'blur']}">
                <n-input class="n_input" v-model:value="item.contact" placeholder="请输入联系人" />
              </n-form-item>
              <n-form-item label="联系方式：" :path="`contacts[${index}].contactPhone`" :rule="{'validator': (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), 'message': '手机号格式错误', 'trigger': ['blur', 'change']}">
                <n-input class="n_input" v-model:value="item.contactPhone" placeholder="请输入11位手机号" />
              </n-form-item>
              <n-form-item v-if="customTypeLable === '学校'" label="职务：" :path="`contacts[${index}].duties`" :rule="{'required': true, 'message': '职务不能为空', 'trigger': ['input', 'blur']}">
                <n-input class="n_input" v-model:value="item.duties" placeholder="请输入职务" />
              </n-form-item>
              <n-form-item v-if="customTypeLable === '企业'" label="职称：" :path="`contacts[${index}].title`">
                <n-input class="n_input" v-model:value="item.title" placeholder="请输入职称" />
              </n-form-item>
              <n-form-item label="邮箱：" :path="`contacts[${index}].email`">
                <n-input class="n_input" v-model:value="item.email" placeholder="请输入邮箱" />
              </n-form-item>
              <n-form-item label="客户需求：" :path="`contacts[${index}].demands`">
                <div class="flex jc-between">
                  <div class="flex-1 flex flex-column flex-between ai-center">
                    <n-input v-for="(child, idx) in item.demands" :key="idx" class="demand" type="textarea" v-model:value="child.demand" placeholder="请输入客户需求" :show-count="true" />
                  </div>
                  <n-icon class="addCircleSharp" :size="32" @click="onAddDemand(index)">
                    <AddCircleSharp />
                  </n-icon>
                </div>
              </n-form-item>
            </div>
            <div class="flex-1">
              <n-form-item label="办公室：" :path="`contacts[${index}].office`">
                <n-input class="n_input" v-model:value="item.office" placeholder="请输入办公室" />
              </n-form-item>
              <n-form-item label="车辆：" :path="`contacts[${index}].carNo`">
                <n-input class="n_input" v-model:value="item.carNo" placeholder="请输入车辆" />
              </n-form-item>
              <n-form-item label="生日：" :path="`contacts[${index}].birthday`">
                <n-date-picker class="n_date" v-model:formatted-value="item.birthday" value-format="yyyy-MM-dd" type="date" clearable />
              </n-form-item>
              <n-form-item label="个人简介：" :path="`contacts[${index}].brief`">
                <n-input class="n_input" v-model:value="item.brief" placeholder="请输入个人简介" />
              </n-form-item>
              <n-form-item label="首次沟通时间：" :path="`contacts[${index}].exchangeDate`">
                <n-date-picker class="n_date" v-model:formatted-value="item.exchangeDate" value-format="yyyy-MM-dd" type="date" clearable />
              </n-form-item>
              <n-form-item label="合作过的项目：" :path="`contacts[${index}].projectName`">
                <n-input class="textarea" type="textarea" v-model:value="item.projectName" placeholder="请输入合作过的项目" :show-count="true" />
              </n-form-item>
              <n-form-item label="跟踪情况：" :path="`contacts[${index}].records`">
                <div class="flex jc-between">
                  <div class="flex-1 flex flex-column flex-between ai-center">
                    <n-input v-for="(child, idx) in item.records" :key="idx" class="record" type="textarea" v-model:value="child.record" placeholder="请输入跟踪情况" :show-count="true" />
                  </div>
                  <n-icon class="addCircleSharp" :size="32" @click="onAddRecord(index)">
                    <AddCircleSharp />
                  </n-icon>
                </div>
              </n-form-item>
            </div>
          </div>
        </div>
        <n-empty v-if="form.contacts.filter((item: any) => (query && (item.secondary.includes(query) || item.deptOne.includes(query))) || !query).length === 0" description="无数据" />
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
import { FormInst, useMessage, FormItemRule } from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui'
import { AddCircleSharp, CloudUpload } from '@vicons/ionicons5'
import { getToken } from "@/utils/auth";
import { staticUrl } from "@/utils/index";
import { getDictList, addCustom, editCustom, getCustomDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable)
const emits = defineEmits(['close'])

const query = ref('')
const token = ref(getToken())
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: props.id,
  customName: '',
  address: '',
  customNature: null,
  status: null,
  deptName: '',
  customType: null,
  attachfiles: [],
  contacts: [{
    secondary: '',
    xi: '',
    speciality: '',
    deptOne: '',
    deptTwo: '',
    contact: '',
    contactPhone: '',
    duties: '',
    title: '',
    exchangeDate: null,
    demands: [
      {
        demand: ''
      }
    ],
    email: '',
    office: '',
    carNo: '',
    birthday: null,
    brief: '',
    projectName: '',
    records: [
      {
        record: ''
      }
    ]
  }]
});
const custom_nature_opts = ref([]);
const custom_type_opts = ref([]);
const customTypeLable = computed(() => {
  const list: Array<any> = custom_type_opts.value.filter((item:any) => item.dictCode === form.value.customType)
  return list.length > 0 ? list[0].dictLabel : ''
})
const rules = {
  customName: {required: true, message: "客户名称不能为空", trigger: ['blur', 'change']},
  address: {required: true, message: "所在地不能为空", trigger: ['blur', 'change']},
  customNature: {required: true, message: "客户性质不能为空", trigger: ['blur', 'change']},
  customType: {required: true, message: "客户类型不能为空", trigger: ['blur', 'change']}
};
const selectFile = async ({ file, fileList, event }: { file: UploadFileInfo, fileList: UploadFileInfo[], event?: any }) => {
  const chatPath = event?.currentTarget?.response ? JSON.parse(event.currentTarget.response).data.chatPath : null
  if(chatPath) {
    file.url = staticUrl + JSON.parse(event.currentTarget.response).data.chatPath
  }
  file.thumbnailUrl = JSON.stringify({
    name: event?.currentTarget?.response ? JSON.parse(event.currentTarget.response).data.name : null,
    path: event?.currentTarget?.response ? JSON.parse(event.currentTarget.response).data.path : null,
    absolutePath: event?.currentTarget?.response ? JSON.parse(event.currentTarget.response).data.absolutePath : null,
    chatPath: event?.currentTarget?.response ? JSON.parse(event.currentTarget.response).data.chatPath : null,
    fileSize: event?.currentTarget?.response ? JSON.parse(event.currentTarget.response).data.fileSize : null
  })
  return file
}
const getOpts = async () => {
  const resType: any = await getDictList({
    dictType: 'sys_custom_type'
  });
  custom_type_opts.value = resType.data

  const resNature: any = await getDictList({
    dictType: 'sys_custom_nature'
  });
  custom_nature_opts.value = resNature.data
}
const handleChangeQuery = (e) => {
  query.value = e
}
const getDetail = () => {
  getCustomDetail({
    id: props.id
  }).then((res: any) => {
    form.value.customName = res.data.customName
    form.value.address = res.data.address
    form.value.customNature = res.data.customNature
    form.value.status = res.data.status
    form.value.deptName = res.data.deptName
    form.value.customType = res.data.customType
    form.value.attachfiles = res.data.attachfiles.map((item: any) => {
      item.url = staticUrl + item.chatPath
      item.thumbnailUrl = JSON.stringify({
        name: item.name,
        path: item.path,
        fileSize: item.fileSize,
        absolutePath: item.absolutePath,
        chatPath: item.chatPath,
      })
      item['status'] = 'finished'
      return item
    })
    form.value.contacts = res.data.contacts
  })
}
const onAddContact = () => {
  form.value.contacts.push({
    secondary: '',
    xi: '',
    speciality: '',
    deptOne: '',
    deptTwo: '',
    contact: '',
    contactPhone: '',
    duties: '',
    title: '',
    exchangeDate: null,
    demands: [
      {
        demand: ''
      }
    ],
    email: '',
    office: '',
    carNo: '',
    birthday: null,
    brief: '',
    projectName: '',
    records: [
      {
        record: ''
      }
    ]
  })
}
const onAddDemand = (index: number) => {
  form.value.contacts[index].demands.push({
    demand: ''
  })
}
const onAddRecord = (index: number) => {
  form.value.contacts[index].records.push({
    record: ''
  })
}
const onSubmit = async () => {
  let f = addCustom
  let params: any = {
    customName: form.value.customName,
    address: form.value.address,
    customNature: form.value.customNature,
    status: form.value.status,
    deptName: form.value.deptName,
    customType: form.value.customType,
    attachfiles: form.value.attachfiles.map((item: any) => ({
      name: JSON.parse(item.thumbnailUrl).name,
      path: JSON.parse(item.thumbnailUrl).path,
      fileSize: JSON.parse(item.thumbnailUrl).fileSize,
      absolutePath: JSON.parse(item.thumbnailUrl).absolutePath,
      chatPath: JSON.parse(item.thumbnailUrl).chatPath
    })),
    contacts: form.value.contacts
  }
  if(props.id) {
    f = editCustom
    params['id'] = props.id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('客户已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  getOpts()
  if(props.id) {
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
.subTitle {
  padding: 20px;
  font-size: 16px;
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
.demand {
  margin: 5px 0;
}
.record {
  margin: 5px 0;
}
.addCircleSharp {
  margin: 4px;
}
.btns {
  margin: 20px 0;
  .btn {
    margin: 0 5px;
  }
}
.contacts {
  width: 100%;
}
</style>
<style lang="scss">
.clinetNewForm .n-upload-file-list .n-upload-file .n-upload-file-info .n-upload-file-info__action {
  display: flex;
}
</style>
