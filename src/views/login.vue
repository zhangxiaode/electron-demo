<template>
  <div class="loginPage">
    <img src="../assets/loginBg.png" alt="" class="bg"/>
    <div class="loginWrapper">
      <n-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="100px"
        label-align="left"
        label-placement="top"
        size="large"
        class="login"
      >
        <n-form-item label="用户名：" path="username">
          <n-input v-model:value="loginForm.username" placeholder="请输入用户名"/>
        </n-form-item>
        <n-form-item label="密码：" path="password">
          <n-input v-model:value="loginForm.password" type="password" placeholder="请输入密码"/>
        </n-form-item>
        <n-form-item label-placement="left" class="btns flex jc-center">
          <n-button type="primary" @click="onSubmit()">登录</n-button>
        </n-form-item>
      </n-form>
      <div class="right">
        <img src="../assets/loginRightBg.png" alt="">
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { FormInst, useMessage } from 'naive-ui';
import { useRoute, useRouter } from "vue-router";
import { userStore, permissionStore } from "@/store";
import { getPublickey, login } from "@/apis/index";
import { setToken } from "@/utils/auth";
import { encrypt } from '@/utils/jsencrypt';
import setPermissions from '@/utils/permissions'
import routes from "@/utils/menu"

const route = useRoute();
const router = useRouter();
const loginRef = ref<FormInst | null>(null);
const loginForm = ref({
  username: "",
  password: ""
});
const message = useMessage()

const loginRules = {
  username: {required: true, message: "用户名不能为空", trigger: ['blur', 'change']},
  password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
};

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
const onSubmit = async () => {
  loginRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        const { publickey } = await getPublickey() as any
        const { token } = await login({
          username: loginForm.value.username,
          password: encrypt(publickey, loginForm.value.password)
        }) as any
        userStore().setUser(token)
        
        await setPermissions()
        const menu = getMenu('', routes)
        const path: any = route.query.redirect ? route.query.redirect : menu[0].children[0].key
        router.push(path);
      } catch (err: any) {
        console.log(err)
        // const {msg} = err
        // message.error(msg)
      }
    } else {
      console.log(errors)
    }
  })
};
onMounted(() => {
  userStore().loginOut();
  permissionStore().clear();
})
</script>

<style lang="scss" scoped>
.loginPage {
  height: 100%;
  position: relative;
  overflow: hidden;

  .bg {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
  }
}

.loginWrapper {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  background: #fff;
  text-align: left;
  width: 980px;
  height: 540px;
  background: #F4F5FF;

  .login {
    width: 480px;
    height: 100%;
    padding: 120px 60px 75px;

    .btns {
      .n-button {
        width: 360px;
      }
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 100%;
    background: #ffffff;
  }
}

</style>
