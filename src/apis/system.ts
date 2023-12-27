import request from "@/utils/request";
// 获取菜单管理列表
export function getMenuList(params: any) {
  return request({
    url: `/pc/system/menu/list`,
    method: "get",
    params,
  });
}
// 新增菜单
export function addMenu(data: any) {
  return request({
    url: `/pc/system/menu/add`,
    method: "post",
    data,
  });
}
// 修改菜单
export function editMenu(data: any) {
  return request({
    url: `/pc/system/menu/edit`,
    method: "post",
    data,
  });
}
// 获取菜单详情
export function getMenuDetail(params: any) {
  return request({
    url: `/pc/system/menu/${params.menuId}`,
    method: "get",
    params
  });
}
// 删除菜单
export function deleteMenu(data: any) {
  return request({
    url: `/pc/system/menu/delete?menuId=${data.menuId}`,
    method: "post",
    data,
  });
}
// 获取树形菜单列表
export function getTreeselectMenu() {
  return request({
    url: `/pc/system/menu/treeselect`,
    method: "get"
  });
}
// 获取字典大类列表
export function getDictTypeList(params: any) {
  return request({
    url: `/pc/system/dict/type/list`,
    method: "get",
    params,
  });
}
// 获取字典小类列表
export function getDictDataList(params: any) {
  return request({
    url: `/pc/system/dict/data/list`,
    method: "get",
    params,
  });
}
// 获取字典大类详情
export function getDictTypeDetail(params: any) {
  return request({
    url: `/pc/system/dict/type/${params.dictId}`,
    method: "get",
    params
  });
}
// 获取字典小类详情
export function getDictDetail(params: any) {
  return request({
    url: `/pc/system/dict/data/${params.dictCode}`,
    method: "get",
    params
  });
}
// 根据字典大类获取字典小类
export function getDictList(params: any) {
  return request({
    url: `/pc/system/dict/data/type/${params.dictType}`,
    method: "get",
    params
  });
}
// 新增字典大类
export function addDictType(data: any) {
  return request({
    url: `/pc/system/dict/type/add`,
    method: "post",
    data
  });
}
// 修改字典大类
export function editDictType(data: any) {
  return request({
    url: `/pc/system/dict/type/edit`,
    method: "post",
    data
  });
}
// 删除字典大类
export function deleteDictType(data: any) {
  return request({
    url: `/pc/system/dict/type/delete?dictIds=${data.dictIds}`,
    method: "post",
    data,
  });
}
// 新增字典小类
export function addDict(data: any) {
  return request({
    url: `/pc/system/dict/data/add`,
    method: "post",
    data
  });
}
// 修改字典小类
export function editDict(data: any) {
  return request({
    url: `/pc/system/dict/data/edit`,
    method: "post",
    data
  });
}
// 删除字典小类
export function deleteDict(data: any) {
  return request({
    url: `/pc/system/dict/data/delete?dictCodes=${data.dictCodes}`,
    method: "post",
    data,
  });
}
// 导出字典大类
export function exportDictType() {
  return request({
    url: `/pc/system/dict/type/export`,
    method: "get"
  });
}
// 刷新字典缓存
export function refreshDictTypeCache() {
  return request({
    url: `/pc/system/dict/type/refreshCache`,
    method: "get"
  });
}
// 新增参数设置
export function addConfig(data: any) {
  return request({
    url: `/pc/system/config/add`,
    method: "post",
    data
  });
}
// 获取参数设置列表
export function getConfigList(params: any) {
  return request({
    url: `/pc/system/config/list`,
    method: "get",
    params
  });
}
// 获取参数设置详情
export function getConfigDetail(params: any) {
  return request({
    url: `/pc/system/config/${params.configId}`,
    method: "get",
    params
  });
}
// 修改参数设置
export function editConfig(data: any) {
  return request({
    url: `/pc/system/config/edit`,
    method: "post",
    data,
  });
}
