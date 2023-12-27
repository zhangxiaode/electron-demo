import request from "@/utils/request";
// 获取客户列表
export function getCustomList(params: any) {
  return request({
    url: `/pc/system/custom/list`,
    method: "get",
    params
  });
}
// 查看客户详情
export function getCustomDetail(params: any) {
  return request({
    url: `/pc/system/custom/${params.id}`,
    method: "get",
    params
  });
}
// 新增客户
export function addCustom(data: any) {
  return request({
    url: `/pc/system/custom/add`,
    method: "post",
    data,
  });
}
// 修改客户
export function editCustom(data: any) {
  return request({
    url: `/pc/system/custom/edit`,
    method: "post",
    data,
  });
}
// 客户删除
export function deleteCustom(data: any) {
  return request({
    url: `/pc/system/custom/delete?ids=${data.ids}`,
    method: "post",
    data,
  });
}
// 导出客户信息
export function exportCustom() {
  return request({
    url: `/pc/system/custom/export`,
    method: "get"
  });
}
// 客户状态修改
export function changeCustomStatus(data: any) {
  return request({
    url: `/pc/system/custom/changeStatus`,
    method: "post",
    data
  });
}