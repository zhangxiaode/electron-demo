<template>
  <n-layout has-sider class="layout h-100 flex">
    <n-layout-sider
      class="aside" 
      collapse-mode="width"
      :collapsed-width="44"
      :width="190"
      :collapsed="collapse"
      show-trigger
      @collapse="changeCollapse"
      @expand="changeCollapse">
      <PageAside />
    </n-layout-sider>
    <n-layout class="flex-1 flex ai-normal overflow-hidden">
      <n-layout-header class="header"><PageHeader /></n-layout-header>
      <n-layout-content class="main flex-1">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { baseStore } from "@/store/index";
import PageHeader from "./pageHeader.vue";
import PageAside from "./pageAside.vue";

const collapse = computed(() => baseStore().collapse);
const changeCollapse = () => {
  baseStore().changeCollapse()
};
</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  padding: 0;
  box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.1);
  background: #fff;
}
.aside {
  background: #f2f2f2;
}
.main {
  margin: 0;
  padding: 0;
}
.main-pad {
  box-sizing: border-box;
  padding: 16px 16px 0;
}

:deep(.n-layout) {
  .n-layout-scroll-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
 
</style>
