<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="部门名称：" path="deptName">
        <n-input v-model:value="searchForm.deptName" placeholder="请输入部门名称"/>
      </n-form-item>
      <n-form-item label="部门编码：" path="deptCode">
        <n-input v-model:value="searchForm.deptCode" placeholder="请输入部门编码"/>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="getList">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:dept:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :loading="loading"
          :single-line="false"
          :columns="columns"
          :data="tableData"
          :max-height="tableHeight"
          scroll-x
          class="table-wrapper"
        />
      </div>
    </div>
    <DepartmentNew v-if="showNewDepartment" :dept_id="dept_id" :parent_id="parent_id" :visable="showNewDepartment" @close="handleCloseDepartment" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import DepartmentNew from './components/departmentNew.vue';
import { getDeptList, deleteDept } from "@/apis/index";

let showNewDepartment = ref(false);
let parent_id = ref(null);
let dept_id = ref(null);

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
  deptName: '',
  deptCode: ''
});
let loading = ref(false);
let columns = ref([
  {
    title: '部门名称',
    key: 'deptName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '部门编码',
    key: 'deptCode',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '负责人',
    key: 'leader',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '联系电话',
    key: 'phone',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '邮箱',
    key: 'email',
    width: 200,
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
    title: '排序',
    key: 'orderNum',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '创建日期',
    key: 'createTime',
    width: 200,
    align: 'center'
  },
  {
    title: '操作',
    key: 'actions',
    width: 240,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'system:dept:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onAddChild(row)
        }, {default: () => '添加子部门'}), [[resolveDirective('permission') as any, 'system:dept:add']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'system:dept:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCloseDepartment = async () => {
  showNewDepartment.value = false
  getList();
}
const onReset = () => {
  searchForm.value = {
    deptName: '',
    deptCode: ''
  }
  getList();
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
        deleteDept({
          deptId: row.deptId
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
const onAddChild = (row: any) => {
  parent_id.value = row.deptId
  dept_id.value = null
  showNewDepartment.value = true
};
const onAdd = () => {
  parent_id.value = null
  dept_id.value = null
  showNewDepartment.value = true
};
const onEdit = (row: any) => {
  parent_id.value = null
  dept_id.value = row.deptId
  showNewDepartment.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getDeptList({
      deptName: searchForm.value.deptName,
      deptCode: searchForm.value.deptCode
    }) as any
    tableData.value = res.data
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
