<template>
  <div class="pageLeft flex flex-column ai-normal jc-between h-100">
    <transition name="fade">
      <div class="logoTitle flex jc-center ai-center cursor-pointer">
        <div class="logoCont">
          <img src="../assets/logo.png" class="logo" @click="homeUrlFun()" />
          <span v-if="!collapse" class="title">electron-demo</span>
        </div>
      </div>
    </transition>
    <n-menu
      class="flex-1"
      accordion
      :value="route.path"
      :indent="12"
      :collapsed="collapse"
      :collapsed-icon-size="18"
      :collapsed-width="44"
      :default-expanded-keys="[route.matched[0].path]"
      :options="menu"
      :render-icon="renderIcon"
      @update:value="switchPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import { baseStore } from "@/store";
import routes from "@/utils/menu"
import { permissionStore } from "@/store";
const menuPermissionsGetters = computed(() => permissionStore().menuPermissionsGetters);

const menusShow = (item: any) => {
  return (item && item.meta && !item.meta.hidden && item.meta.code && menuPermissionsGetters.value.includes(item.meta.code)) || (item.children && item.children.some((child: any) => menusShow(child)))
}
const getMenu = (path, list: Array<any>) => {
  return list.filter((item: any) => menusShow(item)).map((item: any) => {
    return {
      key: path + item.path,
      label: item.meta.title,
      code: item.meta.code,
      icon: item.meta.icon ? () => item.meta.icon : null,
      activeIcon: item.meta.activeIcon ? () => item.meta.activeIcon : null,
      children: (item.children && item.children.length > 0) ? getMenu(item.path + '/', item.children) : null
    }
  })
}
const menu = getMenu('', routes)
const router = useRouter();
const route = useRoute();
const collapse = computed(() => baseStore().collapse);
function renderIcon (icon: any){
  if(icon && icon.icon) {
    if(route.path.includes(icon.path)) {
      return h('img', { src: new URL(icon.activeIcon(), import.meta.url).href, class: 'menuIcon' })
    } else {
      return h('img', { src: new URL(icon.icon(), import.meta.url).href, class: 'menuIcon' })
    }
  } else {
    return null
  }
}
const switchPage = (e: string) => {
  router.push(e);
}
const homeUrlFun = async () => {
  router.push('');
};
</script>

<style lang="scss" scoped>
.pageLeft {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}
.logoTitle {
  flex-wrap: nowrap;
  height: 44px;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  position: relative;
  .logoCont {
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    overflow: hidden;
    width: auto;
    height: 100%;
  }
  .logo {
    width: 36px;
    height: 36px;
  }
  .title {
    white-space: nowrap;
    color: #0080FF;
    font-size: 16px;
    font-weight: bold;
  }
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 14px;
    top: 15px;
    right: 0;
    background: #18233A;
    opacity: 0.2;
  }
}
:deep(.n-menu) {
  background: #18233A;
  .n-menu-item-content {
    .n-menu-item-content-header {
      color: #fff;
      text-align: left;
    }
    .n-menu-item-content__icon {
      color: #fff;
    }
    .n-menu-item-content__arrow {
      color: #fff;
    }
    &.n-menu-item-content--child-active, &.n-menu-item-content--child-active:hover {
      .n-menu-item-content-header {
        color: #fff;
      }
      .n-menu-item-content__icon {
        color: #fff;
      }
      .n-menu-item-content__arrow {
        color: #fff;
      }
    }
    &.n-menu-item-content--selected, &.n-menu-item-content--selected:hover {
      &::before{
        background: #0080FF;
      }
      .n-menu-item-content-header {
        color: #fff;
      }
      .n-menu-item-content__icon {
        color: #fff;
      }
      .n-menu-item-content__arrow {
        color: #fff;
      }
    }
    &:hover {
      &::before {
        background: #0080FF;
      }
      .n-menu-item-content-header {
        color: #fff;
      }
      .n-menu-item-content__icon {
        color: #fff;
      }
      .n-menu-item-content__arrow {
        color: #fff;
      }
    }
  }
  .n-menu-item-content:not(.n-menu-item-content--disabled).n-menu-item-content--hover::before {
    background: #0080FF;
  }
  .menuIcon {
    width: 16px;
    height: 16px;
  }
  .n-submenu-children {
    .n-menu-item-content {
      .n-menu-item-content-header {
        padding-left: 16px;
      }
    }
  }
}
</style>
