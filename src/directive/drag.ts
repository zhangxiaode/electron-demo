
function addDrag(el: any, binding: any) {
    el = el.querySelectorAll('.n-scrollbar-container')[0]
    el.style.cursor = 'grab'
    el.onmousedown = function(e: any) {
        if(e.target.classList.contains('cantMove')) return;

        if (e.target.localName === 'input') return; // fix: 表格内 input 无法滑动选中文案
        const gapX = e.clientX
        const startX = el.scrollLeft
        document.onmousemove = function(e) {
            const x = e.clientX - gapX
            el.scrollLeft = startX - x
            return false
        }
        document.onmouseup = function() {
            document.onmousemove = null
            document.onmouseup = null
        }
    }
}
export default {
    key: 'drag',
    value: {
        mounted(el: any, binding: any) {
            addDrag(el, binding)
        },
        updated(el: any, binding: any) {
            addDrag(el, binding)
        }
    }
}