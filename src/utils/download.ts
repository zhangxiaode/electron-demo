import { getToken } from "@/utils/auth";
// 根据response header获取文件名
export const getFileName = (response: any) => {
    const disposition = response.headers.get('Content-Disposition');
 
    // 本例格式是："attachment; filename="img.jpg""
    let fileName = disposition.split('filename=')[1].replaceAll('"', '');
 
    // 可以根据自己的格式来截取文件名
    // 参考https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition
    // let fileName = '';
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //     const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
    //     fileName = matches?.[1]?.replace(/['"]/g, '');
    // }
    fileName = decodeURIComponent(fileName);
    return fileName;
}
// 封装一个fetch download方法
export const downloadFile = async (fetchUrl: RequestInfo, method = "POST", body = null) => {
    const token = getToken();
    const response: any = await window.fetch(fetchUrl, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": token
        } as any
    });
    const fileName = getFileName(response);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a: any = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}