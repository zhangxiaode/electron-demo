<template>
  <n-modal
    v-model:show="visable"
    preset="dialog"
    title="菜单配置"
    :show-icon="false"
    @update:show="updateShow"
    style="width: 500px;" 
  >
    <template #header>
      <slot name="header">菜单配置</slot>
    </template>
    <slot>
      <n-tree
        class="n-tree"
        block-line
        cascade
        checkable
        key-field="id"
        :data="menus"
        :default-expanded-keys="defaultExpandedKeys"
        :indeterminate-keys="indeterminateKeys"
        :checked-keys="checkedKeys"
        @update:indeterminate-keys="handleIndeterminateKeysChange"
        @update:checked-keys="handleCheckedKeysChange"
      />
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" type="primary" @click="onSubmit()">提交</n-button>
        <n-button class="btn" @click="updateShow()">取消</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { onMounted, computed, h, ref } from "vue";
import { useMessage, TreeOption } from 'naive-ui';
import { getTreeselectMenu, roleMenuTreeselect, editRole } from "@/apis/index";
const props = defineProps(['visable', 'roleId'])
const visable = computed(() => props.visable);
const emits = defineEmits(['close'])
const message = useMessage()

let menus: any = ref([]);
let defaultExpandedKeys: any = ref([]);
let indeterminateKeys = ref<string[]>([]);
let checkedKeys = ref<string[]>([]);
let loading = ref(false);

const handleIndeterminateKeysChange = (keys: string[]) => {
  indeterminateKeys.value = keys
};
const handleCheckedKeysChange = (keys: string[]) => {
  checkedKeys.value = keys
};
const onSubmit = () => {
  editRole({
    roleId: props.roleId,
    menuIds: [...indeterminateKeys.value, ...checkedKeys.value],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    flag: 0,
  }).then(() => {
    message.success('角色菜单已更新')
    emits('close')
  })
};
const getMenus = async () => {
  try {
    loading.value = true
    const res = await getTreeselectMenu() as any
    menus.value = res.data
  } catch (e: any) {
    message.error(e.msg)
  } finally {
    loading.value = false
  }
};
const getRoleMenus = async () => {
  const res = await roleMenuTreeselect({
    roleId: props.roleId
  }) as any
  checkedKeys.value = res.checkedKeys
};

const updateShow = () => {
  emits('close')
}
onMounted(async () => {
  await getMenus();
  getRoleMenus();
})
</script>

<style lang="scss">
.btns {
  margin: 20px 0;
}
</style>
