<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="客户名称：" path="customName">
        <n-input v-model:value="searchForm.customName" placeholder="请输入客户名称"/>
      </n-form-item>
      <n-form-item label="客户类型：" path="customType">
        <n-select v-model:value="searchForm.customType" max-tag-count="responsive" :options="custom_type_opts" label-field="dictLabel" value-field="dictCode" clearable class="w-150" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'people:people:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'people:people:export'">
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
    <ClientNew v-if="showNewClient" :id="id" :visable="showNewClient" @close="handleCloseClient" />
    <ClientDetail v-if="showDetailClient" :id="id" :visable="showDetailClient" @close="handleCloseClientDetail" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import { downloadFile } from "@/utils/download";
import ClientNew from './components/clientNew.vue';
import ClientDetail from './components/clientDetail.vue';
import { getDictList, getCustomList, deleteCustom, exportCustom, changeCustomStatus } from "@/apis/index";

let showNewClient = ref(false);
let showDetailClient = ref(false);
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
const custom_nature_opts = ref([]);
const custom_type_opts = ref([]);
let searchForm: any = ref({
  customName: '',
  customType: null
});
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '客户名称 ',
    key: 'customName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '客户类型',
    key: 'customType',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return filterCustomType(row.customType)
    }
  },
  {
    title: '客户性质',
    key: 'customNature',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return customNatureType(row.customNature)
    }
  },
  {
    title: '学院',
    key: 'deptName',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '所在地',
    key: 'address',
    minWidth: 120,
    align: 'center'
  },
  // {
  //   title: '销售渠道',
  //   key: 'channelValue',
  //   minWidth: 150,
  //   align: 'center'
  // },
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
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'people:people:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'people:people:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
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
const filterCustomType = (value: String) => {
  const current: Array<any> = custom_type_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const customNatureType = (value: String) => {
  const current: Array<any> = custom_nature_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const handleCloseClient = async () => {
  showNewClient.value = false
  getList();
}
const handleCloseClientDetail = async () => {
  showDetailClient.value = false
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    customName: '',
    customType: null
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
  showNewClient.value = true
};
const onEdit = (row: any) => {
  id.value = row.id
  showNewClient.value = true
};
const onDetail = (row: any) => {
  id.value = row.id
  showDetailClient.value = true
};
const onExport = () => {
  downloadFile('/api/pc/system/custom/export', 'GET')
};
const onReturn = () => {
  router.back()
};
const onDel = (row: any) => {
  dialog.warning({
    title: '提示',
    content: () => h('div', {}, { default: () => '确定要删除此条数据吗?' }),
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deleteCustom({
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
  await changeCustomStatus({
    id: row.id,
    status: row.status
  })
  getList();
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getCustomList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      customName: searchForm.value.customName,
      customType: searchForm.value.customType
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
