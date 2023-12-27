<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="菜单名称：" path="menuName">
        <n-input v-model:value="searchForm.menuName" placeholder="请输入菜单名称"/>
      </n-form-item>
      <n-form-item label="菜单类型：" path="menuType">
        <n-select v-model:value="searchForm.menuType" max-tag-count="responsive" :options="menuTypeOpts" clearable class="w-150" />
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
      <n-form-item v-permission="'system:menu:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <!-- <n-form-item>
        <n-button type="primary" @click="onDelete">删除</n-button>
      </n-form-item> -->
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :checked-row-keys="checked"
          :row-key="(e: any) => e.menuId"
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
    </div>
    <MenuNew v-if="showNewMenu" :menuId="menuId" :parentId="parentId" :visable="showNewMenu" @close="handleCloseMenu" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import MenuNew from './components/menuNew.vue';
import { getMenuList, deleteMenu } from "@/apis/index";

let showNewMenu = ref(false);
let parentId = ref(null);
let menuId = ref(null);
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
  menuName: '',
  status: null
});
const menuTypeOpts = ref([
  {
    label: '目录',
    value: 'M'
  },
  {
    label: '菜单',
    value: 'C'
  },
  {
    label: '按钮',
    value: 'F'
  }
]);
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
let columns = ref([
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '菜单名称',
    key: 'menuName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '排序',
    key: 'orderNum',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '菜单类型',
    key: 'menuType',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return row.menuType === 'M' ? '目录' : row.menuType === 'C' ? '菜单' : row.menuType === 'F' ? '按钮' : '--'
    }
  },
  {
    title: '可见',
    key: 'visible',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return h('div', {
        style: {
          color: row.visible === '0' ? '#63e2b7' : '#e88080'
        }
      }, {default: () => row.visible === '0' ? '显示' : '隐藏'})
    }
  },
  {
    title: '是否外链',
    key: 'isFrame',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return row.isFrame === '0' ? '是' : '否'
    }
  },
  {
    title: '权限字符串',
    key: 'perms',
    minWidth: 180,
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
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'system:menu:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onAddChild(row)
        }, {default: () => '添加子菜单'}), [[resolveDirective('permission') as any, 'system:menu:add']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'system:menu:remove']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCheck = (e: any) => {
  checked.value = e
}
const handleCloseMenu = async () => {
  showNewMenu.value = false
  getList();
}
const onReset = () => {
  searchForm.value = {
    menuName: '',
    menuType: null,
    admin_account_id: null
  }
  getList();
};
const onAddChild = (row: any) => {
  parentId.value = row.menuId
  menuId.value = null
  showNewMenu.value = true
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
        deleteMenu({
          menuIds: checked.value.join(',')
        }).then(() => {
          message.success('删除成功')
          getList();
          checked.value = [];
        }).catch(() => {
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
        deleteMenu({
          menuId: row.menuId
        }).then(() => {
          message.success('删除成功')
          getList();
          checked.value = [];
        }).catch(() => {
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
  parentId.value = null
  menuId.value = null
  showNewMenu.value = true
};
const onEdit = (row: any) => {
  parentId.value = null
  menuId.value = row.menuId
  showNewMenu.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getMenuList({
      menuName: searchForm.value.menuName,
      menuType: searchForm.value.menuType,
      status: searchForm.value.status
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
