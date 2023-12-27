import request from "@/utils/request";
// 获取收款列表
export function getPaymentList(params: any) {
  return request({
    url: `/pc/system/payment/list`,
    method: "get",
    params
  });
}
// 查看收款详情
export function getPaymentDetail(params: any) {
  return request({
    url: `/pc/system/payment/${params.id}`,
    method: "get",
    params
  });
}
// 新增收款
export function addPayment(data: any) {
  return request({
    url: `/pc/system/payment/add`,
    method: "post",
    data,
  });
}
// 修改收款
export function editPayment(data: any) {
  return request({
    url: `/pc/system/payment/edit`,
    method: "post",
    data,
  });
}
// 收款删除
export function deletePayment(data: any) {
  return request({
    url: `/pc/system/payment/delete?ids=${data.ids}`,
    method: "post",
    data,
  });
}
// 导出收款
export function exportPayment() {
  return request({
    url: `/pc/system/payment/export`,
    method: "get"
  });
}
// 收款状态修改
export function changePaymentStatus(data: any) {
  return request({
    url: `/pc/system/payment/changeStatus`,
    method: "post",
    data
  });
}