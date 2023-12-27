<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="字典名称：" path="dictName">
        <n-input v-model:value="searchForm.dictName" placeholder="请输入字典名称"/>
      </n-form-item>
      <n-form-item label="字典类型：" path="dictType">
        <n-input v-model:value="searchForm.dictType" placeholder="请选择字典类型"/>
      </n-form-item>
      <n-form-item label="状态：" path="status">
        <n-select v-model:value="searchForm.status" max-tag-count="responsive" :options="status_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:dict:export'">
        <n-button type="primary" @click="onExport">导出</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onRefresh">刷新缓存</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:dict:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:dict:remove'">
        <n-button type="primary" @click="onDelete">删除</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :checked-row-keys="checked"
          :row-key="(e: any) => e.dictId"
          :loading="loading"
          :single-line="false"
          :columns="columns"
          :data="tableData"
          :max-height="tableHeight"
          scroll-x
          class="table-wrapper"
          @update:checked-row-keys="handleCheck"
        />
      </div>
      <n-pagination
        class="pager"
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
    <DictTypeNew v-if="showNewDictType" :dictId="dictId" :visable="showNewDictType" @close="handleCloseDictType" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import DictTypeNew from './components/dictTypeNew.vue';
import { downloadFile } from "@/utils/download";
import { getDictTypeList, deleteDictType, refreshDictTypeCache } from "@/apis/index";

let showNewDictType = ref(false);
let dictId = ref(null);
let checked = ref([])

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
  dictName: '',
  dictType: '',
  status: null
});
let status_opts: any = ref([
  {
    label: '正常',
    value: '0'
  },
  {
    label: '停用',
    value: '1'
  }
]);
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '字典名称',
    key: 'dictName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '字典类型',
    key: 'dictType',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return h('div', {
        style: {
          color: row.status === '0' ? '#63e2b7' : '#e88080'
        }
      }, {default: () => row.status === '0' ? '正常' : '停用'})
    }
  },
  {
    title: '备注',
    key: 'remark',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 200,
    align: 'center'
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'system:dict:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'system:dict:remove']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDict(row)
        }, {default: () => '字典项管理'}), [])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCheck = (e: any) => {
  checked.value = e
}
const handleCloseDictType = async () => {
  showNewDictType.value = false
  getList();
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    dictName: '',
    dictType: '',
    status: null
  }
  pageNum.value = 1;
  pageSize.value = 10;
  getList();
};
const onExport = async () => {
  downloadFile('/api/pc/system/dict/type/export', 'GET')
};
const onRefresh = async () => {
  await refreshDictTypeCache()
  getList();
};
const onDelete = () => {
  if (checked.value.length === 0) {
    message.error('选项不能为空')
    return
  }
  dialog.warning({
    title: '批量删除',
    content: `*请确认${checked.value.length}条数据将被删除`,
    positiveText: '删除',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deleteDictType({
          dictIds: checked.value.join(',')
        }).then(() => {
          message.success('删除成功')
          pageNum.value = 1;
          getList();
          checked.value = [];
        }).catch(() => {
          pageNum.value = 1;
          getList();
          checked.value = [];
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
const onDel = (row: any) => {
  dialog.warning({
    title: '确认删除',
    content: `该条数据将被删除`,
    positiveText: '删除',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deleteDictType({
          dictIds: row.dictId
        }).then(() => {
          message.success('删除成功')
          pageNum.value = 1;
          getList();
          checked.value = [];
        }).catch(() => {
          pageNum.value = 1;
          getList();
          checked.value = [];
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
const onDict = (row: any) => {
  router.push(`/system/dict?dictType=${row.dictType}`)
};
const onAdd = () => {
  dictId.value = null
  showNewDictType.value = true
};
const onEdit = (row: any) => {
  dictId.value = row.dictId
  showNewDictType.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getDictTypeList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      dictName: searchForm.value.dictName,
      dictType: searchForm.value.dictType,
      status: searchForm.value.status
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
.w-250 {
  width: 250px;
}
</style>
