import request from "@/utils/request";
// 获取供应商列表
export function getSupplierList(params: any) {
  return request({
    url: `/pc/supplier/supplier/list`,
    method: "get",
    params
  });
}
// 获取供应商详情
export function getSupplierDetail(params: any) {
  return request({
    url: `/pc/supplier/supplier/${params.id}`,
    method: "get",
    params
  });
}
// 新增供应商
export function addSupplier(data: any) {
  return request({
    url: `/pc/supplier/supplier/add`,
    method: "post",
    data,
  });
}
// 修改供应商
export function editSupplier(data: any) {
  return request({
    url: `/pc/supplier/supplier/edit`,
    method: "post",
    data,
  });
}
// 删除供应商
export function deleteSupplier(data: any) {
  return request({
    url: `/pc/supplier/supplier/delete?ids=${data.ids}`,
    method: "post",
    data,
  });
}
// 导出供应商
export function exportSupplier() {
  return request({
    url: `/pc/supplier/supplier/export`,
    method: "get"
  });
}
// 供应商状态修改
export function changeSupplierStatus(data: any) {
  return request({
    url: `/pc/supplier/supplier/changeStatus`,
    method: "post",
    data
  });
}