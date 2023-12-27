<template>
  <div class="main-pad h-100 flex flex-column jc-between">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="flex-wrap text-align-left"
    >
      <n-form-item label="参数名称：" path="configName">
        <n-input v-model:value="searchForm.configName" placeholder="请输入参数名称"/>
      </n-form-item>
      <n-form-item label="参数类型：" path="configType">
        <n-input v-model:value="searchForm.configType" placeholder="请输入参数类型"/>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onReset">重置</n-button>
      </n-form-item>
      <n-form-item v-permission="'system:config:add'">
        <n-button type="primary" @click="onAdd">新增</n-button>
      </n-form-item>
    </n-form>
    <div class="flex flex-column flex-1 overflow-hidden cont">
      <div class="flex-1 overflow-hidden" ref="tableRef">
        <n-data-table
          size="small"
          :checked-row-keys="checked"
          :row-key="(e: any) => e.configId"
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
    <ParamsNew v-if="showNewParams" :configId="configId" :visable="showNewParams" @close="handleCloseParams" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h, ref, computed, withDirectives, resolveDirective } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSwitch, FormInst, useDialog, useMessage } from 'naive-ui';
import ParamsNew from './components/paramsNew.vue';
import { getConfigList, } from "@/apis/index";

let showNewParams = ref(false);
let configId = ref(null);
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
  configName: '',
  configType: null
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
    title: '参数名称',
    key: 'configName',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '参数类型',
    key: 'configType',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '参数键',
    key: 'configKey',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '参数值',
    key: 'configValue',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '备注',
    key: 'remark',
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
    width: 80,
    align: 'center',
    render(row: any, index: number) {
      return [
        withDirectives(h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row)
        }, {default: () => '编辑'}), [[resolveDirective('permission') as any, 'system:config:edit']])
      ]
    }
  }
]);
let tableData: any = ref([]);
const handleCheck = (e: any) => {
  checked.value = e
}
const handleCloseParams = async () => {
  showNewParams.value = false
  getList();
}
const onSearch = () => {
  pageNum.value = 1;
  getList();
};
const onReset = () => {
  searchForm.value = {
    configName: '',
    configType: null
  }
  pageNum.value = 1;
  pageSize.value = 10;
  getList();
};
const onAdd = () => {
  configId.value = null
  showNewParams.value = true
};
const onEdit = (row: any) => {
  configId.value = row.configId
  showNewParams.value = true
};
const getList = async () => {
  try {
    loading.value = true
    const res = await getConfigList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      configName: searchForm.value.configName,
      configType: searchForm.value.configType
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
