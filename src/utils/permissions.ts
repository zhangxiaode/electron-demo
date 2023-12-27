import { getMenus, getLoginInfo } from "@/apis/index";
import { getToken } from "@/utils/auth";
import { permissionStore } from "@/store";
const formatMenus = (data: Array<any>, menuPermissions: Array<String>) => {
    data.map((item: any) => {
        // M目录 C菜单 F按钮
        if (item.menuType === 'C') {
            menuPermissions.push(item.perms)
        }
        if (item.children.length > 0) {
            menuPermissions.push(...formatMenus(item.children, []))
        }
    })
    return menuPermissions
}

const setPermissions = async () => {
    const token = getToken();
    const hasSetted = permissionStore().hasSetted
    if(token && !hasSetted) {
        const { data } = await getMenus() as any
        const { permissions } = await getLoginInfo() as any
        const menuPermissions = formatMenus(data, [])
        permissionStore().setMenuPermission({ menuPermissions})
        permissionStore().setButtonPermissions({ buttonPermissions: permissions})
    }
}
export default setPermissions