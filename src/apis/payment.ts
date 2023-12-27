import request from "@/utils/request";
// 获取付款列表
export function getFkpaymentList(params: any) {
  return request({
    url: `/pc/system/fkpayment/list`,
    method: "get",
    params
  });
}
// 查看付款详情
export function getFkpaymentDetail(params: any) {
  return request({
    url: `/pc/system/fkpayment/${params.id}`,
    method: "get",
    params
  });
}
// 新增付款
export function addFkpayment(data: any) {
  return request({
    url: `/pc/system/fkpayment/add`,
    method: "post",
    data,
  });
}
// 修改付款
export function editFkpayment(data: any) {
  return request({
    url: `/pc/system/fkpayment/edit`,
    method: "post",
    data,
  });
}
// 付款删除
export function deleteFkpayment(data: any) {
  return request({
    url: `/pc/system/fkpayment/delete?ids=${data.ids}`,
    method: "post",
    data,
  });
}
// 导出付款
export function exportFkpayment() {
  return request({
    url: `/pc/system/fkpayment/export`,
    method: "get"
  });
}
// 付款状态修改
export function changeFkpaymentStatus(data: any) {
  return request({
    url: `/pc/system/fkpayment/changeStatus`,
    method: "post",
    data
  });
}