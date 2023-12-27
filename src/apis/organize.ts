import request from "@/utils/request";
// 获取用户列表
export function getUserList(params: any) {
  return request({
    url: `/pc/system/user/list`,
    method: "get",
    params
  });
}
// 用户状态修改
export function changeUserStatus(data: any) {
  return request({
    url: `/pc/system/user/changeStatus`,
    method: "post",
    data
  });
}
// 用户查看详情
export function getUserDetail(params: any) {
  return request({
    url: `/pc/system/user/${params.userId}`,
    method: "get",
    params
  });
}
// 用户修改
export function editUser(data: any) {
  return request({
    url: `/pc/system/user/edit`,
    method: "post",
    data,
  });
}
// 用户删除
export function deleteUser(data: any) {
  return request({
    url: `/pc/system/user/delete?userIds=${data.userIds}`,
    method: "post",
    data,
  });
}
// 用户重制密码
export function resetUserPwd(data: any) {
  return request({
    url: `/pc/system/user/resetPwd`,
    method: "post",
    data
  });
}
// 用户新增
export function addUser(data: any) {
  return request({
    url: `/pc/system/user/add`,
    method: "post",
    data
  });
}
// 用户导入
export function importUser(data: any) {
  return request({
    url: `/pc/system/user/importData`,
    method: "post",
    data
  });
}
// 获取部门列表
export function getDeptList(params: any) {
  return request({
    url: `/pc/system/dept/list`,
    method: "get",
    params
  });
}
// 删除部门
export function deleteDept(data: any) {
  return request({
    url: `/pc/system/dept/delete?deptId=${data.deptId}`,
    method: "post",
    data
  });
}
// 新增部门
export function addDept(data: any) {
  return request({
    url: `/pc/system/dept/add`,
    method: "post",
    data
  });
}
// 获取部门详情
export function getDeptDetail(params: any) {
  return request({
    url: `/pc/system/dept/${params.dept_id}`,
    method: "get",
    params
  });
}
// 修改部门
export function editDept(data: any) {
  return request({
    url: `/pc/system/dept/edit`,
    method: "post",
    data,
  });
}
// 修改部门时，部门树中排除当前节点
export function excludeDept(params: any) {
  return request({
    url: `/pc/system/dept/list/exclude/${params.dept_id}`,
    method: "get",
    params
  });
}
// 获取部门树形结构列表
export function getTreeselectDept() {
  return request({
    url: `/pc/system/dept/treeselect`,
    method: "get"
  });
}
// 获取岗位选择列表
export function getPostOptionList() {
  return request({
    url: `/pc/system/post/optionselect`,
    method: "get"
  });
}
// 获取岗位列表
export function getPostList(params: any) {
  return request({
    url: `/pc/system/post/list`,
    method: "get",
    params
  });
}
// 新增岗位
export function addPost(data: any) {
  return request({
    url: `/pc/system/post/add`,
    method: "post",
    data
  });
}
// 修改岗位
export function editPost(data: any) {
  return request({
    url: `/pc/system/post/edit`,
    method: "post",
    data,
  });
}
// 获取岗位详情
export function getPostDetail(params: any) {
  return request({
    url: `/pc/system/post/${params.post_id}`,
    method: "get",
    params
  });
}
// 删除岗位
export function deletePost(data: any) {
  return request({
    url: `/pc/system/post/delete?postIds=${data.postIds}`,
    method: "post",
    data
  });
}
