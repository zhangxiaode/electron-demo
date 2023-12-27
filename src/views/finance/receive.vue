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
        <n-input v-model:value="searchForm.contractName" placeholder="请输入项目名称"/>
      </n-form-item>
      <n-form-item label="项目名称：" path="projectName">
        <n-input v-model:value="searchForm.projectName" placeholder="请输入项目名称"/>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'financial:sr:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'financial:sr:export'">
        <n-button type="primary" @click="onExport">导出</n-button>
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
    <ReceiveNew v-if="showNewReceive" :id="id" :visable="showNewReceive" @close="handleCloseReceive" />
    <ReceiveDetail v-if="showDetailReceive" :id="id" :visable="showDetailReceive" @close="handleCloseReceiveDetail" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import { downloadFile } from "@/utils/download";
import ReceiveNew from './components/receiveNew.vue';
import ReceiveDetail from './components/receiveDetail.vue';
import { getPaymentList, deletePayment, exportPayment, changePaymentStatus } from "@/apis/index";

let showNewReceive = ref(false);
let showDetailReceive = ref(false);
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
let searchForm: any = ref({
  contractName: '',
  projectName: ''
});
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '合同名称',
    key: 'contractName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '项目名称',
    key: 'projectName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '应收总额',
    key: 'ysMoeny',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '收款金额',
    key: 'payMoeny',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '收款日期',
    key: 'payDate',
    width: 200,
    align: 'center'
  },
  {
    title: '未收金额',
    key: 'unPayMoeny',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '是否有效',
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
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'financial:sr:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'financial:sr:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    contractName: '',
    projectName: ''
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
  showNewReceive.value = true
};
const onEdit = (row: any) => {
  id.value = row.id
  showNewReceive.value = true
};
const onDetail = (row: any) => {
  id.value = row.id
  showDetailReceive.value = true
};
const handleCloseReceive = async () => {
  showNewReceive.value = false
  getList();
}
const handleCloseReceiveDetail = async () => {
  showDetailReceive.value = false
}
const onReturn = () => {
  router.back()
};
const onExport = () => {
  downloadFile('/api/pc/system/payment/export', 'GET')
};
const onDel = (row: any) => {
  dialog.warning({
    title: '提示',
    content: () => h('div', {}, { default: () => '确认删除当前收款记录？' }),
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deletePayment({
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
  await changePaymentStatus({
    id: row.id,
    status: row.status
  })
  getList();
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getPaymentList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      contractName: searchForm.value.contractName,
      projectName: searchForm.value.projectName
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
