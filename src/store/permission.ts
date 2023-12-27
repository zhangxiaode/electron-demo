import { defineStore } from 'pinia'
const permissionStore = defineStore({    
  id: "permission",    
  state() {
    return {
      hasSetted: false,
      menuPermissions: [] as Array<string>,
      buttonPermissions: [] as Array<string>
    }
  },
  getters: {
    menuPermissionsGetters: (state) => state.menuPermissions,
    buttonPermissionsGetters: (state) => state.buttonPermissions
  },
  actions: {
    setMenuPermission({menuPermissions}: any) {
      this.$state.menuPermissions = menuPermissions
      this.$state.hasSetted = true
    },
    setButtonPermissions({buttonPermissions}: any) {
      this.$state.buttonPermissions = buttonPermissions
      this.$state.hasSetted = true
    },
    clear() {
      this.$state.menuPermissions = []
      this.$state.buttonPermissions = []
      this.$state.hasSetted = false
    }
  }
})
export default permissionStore