import { createRouter, createWebHistory } from "vue-router";
import routes from "@/utils/menu"
import setPermissions from '@/utils/permissions'
const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach(async (_to, _from, next)=>{
    await setPermissions()
    next()
})

export default router;
