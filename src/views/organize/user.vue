<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="用户名：" path="userName">
        <n-input v-model:value="searchForm.userName" placeholder="请输入用户名"/>
      </n-form-item>
      <n-form-item label="手机号：" path="phonenumber">
        <n-input v-model:value="searchForm.phonenumber" placeholder="请输入手机号"/>
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
      <n-form-item v-permission="'system:user:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:user:remove'">
        <n-button type="primary" @click="onDelete">删除</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:user:import'">
        <n-upload
          ref="upload"
          :default-upload="false"
          :show-preview-button="false"
          :show-file-list="false"
          @change="onImport"
        >
          <n-button type="primary">导入</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item v-permission="'system:user:export'">
        <n-button type="primary" @click="onExport">导出</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onDownload">下载模板</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :checked-row-keys="checked"
          :row-key="(e: any) => e.userId"
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
    <UserNew v-if="showNewUser" :userId="userId" :visable="showNewUser" @close="handleCloseUser" />
    <ResetPwd v-if="showResetPwd" :userId="userId" :visable="showResetPwd" @close="handleCloseResetPwd" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import { downloadFile } from "@/utils/download";
import UserNew from './components/userNew.vue';
import ResetPwd from './components/resetPwd.vue';
import { getDictList, getUserList, deleteUser, changeUserStatus, importUser } from "@/apis/index";

let showNewUser = ref(false);
let showResetPwd = ref(false);
let userId = ref(null);
let checked = ref([]);
let userTypes = ref([]);

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
let searchForm: any = ref({
  userName: '',
  phonenumber: '',
  status: null
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
    title: '用户名',
    key: 'userName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '手机号',
    key: 'phonenumber',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '用户状态',
    key: 'status',
    minWidth: 100,
    align: 'center',
    render(row: any) {
      return h(NSwitch, {
        checkedValue: '0',
        uncheckedValue: '1',
        value: row.status,
        disabled: row.isAdmin === 1,
        onUpdateValue: () => handleOpen(row)
      })
    }
  },
  {
    title: '用户类型',
    key: 'userType',
    minWidth: 100,
    align: 'center',
    render(row: any) {
      return filterUserType(row.userType)
    }
  },
  {
    title: '部门',
    key: 'deptName',
    minWidth: 100,
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
    width: 200,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'system:user:edit']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDel(row)
        }, {default: () => '删除'}), [[resolveDirective('permission') as any, 'system:user:remove']]),
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onResetPsd(row)
        }, {default: () => '重置密码'}), [[resolveDirective('permission') as any, 'system:user:resetPwd']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const getUserTypes = async () => {
  const res: any = await getDictList({
    dictType: 'sys_user_type'
  });
  userTypes.value = res.data
}
const filterUserType = (value: String) => {
  const current: Array<any> = userTypes.value.filter((item: any) => item.dictCode === value)
  return current.length > 0 ? current[0].dictLabel : ''
}
const handleCheck = (e: any) => {
  checked.value = e
}
const handleCloseUser = async () => {
  showNewUser.value = false
  getList();
}
const handleCloseResetPwd = async () => {
  showResetPwd.value = false
  getList();
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    userName: '',
    phonenumber: '',
    status: null
  }
  pageNum.value = 1;
  pageSize.value = 10;
  getList();
};
const onResetPsd = (row: any) => {
  userId.value = row.userId
  showResetPwd.value = true
};
const handleOpen = async (row: any) => {
  row.status = row.status === '1' ? '0' : '1';
  await changeUserStatus({
    userId: row.userId,
    status: row.status
  })
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
        deleteUser({
          userIds: checked.value.join(',')
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
        deleteUser({
          userIds: row.userId
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
  userId.value = null
  showNewUser.value = true
};
const onEdit = (row: any) => {
  userId.value = row.userId
  showNewUser.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getUserList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      userName: searchForm.value.userName,
      phonenumber: searchForm.value.phonenumber,
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
const onImport = async ({file}: any) => {
  const fd = new FormData()
  fd.append('file', file.file)
  try {
    const res = await importUser(fd) as any
    getList();
  } catch (e: any) {
    const {msg} = e
    message.error(msg)
  }
}
const onExport = (val: number) => {
  downloadFile('/api/pc/system/user/export', 'GET')
};
const onDownload = (val: number) => {
  downloadFile('/api/pc/system/user/importTemplate', 'GET')
};
onMounted(() => {
  getUserTypes();
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
