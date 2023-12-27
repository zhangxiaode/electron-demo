# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## 部署指引

- [Deploy](https://git.jinbaopay.com/docs/deploy/-/blob/master/deploy.md#mediasense)

## Getting started

1. 拉取代码
2. 安装项目依赖
> npm install --unsafe-perm
3. 启动服务
> npm run dev

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).







<!-- 
// 客户信息查询 people:people:query
// 供应商管理 supplier:supplier:list 
// 收款管理 financial:sr:list
// 付款管理 financial:zf:list
// 项目信息 projectItem:project:list
// 用户查询 system:user:query
// 菜单管理 system:menu:list 
// 字典管理 system:dict:list
// 操作日志 monitor:operlog:list
// 登录日志 monitor:logininfor:list
// 用户管理 system:user:list
// 部门管理 system:dept:list
// 岗位管理 system:post:list
// 角色管理 system:role:list
// 菜单授权 system:menu:list
// 菜单查询 system:menu:query
// 客户管理 people:people:list
// 项目信息查询 projectItem:project:query
// 合同管理 contract:contract:list
// 供应商管理查询 supplier:supplier:query
// 字典查询 system:dict:query
// 部门查询 system:dept:query
// 角色查询 system:role:query
// 参数查询 system:config:query
// 岗位查询 system:post:query
// 岗位导出 system:post:export
// 角色导出 system:role:export
// 参数删除 system:config:remove
// 参数导出 system:config:export
// 参数设置 system:config:list







// 客户信息查询 people:people:query
// 客户信息新增 people:people:add 
// 客户信息修改 people:people:edit
// 客户信息删除 people:people:remove
// 客户信息导出 people:people:export
// 供应商管理 supplier:supplier:list 
// 收款管理 financial:sr:list
// 付款管理 financial:zf:list
// 项目信息 projectItem:project:list
// 用户查询 system:user:query
// 用户新增 system:user:add
// 用户修改 system:user:edit
// 用户删除 system:user:remove
// 用户导出 system:user:export 
// 用户导入 system:user:import
// 重置密码 system:user:resetPwd
// 菜单管理 system:menu:list 
// 字典管理 system:dict:list
// 参数设置 system:config:list
// 操作日志 monitor:operlog:list
// 登录日志 monitor:logininfor:list
// 用户管理 system:user:list
// 部门管理 system:dept:list
// 岗位管理 system:post:list
// 角色管理 system:role:list
// 菜单授权 system:menu:list
// 菜单查询 system:menu:query
// 菜单新增 system:menu:add
// 菜单修改 system:menu:edit
// 菜单删除 system:menu:remove
// 客户管理 people:people:list
// 项目信息查询 projectItem:project:query
// 项目信息新增 projectItem:project:add
// 项目信息修改 projectItem:project:edit
// 项目信息删除 projectItem:project:remove
// 项目信息导出 projectItem:project:export
// 合同管理 contract:contract:list
// 供应商管理查询 supplier:supplier:query
// 供应商管理新增 supplier:supplier:add
// 供应商管理修改 supplier:supplier:edit
// 供应商管理删除 supplier:supplier:remove
// 供应商管理导出 supplier:supplier:export
// 字典查询 system:dict:query
// 字典新增 system:dict:add
// 字典修改 system:dict:edit
// 字典删除 system:dict:remove 
// 字典导出 system:dict:export
// 部门查询 system:dept:query
// 部门新增 system:dept:add
// 部门修改 system:dept:edit
// 部门删除 system:dept:remove
// 角色查询 system:role:query
// 角色新增 system:role:add
// 角色修改 system:role:edit
// 角色删除 system:role:remove
// 角色导出 system:role:export
// 参数查询 system:config:query
// 参数新增 system:config:add
// 参数修改 system:config:edit
// 参数删除 system:config:remove
// 参数导出 system:config:export
// 岗位查询 system:post:query
// 岗位新增 system:post:add
// 岗位修改 system:post:edit 
// 岗位删除 system:post:remove
// 岗位导出 system:post:export -->
