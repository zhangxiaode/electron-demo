import request from "@/utils/request";
// 获取项目列表
export function getProjectList(params: any) {
  return request({
    url: `/pc/projectItem/project/list`,
    method: "get",
    params
  });
}
// 获取项目详情
export function getProjectDetail(params: any) {
  return request({
    url: `/pc/projectItem/project/${params.id}`,
    method: "get",
    params
  });
}
// 新增项目
export function addProject(data: any) {
  return request({
    url: `/pc/projectItem/project/add`,
    method: "post",
    data,
  });
}
// 修改项目
export function editProject(data: any) {
  return request({
    url: `/pc/projectItem/project/edit`,
    method: "post",
    data,
  });
}
// 删除项目
export function deleteProject(data: any) {
  return request({
    url: `/pc/projectItem/project/delete?ids=${data.ids}`,
    method: "post",
    data,
  });
}
// 导出项目
export function exportProject() {
  return request({
    url: `/pc/projectItem/project/export`,
    method: "get"
  });
}
// 项目状态修改
export function changeProjectStatus(data: any) {
  return request({
    url: `/pc/projectItem/project/changeStatus`,
    method: "post",
    data
  });
}
// 项目选择
export function getProjectSelect() {
  return request({
    url: `/pc/projectItem/project/projectSelect`,
    method: "get"
  });
}