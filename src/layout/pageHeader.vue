<template>
  <div class="pageHeader flex jc-between ai-center h-100">
    <n-breadcrumb class="breadcrumb" separator=" > ">
      <n-breadcrumb-item v-for="item in route.matched.filter(item => item.meta.title)" :key="item.meta.code" :clickable="false">{{ item.meta.title }}</n-breadcrumb-item>
    </n-breadcrumb>
    <n-dropdown trigger="hover" :options="[{ label: '退出系统', key: '退出' }]" @select="logout">
      <div class="userInfo cursor-pointer flex ai-center h-100">
        <img v-if="user && user.avatar" :src="'/api' + user.avatar" class="userPhoto" />
        <img v-else src="../assets/photo.png" class="userPhoto" />
        <n-button class="userName" text icon-placement="right">
          <span class="text-topText">{{ user ? user.userName : "游客" }}</span>
          <template #icon>
            <n-icon>
              <CaretDownOutline />
            </n-icon>
          </template>
        </n-button>
      </div>
    </n-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { CaretDownOutline } from '@vicons/ionicons5'
import { removeToken } from "@/utils/auth";
import { userStore, permissionStore } from "@/store";
const messsage = useMessage()

const route = useRoute();
const router = useRouter();
const user = computed(() => userStore().userGetters);
userStore().setUser()

const logout = (key: string) => {
  if(key == '退出') {
    try {
      userStore().loginOut();
      permissionStore().clear();
      router.replace("/login");
    }catch (e: any) {
      const { msg } = e
      messsage.error(msg)
    }
  }
};
</script>

<style lang="scss" scoped>
.pageHeader {
  color: #fff;
}
.collapse {
  height: 44px;
}
.breadcrumb {
  padding: 0 0 0 20px;
}
:deep(.n-breadcrumb) {
  .n-breadcrumb-item .n-breadcrumb-item__link {
    color: #18233A;
    &:hover {
      color: #18233A;
    }
  }
  .n-breadcrumb-item:last-child .n-breadcrumb-item__link {
    color: #18233A;
    &:hover {
      color: #18233A;
    }
  }
  .n-breadcrumb-item .n-breadcrumb-item__separator {
    color: #18233A;
  }
}

.userInfo {
  margin-right: 20px;
}
.userPhoto {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.userName {
  margin-left: 10px;
  margin-right: 6px;
}
.text-topText {
  font-size: 16px;
  color: #2E2E4B;
}
.slideDown {
  transform-origin: center;
  transform: scale(0.6);
  font-size: 12px;
  color: #999999;
}
</style>
