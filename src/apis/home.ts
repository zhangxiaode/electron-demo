import request from "@/utils/request";
// 获取首页数据
export function getDashboard(params: any) {
  return request({
    url: `/pc/system/index/getData`,
    method: "get",
    params
  });
}