<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="字典标签：" path="dictLabel">
        <n-input v-model:value="searchForm.dictLabel" placeholder="请输入字典标签"/>
      </n-form-item>
      <n-form-item label="字典键值：" path="dictValue">
        <n-input v-model:value="searchForm.dictValue" placeholder="请选择字典键值"/>
      </n-form-item>
      <n-form-item label="状态：" path="status">
        <n-select v-model:value="searchForm.status" max-tag-count="responsive" :options="status_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="getList">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onDelete">删除</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :checked-row-keys="checked"
          :row-key="(e: any) => e.dictCode"
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
    <DictNew v-if="showNewDict" :dictCode="dictCode" :visable="showNewDict" @close="handleCloseDict" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives } from "vue";
import { useRoute } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import DictNew from './components/dictNew.vue';
import { getDictDataList, deleteDict } from "@/apis/index";

let showNewDict = ref(false);
let dictCode = ref(null);
let checked = ref([])

const tableRef = ref<FormInst | null>(null)
const tableHeight = computed(() => {
  const dom: any = tableRef.value;
  const clientHeight: number = dom ? dom.clientHeight : 500
  const header = document.getElementsByClassName('n-data-table-base-table-header')[0]
  const headerHeight: number = header ? header.clientHeight + 2 : 42
  return clientHeight - headerHeight
});
const route = useRoute()
const dialog = useDialog()
const message = useMessage()
const searchRef = ref<FormInst | null>(null)
let admin_account_id_opts: any = ref([]);
let searchForm: any = ref({
  dictLabel: '',
  dictValue: '',
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
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let loading = ref(false);
let columns = ref([
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '字典标签',
    key: 'dictLabel',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '字典键值',
    key: 'dictValue',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '字典排序',
    key: 'dictSort',
    minWidth: 120,
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
    width: 140,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), []),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCheck = (e: any) => {
  checked.value = e
}
const handleCloseDict = async () => {
  showNewDict.value = false
  getList();
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    dictLabel: '',
    dictValue: '',
    status: null
  }
  pageNum.value = 1;
  pageSize.value = 10;
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
        deleteDict({
          dictCodes: checked.value.join(',')
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
        deleteDict({
          dictCodes: row.dictCode
        }).then(() => {
          pageNum.value = 1;
          message.success('删除成功')
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
const onAdd = () => {
  dictCode.value = null
  showNewDict.value = true
};
const onEdit = (row: any) => {
  dictCode.value = row.dictCode
  showNewDict.value = true
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
const getList = async () => {
  try {
    loading.value = true
    const res = await getDictDataList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      dictType: route.query.dictType,
      dictLabel: searchForm.value.dictLabel,
      dictValue: searchForm.value.dictValue,
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
