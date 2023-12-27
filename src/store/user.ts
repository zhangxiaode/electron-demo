import { defineStore } from 'pinia'
import { removeToken, setToken } from "@/utils/auth";
import { getLoginInfo } from "@/apis/index";
const userStore = defineStore({
  id: "user",
  state() {
    return {
      user: null
    }
  },
  getters: {
    userGetters: (state) => {
      let user: any = state.user
      const userStorage: any = localStorage.getItem("user")
      if(userStorage) {
        user = JSON.parse(userStorage)
      }
      return user || null
    }
  },
  actions: {
    async setUser(token: String) {
      if(token) {
        setToken(token)
      } 
      const userStorage = localStorage.getItem("user");
      if(!userStorage) {
        const { user } = await getLoginInfo() as any
        localStorage.setItem("user", JSON.stringify(user));
        this.$state.user = user
      }
    },
    loginOut() {
      this.$state.user = null
      localStorage.removeItem("user")
      removeToken()
    }
  }
})
export default userStore