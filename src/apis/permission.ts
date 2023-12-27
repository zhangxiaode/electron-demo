import request from "@/utils/request";
// 获取角色选择列表
export function getRoleOptionsList() {
  return request({
    url: `/pc/system/role/optionselect`,
    method: "get"
  });
}
// 获取角色列表
export function getRoleList(params: any) {
  return request({
    url: `/pc/system/role/list`,
    method: "get",
    params,
  });
}
// 查看角色详情
export function getRoleDetail(params: any) {
  return request({
    url: `/pc/system/role/${params.roleId}`,
    method: "get",
    params
  });
}
// 删除角色
export function deleteRole(data: any) {
  return request({
    url: `/pc/system/role/delete?roleIds=${data.roleIds}`,
    method: "post",
    data,
  });
}
// 新增角色
export function addRole(data: any) {
  return request({
    url: `/pc/system/role/add`,
    method: "post",
    data,
  });
}
// 修改角色
export function editRole(data: any) {
  return request({
    url: `/pc/system/role/edit`,
    method: "post",
    data
  });
}
// 获取菜单授权树
export function roleMenuTreeselect(params: any) {
  return request({
    url: `/pc/system/menu/roleMenuTreeselect/${params.roleId}`,
    method: "get",
    params
  });
}
