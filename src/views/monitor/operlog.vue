<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="操作模块：" path="title">
        <n-input v-model:value="searchForm.title" placeholder="请输入操作模块"/>
      </n-form-item>
      <n-form-item label="业务类型：" path="businessType">
        <n-select v-model:value="searchForm.businessType" max-tag-count="responsive" :options="business_type_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item label="请求方式：" path="requestMethod">
        <n-input v-model:value="searchForm.requestMethod" placeholder="请输入请求方式"/>
      </n-form-item>
      <n-form-item label="操作类别：" path="operatorType">
        <n-select v-model:value="searchForm.operatorType" max-tag-count="responsive" :options="operator_type_opts" clearable class="w-150" />
      </n-form-item>
      <n-form-item label="操作人员：" path="operName">
        <n-input v-model:value="searchForm.operName" placeholder="请输入操作人员"/>
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
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :row-key="(e: any) => e.operId"
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
    <OperlogDetail v-if="showOperlogDetail" :operId="operId" :detail="detail" :visable="showOperlogDetail" @close="handleCloseOperlog" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import OperlogDetail from './components/operlogDetail.vue';
import { getOperlogList } from "@/apis/index";

let showOperlogDetail = ref(false);
let operId = ref(null);
let detail = ref(null);
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
  title: '',
  businessType: null,
  requestMethod: '',
  operatorType: null,
  operName: '',
  status: null
});
let business_type_opts: any = ref([
  {
    label: '其它',
    value: 0
  },
  {
    label: '新增',
    value: 1
  },
  {
    label: '修改',
    value: 2
  },
  {
    label: '删除',
    value: 3
  },
  {
    label: '授权',
    value: 4
  },
  {
    label: '导出',
    value: 5
  },
  {
    label: '导入',
    value: 6
  },
  {
    label: '强退',
    value: 7
  },
  {
    label: '生成代码',
    value: 8
  },
  {
    label: '清空数据',
    value: 9
  }
]);
let operator_type_opts: any = ref([
  {
    label: '其它',
    value: 0
  },
  {
    label: '后台用户',
    value: 1
  },
  {
    label: '手机端用户',
    value: 2
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
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let columns = ref([
  {
    title: '日志id',
    key: 'operId',
    minWidth: 280,
    align: 'center'
  },
  {
    title: '操作模块',
    key: 'title',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '业务类型',
    key: 'businessType',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return row.businessType === 0 ? '其它' : row.businessType === 1 ? '新增' : row.businessType === 2 ? '修改' : row.businessType === 3 ? '删除' : row.businessType === 4 ? '授权' : row.businessType === 5 ? '导出' : row.businessType === 6 ? '导入' : row.businessType === 7 ? '强退' : row.businessType === 8 ? '生成代码' : row.businessType === 9 ? '清空数据' : '--'
    }
  },
  {
    title: '请求方式',
    key: 'requestMethod',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '操作类别',
    key: 'operatorType',
    minWidth: 120,
    align: 'center',
    render(row: any) {
      return row.operatorType === 0 ? '其它' : row.operatorType === 1 ? '后台用户' : row.operatorType === 2 ? '手机端用户' : '--'
    }
  },
  {
    title: '操作人员',
    key: 'operName',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '请求地址',
    key: 'operUrl',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '操作地点',
    key: 'operLocation',
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
          color: row.status === 0 ? '#63e2b7' : '#e88080'
        }
      }, {default: () => row.status === 0 ? '正常' : '停用'})
    }
  },
  {
    title: '操作日期',
    key: 'operTime',
    width: 200,
    align: 'center'
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onDetail(row)
        }, {default: () => '详情'}), [])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCloseOperlog = async () => {
  showOperlogDetail.value = false
  getList();
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    title: '',
    businessType: null,
    requestMethod: '',
    operatorType: null,
    operName: '',
    status: null
  }
  pageNum.value = 1;
  pageSize.value = 10;
  getList();
};
const onDetail = (row: any) => {
  operId.value = row.operId
  detail.value = row
  showOperlogDetail.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getOperlogList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      title: searchForm.value.title,
      businessType: searchForm.value.businessType,
      requestMethod: searchForm.value.requestMethod,
      operatorType: searchForm.value.operatorType,
      operName: searchForm.value.operName,
      status: searchForm.value.status ? parseInt(searchForm.value.status) : null
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
