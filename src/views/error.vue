<template>
  <div class="error h-100 flex flex-column jc-center ai-center">
    <div v-if="qs?.redirect_url" class="msg">{{ qs.msg }}</div>
    <n-empty v-else-if="qs?.no_permission" description="暂无权限，请联系管理员开通权限！" />
    <n-empty v-else description="404" />
    <n-button type="info" class="return" @click="handleClick">返回</n-button>
  </div>
</template>

<script lang="ts" setup>
import queryString from "query-string";
import {ref} from "vue";

const queryParams: any = queryString.parse(location.search)
const qs = ref(queryParams)

const handleClick = async () => {
  window.location.assign(qs?.redirect_url ? qs.value.redirect_url : '/home/dashboard')
}

</script>
<style lang="scss" scoped>
.msg {
  font-size: 50px;
}
.return {
  margin-top: 20px;
}
</style>
