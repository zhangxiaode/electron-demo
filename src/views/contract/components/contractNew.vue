<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    :title="props.id ? '编辑合同' : '新增合同'"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 1000px;" 
  >
    <template #header>
      <slot name="header">{{ props.id ? '编辑合同' : '新增合同' }}</slot>
    </template>
    <slot>
      <n-form
        class="form contractNewForm"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <div class="title text-align-left">合同信息:</div>
        <div class="flex jc-between"> 
          <div class="flex-1">
            <n-form-item label="合同名称：" path="contractName">
              <n-input class="n_input" v-model:value="form.contractName" placeholder="请输入合同名称" />
            </n-form-item>
            <n-form-item label="合同编码：" path="contractCode">
              <n-input class="n_input" v-model:value="form.contractCode" placeholder="请输入合同编码" />
            </n-form-item>
            <n-form-item label="负责人：" path="leader">
              <n-input class="n_input" v-model:value="form.leader" placeholder="请输入负责人" />
            </n-form-item>
            <n-form-item label="联系方式：" path="phone">
              <n-input class="n_input" v-model:value="form.phone" placeholder="请输入11位手机号" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="类型：" path="contractType">
              <n-select class="n_input" v-model:value="form.contractType" label-field="dictLabel" value-field="dictCode" :options="contract_type_opts" />
            </n-form-item>
            <n-form-item label="客户名称：" path="customName">
              <n-input class="n_input" v-model:value="form.customName" placeholder="请输入客户名称" />
            </n-form-item>
            <n-form-item label="所属城市：" path="address">
              <n-input class="n_input" v-model:value="form.address" placeholder="请输入所属城市" />
            </n-form-item>
          </div>
        </div>
        <div class="title text-align-left">其他信息:</div>
        <div class="flex jc-between">
          <div class="flex-1">
            <n-form-item label="关联项目：" path="projectId">
              <n-select class="n_input" v-model:value="form.projectId" label-field="projectName" value-field="id" :options="project_opts" />
            </n-form-item>
            <n-form-item label="合同金额（元）：" path="contractMoeny">
              <n-input-number type="number" class="n_input" v-model:value="form.contractMoeny" :show-button="false" placeholder="请输入合同金额">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="院系：" path="deptName">
              <n-input class="n_input" v-model:value="form.deptName" placeholder="请输入院系" />
            </n-form-item>
            <n-form-item label="专业：" path="speciality">
              <n-input class="n_input" v-model:value="form.speciality" placeholder="请输入专业" />
            </n-form-item>
            <n-form-item label="项目对接人：" path="projectAcceptUser">
              <n-input class="n_input" v-model:value="form.projectAcceptUser" placeholder="请输入项目对接人" />
            </n-form-item>
            <n-form-item label="对接人电话：" path="acceptUserPhone">
              <n-input class="n_input" v-model:value="form.acceptUserPhone" placeholder="请输入11位手机号" />
            </n-form-item>
            <n-form-item label="供应商名称：" path="supplierName">
              <n-input class="n_input" v-model:value="form.supplierName" placeholder="请输入供应商名称" />
            </n-form-item>
            <n-form-item label="备注：" path="remark">
              <n-input class="textarea" type="textarea" v-model:value="form.remark" placeholder="请输入备注" :show-count="true" />
            </n-form-item>
          </div>
          <div class="flex-1">
            <n-form-item label="签订日期：" path="signDate">
              <n-date-picker class="n_date" v-model:formatted-value="form.signDate" value-format="yyyy-MM-dd" type="date" clearable />
            </n-form-item>
            <n-form-item label="是否启用：" path="status">
              <n-switch v-model:value="form.status" checked-value="0" unchecked-value="1" />
            </n-form-item>
            <n-form-item label="状态：" path="contractStatus">
              <n-select class="n_input" v-model:value="form.contractStatus" label-field="label" value-field="value" :options="[
                {label: '进行中', value: '0'},
                {label: '已完结', value: '1'}
              ]" />
            </n-form-item>
            <n-form-item label="供应商电话：" path="supplierPhone">
              <n-input class="n_input" v-model:value="form.supplierPhone" placeholder="请输入11位手机号" />
            </n-form-item>
            <n-form-item label="付款金额(元)：" path="fkMoney">
              <n-input-number type="number" class="n_input" v-model:value="form.fkMoney" :show-button="false" placeholder="请输入付款金额（元）">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="付款情况：" path="fkqk">
              <n-input class="n_input" v-model:value="form.fkqk" placeholder="请输入付款情况" />
            </n-form-item>
            <n-form-item label="收款金额(元)：" path="skMoney">
              <n-input-number type="number" class="n_input" v-model:value="form.skMoney" :show-button="false" placeholder="请输入收款金额（元）">
                <template #prefix>¥</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="收款情况：" path="skqk">
              <n-input class="n_input" v-model:value="form.skqk" placeholder="请输入收款情况" />
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
import { useRoute } from "vue-router";
import { getToken } from "@/utils/auth";
import { staticUrl } from "@/utils/index";
import { getDictList, getProjectSelect, addContract, editContract, getContractDetail } from "@/apis";
const route = useRoute()
const message = useMessage()
const props = defineProps(['visable', 'id'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])

const token = ref(getToken())
const formRef = ref<FormInst | null>(null)
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
  deptName: '',
  speciality: '',
  projectAcceptUser: '',
  acceptUserPhone: '',
  supplierName: '',
  remark: '',
  signDate: null,
  status: '1',
  contractStatus: '0',
  supplierPhone: '',
  fkMoney: null,
  fkqk: '',
  skMoney: null,
  skqk: '',
  attachfiles: []
});
const contract_type_opts = ref([]);
const project_opts = ref([]);
const rules = {
  contractName: {required: true, message: "合同名称不能为空", trigger: ['blur', 'change']},
  leader: {required: true, message: "负责人不能为空", trigger: ['blur', 'change']},
  phone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "联系方式格式错误", trigger: ['blur', 'change']},
  // acceptUserPhone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "对接人电话格式错误", trigger: ['blur', 'change']},
  // supplierPhone: {validator: (rule: FormItemRule, value: string) => /^1\d{10}$/.test(value), message: "供应商电话格式错误", trigger: ['blur', 'change']},
  // contractType: {required: true, message: "类型不能为空", trigger: ['blur', 'change']},
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
    dictType: 'sys_contract_type'
  });
  contract_type_opts.value = resType.data

  const resProject: any = await getProjectSelect();
  project_opts.value = resProject.data
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
const onSubmit = async () => {
  let f = addContract
  let params: any = {
    contractName: form.value.contractName,
    contractCode: form.value.contractCode,
    leader: form.value.leader,
    phone: form.value.phone,
    contractType: form.value.contractType,
    customName: form.value.customName,
    address: form.value.address,
    projectId: form.value.projectId,
    contractMoeny: form.value.contractMoeny,
    remark: form.value.remark,
    deptName: form.value.deptName,
    speciality: form.value.speciality,
    projectAcceptUser: form.value.projectAcceptUser,
    acceptUserPhone: form.value.acceptUserPhone,
    supplierName: form.value.supplierName,
    signDate: form.value.signDate,
    status: form.value.status,
    contractStatus: form.value.contractStatus,
    supplierPhone: form.value.supplierPhone,
    fkMoney: form.value.fkMoney,
    fkqk: form.value.fkqk,
    skMoney: form.value.skMoney,
    skqk: form.value.skqk,
    attachfiles: form.value.attachfiles.map((item: any) => ({
      name: JSON.parse(item.thumbnailUrl).name,
      path: JSON.parse(item.thumbnailUrl).path,
      fileSize: JSON.parse(item.thumbnailUrl).fileSize,
      absolutePath: JSON.parse(item.thumbnailUrl).absolutePath,
      chatPath: JSON.parse(item.thumbnailUrl).chatPath,
    }))
  }
  if(props.id) {
    f = editContract
    params['id'] = props.id
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      f(params).then(() => {
        message.success('合同已更新')
        emits('close')
      })
    }
  })
}
const updateShow = () => {
  emits('close')
}
onMounted(() => {
  getOpts();
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
<style lang="scss">
.contractNewForm .n-upload-file-list .n-upload-file .n-upload-file-info .n-upload-file-info__action {
  display: flex;
}
</style>
