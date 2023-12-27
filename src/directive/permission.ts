import { permissionStore } from "@/store";
async function checkPermission(el: any, binding: any) {
    const buttonPermissionsGetters = permissionStore().buttonPermissionsGetters
    const permissions = buttonPermissionsGetters.length > 0 ? buttonPermissionsGetters : JSON.parse(localStorage.getItem('permissions') as any) || [];
    let hasPermission = false
    const isString: String = typeof binding.value
    if(binding.value && binding.value instanceof Array && binding.value.length > 0) {
        hasPermission = binding.value.every((item: string) => permissions.includes(item))
    } else if(binding.value && isString == 'string') {
        hasPermission = permissions.includes(binding.value)
    }
    if(!(hasPermission)) {
        el.remove()
    }
}
export default {
    key: 'permission',
    value: {
        async mounted(el: any, binding: any) {
            await checkPermission(el, binding)
        },
        async updated(el: any, binding: any) {
            await checkPermission(el, binding)
        }
    }
}