<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="合同名称：" path="contractName">
        <n-input v-model:value="searchForm.contractName" placeholder="请输入合同名称"/>
      </n-form-item>
      <n-form-item label="联系人：" path="leader">
        <n-input v-model:value="searchForm.leader" placeholder="请输入联系人"/>
      </n-form-item>
      <n-form-item label="合同类型：" path="contractType">
        <n-select v-model:value="searchForm.contractType" max-tag-count="responsive" :options="contract_type_opts" label-field="dictLabel" value-field="dictCode" clearable class="w-150" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'contract:contract:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onRefresh">刷新</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReturn">返回</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :row-key="(e: any) => e.id"
          :loading="loading"
          :single-line="false"
          :columns="columns"
          :data="tableData"
          :max-height="tableHeight"
          scroll-x
          class="table-wrapper"
        />
      </div>
      <n-pagination
        :class="['pager']"
        style="overflow: auto"
        v-model:page="pageNum"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :item-count="total"
        show-size-picker
        @update:page="handleCurrentChange"
        @update:page-size="handleSizeChange"
      />
    </div>
    <ContractNew v-if="showNewContract" :id="id" :visable="showNewContract" @close="handleCloseContract" />
    <ContractDetail v-if="showDetailContract" :id="id" :visable="showDetailContract" @close="handleCloseContractDetail" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import ContractNew from './components/contractNew.vue';
import ContractDetail from './components/contractDetail.vue';
import { getDictList, getContractList, deleteContract, changeContractStatus } from "@/apis/index";

let showNewContract = ref(false);
let showDetailContract = ref(false);
let id = ref(null);
const tableRef = ref<FormInst | null>(null)
const tableHeight = computed(() => {
  const dom: any = tableRef.value;
  const clientHeight: number = dom ? dom.clientHeight : 500
  const header = document.getElementsByClassName('n-data-table-base-table-header')[0]
  const headerHeight: number = header ? header.clientHeight + 2 : 42
  return clientHeight - headerHeight
});
const router = useRouter()
const dialog = useDialog()
const message = useMessage()
const searchRef = ref<FormInst | null>(null)
let contract_type_opts: any = ref([]);
let searchForm: any = ref({
  contractName: '',
  leader: '',
  contractType: null
});
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '合同项目名称',
    key: 'contractName',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '客户名称',
    key: 'customName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '签订日期',
    key: 'signDate',
    width: 200,
    align: 'center'
  },
  {
    title: '类型',
    key: 'contractType',
    minWidth: 100,
    align: 'center',
    render(row: any) {
      return filterContractType(row.contractType)
    }
  },
  {
    title: '启用',
    key: 'status',
    minWidth: 100,
    align: 'center',
    render(row: any) {
      return h(NSwitch, {
        checkedValue: '0',
        uncheckedValue: '1',
        value: row.status,
        onUpdateValue: () => handleOpen(row)
      })
    }
  },
  {
    title: '状态',
    key: 'contractStatus',
    minWidth: 100,
    align: 'center',
    render(row: any) {
      return row.contractStatus === '0' ? '进行中' : row.contractStatus === '1' ? '已完结' : ''
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDetail(row)
        }, {default: () => '查看'}), []),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'contract:contract:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'contract:contract:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const getOpts = async () => {
  const resType: any = await getDictList({
    dictType: 'sys_contract_type'
  });
  contract_type_opts.value = resType.data
}
const filterContractType = (value: String) => {
  const current: Array<any> = contract_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    contractName: '',
    leader: '',
    contractType: null
  }
  pageNum.value = 1;
  pageSize.value = 10;
  getList();
};
const onRefresh = () => {
  getList();
};
const onAdd = () => {
  id.value = null
  showNewContract.value = true
};
const onEdit = (row: any) => {
  id.value = row.id
  showNewContract.value = true
};
const onDetail = (row: any) => {
  id.value = row.id
  showDetailContract.value = true
};
const handleCloseContract = async () => {
  showNewContract.value = false
  getList();
}
const handleCloseContractDetail = async () => {
  showDetailContract.value = false
}
const onReturn = () => {
  router.back()
};
const onDel = (row: any) => {
  dialog.warning({
    title: '提示',
    content: () => h('div', {}, { default: () => '确认删除当前合同？' }),
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deleteContract({
          ids: row.id
        }).then(() => {
          message.success('删除成功')
          getList();
        })
      } catch (e: any) {
        const {msg} = e
        message.error(msg)
      }
    },
    onNegativeClick: () => {
      message.warning('取消删除')
    }
  })
};
const handleOpen = async (row: any) => {
  row.status = row.status === '1' ? '0' : '1';
  await changeContractStatus({
    id: row.id,
    status: row.status
  })
  getList();
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getContractList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      contractName: searchForm.value.contractName,
      leader: searchForm.value.leader,
      contractType: searchForm.value.contractType
    }) as any
    tableData.value = res.rows
    total.value = res.total
  } catch (e: any) {
    message.error(e.msg)
  } finally {
    loading.value = false
  }
};
const handleSizeChange = (val: number) => {
  pageNum.value = 1;
  pageSize.value = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getList();
};
onMounted(() => {
  getOpts();
  getList();
})
</script>

<style lang="scss">
.red {
  color: #f88;
}
.input {
  width: 100px;
}
.w-150 {
  width: 150px;
}
</style>
