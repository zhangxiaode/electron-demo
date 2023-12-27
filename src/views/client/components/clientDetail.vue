<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="客户详情"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">客户详情</slot>
    </template>
    <slot>
      <n-form
        class="form clinetDetailForm"
        ref="formRef"
        :model="form"
        label-placement="left"
        label-width="180px"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">客户信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="客户名称：" path="customName">
              {{ form.customName }}
            </n-form-item>
            <n-form-item label="所在地：" path="address">
              {{ form.address }}
            </n-form-item>
            <n-form-item label="客户性质：" path="customNature">
              {{ customNatureType(form.customNature) }}
            </n-form-item>
            <n-form-item label="启用状态：" path="status">
              {{ form.status === '0' ? '启用' : '禁用' }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="客户类型：" path="customType">
              {{ filterCustomType(form.customType) }}
            </n-form-item>
            <n-form-item label="学院/部门：" path="deptName">
              {{ form.deptName }}
            </n-form-item>
            <n-form-item label="附件：" path="attachfiles">
              <n-upload
                multiple
                :show-remove-button="false"
                :show-cancel-button="false"
                :show-retry-button="false"
                :show-trigger="false"
                v-model:file-list="form.attachfiles"
                class="flex ai-center"
              />
            </n-form-item>
          </div>
        </div>
        <div class="title flex jc-between ai-center">
          <div class="flex-1">基本信息:</div>
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
                {{ item.secondary }}
              </n-form-item>
              <n-form-item v-if="customTypeLable === '学校'" label="系：" :path="`contacts[${index}].xi`">
                {{ item.xi }}
              </n-form-item>
              <n-form-item v-if="customTypeLable === '学校'" label="专业：" :path="`contacts[${index}].speciality`">
                {{ item.speciality }}
              </n-form-item>
              <n-form-item v-if="customTypeLable === '企业'" label="一级部门：" :path="`contacts[${index}].deptOne`">
                {{ item.deptOne }}
              </n-form-item>
              <n-form-item v-if="customTypeLable === '企业'" label="二级部门：" :path="`contacts[${index}].deptTwo`">
                {{ item.deptTwo }}
              </n-form-item>
              <n-form-item label="联系人：" :path="`contacts[${index}].contact`">
                {{ item.contact }}
              </n-form-item>
              <n-form-item label="联系方式：" :path="`contacts[${index}].contactPhone`">
                {{ item.contactPhone }}
              </n-form-item>
              <n-form-item v-if="customTypeLable === '学校'" label="职务：" :path="`contacts[${index}].duties`">
                {{ item.duties }}
              </n-form-item>
              <n-form-item v-if="customTypeLable === '企业'" label="职称：" :path="`contacts[${index}].title`">
                {{ item.title }}
              </n-form-item>
              <n-form-item label="邮箱：" :path="`contacts[${index}].email`">
                {{ item.email }}
              </n-form-item>
              <n-form-item label="客户需求：" :path="`contacts[${index}].demands`">
                <div>
                  <div v-for="(child, idx) in item.demands" :key="idx" class="demand">{{ child.demand }}</div>
                </div>
              </n-form-item>
            </div>
            <div class="flex-1">
              <n-form-item label="办公室：" :path="`contacts[${index}].office`">
                {{ item.office }}
              </n-form-item>
              <n-form-item label="车辆：" :path="`contacts[${index}].carNo`">
                {{ item.carNo }}
              </n-form-item>
              <n-form-item label="生日：" :path="`contacts[${index}].birthday`">
                {{ item.birthday }}
              </n-form-item>
              <n-form-item label="个人简介：" :path="`contacts[${index}].brief`">
                {{ item.brief }}
              </n-form-item>
              <n-form-item label="首次沟通时间：" :path="`contacts[${index}].exchangeDate`">
                {{ item.exchangeDate }}
              </n-form-item>
              <n-form-item label="合作过的项目：" :path="`contacts[${index}].projectName`">
                {{ item.projectName }}
              </n-form-item>
              <n-form-item label="跟踪情况：" :path="`contacts[${index}].records`">
                <div>
                  <div v-for="(child, idx) in item.records" :key="idx" class="record">{{ child.record }}</div>
                </div>
              </n-form-item>
            </div>
          </div>
        </div>
        <n-empty v-if="form.contacts.filter((item: any) => (query && (item.secondary.includes(query) || item.deptOne.includes(query))) || !query).length === 0" description="无数据" />
      </n-form>
    </slot>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useMessage } from 'naive-ui'
import { staticUrl } from "@/utils/index";
import { getDictList, getCustomDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const query = ref('')
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
const channel_opts = ref([]);
const customTypeLable = computed(() => {
  const list: Array<any> = custom_type_opts.value.filter((item: any) => item.dictCode === form.value.customType)
  return list.length > 0 ? list[0].dictLabel : ''
})
const getOpts = async () => {
  const resType: any = await getDictList({
    dictType: 'sys_custom_type'
  });
  custom_type_opts.value = resType.data

  const resNature: any = await getDictList({
    dictType: 'sys_custom_nature'
  });
  custom_nature_opts.value = resNature.data

  const resChannel: any = await getDictList({
    dictType: 'sys_project_channel'
  });
  channel_opts.value = resChannel.data
}
const filterCustomType = (value: String) => {
  const current: Array<any> = custom_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const customNatureType = (value: String) => {
  const current: Array<any> = custom_nature_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterChannel = (value: String) => {
  const current: Array<any> = channel_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
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
    form.value.contacts = res.data.contacts
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
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  getOpts()
  getDetail();
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
  margin: 9px 0;
}
.record {
  margin: 9px 0;
}
</style>

<style lang="scss">
.clinetDetailForm .n-upload-file-list .n-upload-file .n-upload-file-info .n-upload-file-info__action {
  display: none;
}
</style>