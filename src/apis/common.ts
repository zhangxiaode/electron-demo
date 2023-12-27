import request from "@/utils/request";
// 登录
export function login(data: any) {
  return request({
    url: `/pc/system/login`,
    method: "post",
    data
  });
}
// 获取公钥
export function getPublickey() {
  return request({
    url: `/publickey`,
    method: "get"
  });
}
// 获取当前登录用户信息
export function getLoginInfo() {
  return request({
    url: `/pc/system/getLoginInfo`,
    method: "get"
  });
}
// 获取权限菜单
export function getMenus() {
  return request({
    url: `/pc/system/getMenus`,
    method: "get"
  });
}
// 文件上传
export function uploadFile(data: any) {
  return request({
    url: `/common/fileUpload/upload`,
    method: "post",
    data,
  });
}
// 文件下载
export function downloadFile(params: any) {
  return request({
    url: `/common/fileUpload/download`,
    method: "get",
    params,
  });
}