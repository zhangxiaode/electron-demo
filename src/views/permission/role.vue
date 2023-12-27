<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="角色名称" path="roleName">
        <n-input v-model:value="searchForm.roleName" placeholder="请输入角色名称"/>
      </n-form-item>
      <n-form-item label="角色编码：" path="roleKey">
        <n-input v-model:value="searchForm.roleKey" placeholder="请输入角色编码"/>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:role:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:role:remove'">
        <n-button type="primary" @click="onDelete">删除</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :checked-row-keys="checked"
          :row-key="(e: any) => e.roleId"
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
    <RoleNew v-if="showNewRole" :roleId="roleId" :visable="showNewRole" @close="handleCloseRole" />
    <Empower v-if="showEmpower" :roleId="roleId" :visable="showEmpower" @close="handleCloseEmpower" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import RoleNew from './components/roleNew.vue';
import Empower from './components/empower.vue';
import { getRoleList, deleteRole } from "@/apis/index";

let showNewRole = ref(false);
let showEmpower = ref(false);
let roleId = ref('');
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
let admin_account_id_opts: any = ref([]);
let searchForm: any = ref({
  roleName: '',
  roleKey: ''
});
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
    title: '角色名称',
    key: 'roleName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '角色编码',
    key: 'roleKey',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '排序号',
    key: 'roleSort',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
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
    title: '操作',
    key: 'actions',
    width: 200,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEmpower(row)
        }, {default: () => '菜单授权'}), [[resolveDirective('permission') as any, 'system:role:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'system:role:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'system:role:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCheck = (e: any) => {
  checked.value = e
}
const handleCloseRole = async () => {
  showNewRole.value = false
  getList();
}
const handleCloseEmpower = async () => {
  showEmpower.value = false
  getList();
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    roleName: '',
    roleKey: ''
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
        deleteRole({
          roleIds: checked.value.join(',')
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
        deleteRole({
          roleIds: row.roleId
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
const onAdd = () => {
  roleId.value = ''
  showNewRole.value = true
};
const onEdit = (row: any) => {
  roleId.value = row.roleId
  showNewRole.value = true
};
const onEmpower = (row: any) => {
  roleId.value = row.roleId
  showEmpower.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getRoleList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      roleName: searchForm.value.roleName,
      roleKey: searchForm.value.roleKey
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
