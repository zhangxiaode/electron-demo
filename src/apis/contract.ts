import request from "@/utils/request";
// 获取合同列表
export function getContractList(params: any) {
  return request({
    url: `/pc/system/contract/list`,
    method: "get",
    params
  });
}
// 查看合同详情
export function getContractDetail(params: any) {
  return request({
    url: `/pc/system/contract/${params.id}`,
    method: "get",
    params
  });
}
// 新增合同
export function addContract(data: any) {
  return request({
    url: `/pc/system/contract/add`,
    method: "post",
    data,
  });
}
// 修改合同
export function editContract(data: any) {
  return request({
    url: `/pc/system/contract/edit`,
    method: "post",
    data,
  });
}
// 合同删除
export function deleteContract(data: any) {
  return request({
    url: `/pc/system/contract/delete?ids=${data.ids}`,
    method: "post",
    data,
  });
}
// 合同状态修改
export function changeContractStatus(data: any) {
  return request({
    url: `/pc/system/contract/changeStatus`,
    method: "post",
    data
  });
}
// 合同选择
export function getContractSelect() {
  return request({
    url: `/pc/system/contract/contractSelect`,
    method: "get"
  });
}