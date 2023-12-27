<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="登录地址：" path="ipaddr">
        <n-input v-model:value="searchForm.ipaddr" placeholder="请输入登录地址"/>
      </n-form-item>
      <n-form-item label="操作系统：" path="os">
        <n-input v-model:value="searchForm.os" placeholder="请输入操作系统"/>
      </n-form-item>
      <n-form-item label="登录状态：" path="status">
        <n-select v-model:value="searchForm.status" max-tag-count="responsive" :options="status_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item label="浏览器：" path="browser">
        <n-input v-model:value="searchForm.browser" placeholder="请输入浏览器"/>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :row-key="(e: any) => e.infoId"
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import { getLogininforList } from "@/apis/index";

let infoId = ref(null);
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
  ipaddr: '',
  os: '',
  status: null,
  browser: ''
});
let status_opts: any = ref([
  {
    label: '成功',
    value: '0'
  },
  {
    label: '失败',
    value: '1'
  }
]);
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '用户账号',
    key: 'userName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '登录地址',
    key: 'ipaddr',
    minWidth: 140,
    align: 'center'
  },
  {
    title: '登录地点',
    key: 'loginLocation',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '浏览器',
    key: 'browser',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '操作系统',
    key: 'os',
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
      }, {default: () => row.status === '0' ? '成功' : '失败'})
    }
  },
  {
    title: '提示信息',
    key: 'msg',
    minWidth: 180,
    align: 'center'
  },
  {
    title: '登录时间',
    key: 'loginTime',
    width: 200,
    align: 'center'
  }
]);
let tableData: any = ref([]);
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    ipaddr: '',
    os: '',
    status: null,
    browser: ''
  }
  pageNum.value = 1;
  pageSize.value = 10;
  getList();
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getLogininforList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      ipaddr: searchForm.value.ipaddr,
      os: searchForm.value.os,
      status: searchForm.value.status,
      browser: searchForm.value.browser
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
