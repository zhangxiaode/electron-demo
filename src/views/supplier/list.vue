<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="供应商名称：" path="supplierName">
        <n-input v-model:value="searchForm.supplierName" placeholder="请输入供应商名称"/>
      </n-form-item>
      <n-form-item label="联系人：" path="contacts">
        <n-input v-model:value="searchForm.contacts" placeholder="请输入供应商名称"/>
      </n-form-item>
      <n-form-item label="类型：" path="supplierType">
        <n-select v-model:value="searchForm.supplierType" max-tag-count="responsive" label-field="dictLabel" value-field="dictCode" :options="supplier_type_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'supplier:supplier:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'supplier:supplier:export'">
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
    <SupplierNew v-if="showNewSupplier" :id="id" :visable="showNewSupplier" @close="handleCloseSupplier" />
    <SupplierDetail v-if="showDetailSupplier" :id="id" :visable="showDetailSupplier" @close="handleCloseSupplierDetail" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import { downloadFile } from "@/utils/download";
import SupplierNew from './components/supplierNew.vue';
import SupplierDetail from './components/supplierDetail.vue';
import { getDictList, getSupplierList, deleteSupplier, exportSupplier, changeSupplierStatus } from "@/apis/index";

let showNewSupplier = ref(false);
let showDetailSupplier = ref(false);
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
let supplier_type_opts: any = ref([]);
let searchForm: any = ref({
  supplierName: '',
  contacts: '',
  supplierType: null
});
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '供应商名称',
    key: 'supplierName',
    minWidth: 140,
    align: 'center'
  },
  {
    title: '所属城市',
    key: 'address',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '联系人',
    key: 'contacts',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '联系方式',
    key: 'contactPhone',
    width: 200,
    align: 'center'
  },
  {
    title: '类型',
    key: 'supplierType',
    minWidth: 100,
    align: 'center',
    render(row: any) {
      return filterSupplierType(row.supplierType)
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
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'supplier:supplier:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'supplier:supplier:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const getOpts = async () => {
  const resSupplierType: any = await getDictList({
    dictType: 'sys_supplier_type'
  });
  supplier_type_opts.value = resSupplierType.data
}
const filterSupplierType = (value: String) => {
  const current: Array<any> = supplier_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    supplierName: '',
    contacts: '',
    supplierType: null
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
  showNewSupplier.value = true
};
const onEdit = (row: any) => {
  id.value = row.id
  showNewSupplier.value = true
};
const onDetail = (row: any) => {
  id.value = row.id
  showDetailSupplier.value = true
};
const handleCloseSupplier = async () => {
  showNewSupplier.value = false
  getList();
}
const handleCloseSupplierDetail = async () => {
  showDetailSupplier.value = false
}
const onReturn = () => {
  router.back()
};
const onExport = () => {
  downloadFile('/api/pc/supplier/supplier/export', 'GET')
};
const onDel = (row: any) => {
  dialog.warning({
    title: '提示',
    content: () => h('div', {}, { default: () => '确认删除当前供应商？' }),
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deleteSupplier({
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
  await changeSupplierStatus({
    id: row.id,
    status: row.status
  })
  getList();
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getSupplierList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      supplierName: searchForm.value.supplierName,
      contacts: searchForm.value.contacts,
      supplierType: searchForm.value.supplierType
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
  getOpts()
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
