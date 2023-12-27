<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="合同详情"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">合同详情</slot>
    </template>
    <slot>
      <n-form
        class="form contractDetailForm"
        ref="formRef"
        :model="form"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">合同信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="合同名称：" path="contractName">
              {{ form.contractName }}
            </n-form-item>
            <n-form-item label="合同编码：" path="contractCode">
              {{ form.contractCode }}
            </n-form-item>
            <n-form-item label="负责人：" path="leader">
              {{ form.leader }}
            </n-form-item>
            <n-form-item label="联系方式：" path="phone">
              {{ form.phone }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="类型：" path="contractType">
              {{ filterContractType(form.contractType) }}
            </n-form-item>
            <n-form-item label="客户名称：" path="customName">
              {{ form.customName }}
            </n-form-item>
            <n-form-item label="所属城市：" path="address">
              {{ form.address }}
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="关联项目：" path="projectId">
              {{ filterProject(form.projectId) }}
            </n-form-item>
            <n-form-item label="合同金额（元）：" path="contractMoeny">
              {{ form.contractMoeny }}
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              {{ form.remark }}
            </n-form-item>
            <n-form-item label="院系：" path="deptName">
              {{ form.deptName }}
            </n-form-item>
            <n-form-item label="专业：" path="speciality">
              {{ form.speciality }}
            </n-form-item>
            <n-form-item label="项目对接人：" path="projectAcceptUser">
              {{ form.projectAcceptUser }}
            </n-form-item>
            <n-form-item label="对接人电话：" path="acceptUserPhone">
              {{ form.acceptUserPhone }}
            </n-form-item>
            <n-form-item label="供应商名称：" path="supplierName">
              {{ form.supplierName }}
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="签订日期：" path="signDate">
              {{ form.signDate }}
            </n-form-item>
            <n-form-item label="是否启用：" path="status">
              {{ form.status === '0' ? '停用' : '正常' }}
            </n-form-item>
            <n-form-item label="状态：" path="status">
              {{ form.contractStatus === '0' ? '进行中' : form.contractStatus === '1' ? '已完结' : '' }}
            </n-form-item>
            <n-form-item label="供应商电话：" path="supplierPhone">
              {{ form.supplierPhone }}
            </n-form-item>
            <n-form-item label="付款金额(元)：" path="fkMoney">
              {{ form.fkMoney }}
            </n-form-item>
            <n-form-item label="付款情况：" path="fkqk">
              {{ form.fkqk }}
            </n-form-item>
            <n-form-item label="收款金额(元)：" path="skMoney">
              {{ form.skMoney }}
            </n-form-item>
            <n-form-item label="收款情况：" path="skqk">
              {{ form.skqk }}
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
      </n-form>
    </slot>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useMessage, UploadFileInfo } from 'naive-ui'
import { staticUrl } from "@/utils/index";
import { getDictList, getProjectSelect, getContractDetail } from "@/apis";
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const form = ref({
  id: props.id,
  contractName: '',
  contractCode: '',
  leader: '',
  phone: '',
  contractType: null,
  customName: '',
  address: '',
  projectId: null,
  contractMoeny: null,
  remark: '',
  deptName: '',
  speciality: '',
  projectAcceptUser: '',
  acceptUserPhone: '',
  supplierName: '',
  signDate: null,
  status: '1',
  contractStatus: '1',
  supplierPhone: '',
  fkMoney: '',
  fkqk: '',
  skMoney: '',
  skqk: '',
  attachfiles: []
});
const contract_type_opts = ref([]);
const project_opts = ref([]);
const getOpts = async () => {
  const resType: any = await getDictList({
    dictType: 'sys_contract_type'
  });
  contract_type_opts.value = resType.data
  
  const resProject: any = await getProjectSelect();
  project_opts.value = resProject.data
}
const filterContractType = (value: String) => {
  const current: Array<any> = contract_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterProject = (value: String) => {
  const current: Array<any> = project_opts.value.filter((item: any) => item.id === value)
  return current.length > 0 ? current[0].projectName : ''
}
const getDetail = () => {
  getContractDetail({
    id: props.id
  }).then((res: any) => {
    form.value.contractName = res.data.contractName
    form.value.contractCode = res.data.contractCode
    form.value.leader = res.data.leader
    form.value.phone = res.data.phone
    form.value.contractType = res.data.contractType
    form.value.customName = res.data.customName
    form.value.address = res.data.address
    form.value.projectId = res.data.projectId
    form.value.contractMoeny = res.data.contractMoeny
    form.value.remark = res.data.remark
    form.value.deptName = res.data.deptName
    form.value.speciality = res.data.speciality
    form.value.projectAcceptUser = res.data.projectAcceptUser
    form.value.acceptUserPhone = res.data.acceptUserPhone
    form.value.supplierName = res.data.supplierName
    form.value.signDate = res.data.signDate
    form.value.status = res.data.status
    form.value.contractStatus = res.data.contractStatus
    form.value.supplierPhone = res.data.supplierPhone
    form.value.fkMoney = res.data.fkMoney
    form.value.fkqk = res.data.fkqk
    form.value.skMoney = res.data.skMoney
    form.value.skqk = res.data.skqk
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
</style>

<style lang="scss">
.contractDetailForm .n-upload-file-list .n-upload-file .n-upload-file-info .n-upload-file-info__action {
  display: none;
}
</style>
