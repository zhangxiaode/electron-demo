import request from "@/utils/request";
// 获取操作日志列表
export function getOperlogList(params: any) {
  return request({
    url: `/pc/system/operlog/list`,
    method: "get",
    params
  });
}
// 获取登录日志列表
export function getLogininforList(params: any) {
  return request({
    url: `/pc/system/logininfor/list`,
    method: "get",
    params
  });
}
