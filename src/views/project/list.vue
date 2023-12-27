<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="项目名称：" path="projectName">
        <n-input v-model:value="searchForm.projectName" placeholder="请输入项目名称"/>
      </n-form-item>
      <n-form-item label="产品领域：" path="productArea">
        <n-select v-model:value="searchForm.productArea" max-tag-count="responsive" label-field="dictLabel" value-field="dictCode" :options="product_area_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item label="项目阶段：" path="currStage">
        <n-select v-model:value="searchForm.currStage" max-tag-count="responsive" label-field="dictLabel" value-field="dictCode" :options="curr_stage_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'projectItem:project:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'projectItem:project:export'">
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
    <ProjectNew v-if="showNewProject" :id="id" :visable="showNewProject" @close="handleCloseProject" />
    <ProjectDetail v-if="showDetailProject" :id="id" :visable="showDetailProject" @close="handleCloseProjectDetail" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import { downloadFile } from "@/utils/download";
import ProjectNew from './components/projectNew.vue';
import ProjectDetail from './components/projectDetail.vue';
import { getDictList, getProjectList, deleteProject, exportProject, changeProjectStatus } from "@/apis/index";

let showNewProject = ref(false);
let showDetailProject = ref(false);
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
let product_area_opts: any = ref([]);
let curr_stage_opts: any = ref([]);
let searchForm: any = ref({
  projectName: '',
  productArea: null,
  currStage: null
});
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '项目名称',
    key: 'projectName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '项目对接人',
    key: 'projectAcceptUser',
    minWidth: 140,
    align: 'center'
  },
  {
    title: '客户名称',
    key: 'customName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '产品领域',
    key: 'productArea',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return filterProductArea(row.productArea)
    }
  },
  {
    title: '项目阶段',
    key: 'currStage',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return filterCurrStage(row.currStage)
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
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'projectItem:project:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'projectItem:project:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const getOpts = async () => {
  const resProductArea: any = await getDictList({
    dictType: 'sys_product_area'
  });
  product_area_opts.value = resProductArea.data

  const resCurrStage: any = await getDictList({
    dictType: 'sys_curr_stage'
  });
  curr_stage_opts.value = resCurrStage.data
}
const filterProductArea = (value: String) => {
  const current: Array<any> = product_area_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const filterCurrStage = (value: String) => {
  const current: Array<any> = curr_stage_opts.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    projectName: '',
    productArea: null,
    currStage: null
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
  showNewProject.value = true
};
const onEdit = (row: any) => {
  id.value = row.id
  showNewProject.value = true
};
const onDetail = (row: any) => {
  id.value = row.id
  showDetailProject.value = true
};
const handleCloseProject = async () => {
  showNewProject.value = false
  getList();
}
const handleCloseProjectDetail = async () => {
  showDetailProject.value = false
}
const onReturn = () => {
  router.back()
};
const onExport = () => {
  downloadFile('/api/pc/projectItem/project/export', 'GET')
};
const onDel = (row: any) => {
  dialog.warning({
    title: '提示',
    content: () => h('div', {}, { default: () => '确认删除当前项目？' }),
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "info"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        deleteProject({
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
  await changeProjectStatus({
    id: row.id,
    status: row.status
  })
  getList();
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getProjectList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      projectName: searchForm.value.projectName,
      productArea: searchForm.value.productArea,
      currStage: searchForm.value.currStage
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
