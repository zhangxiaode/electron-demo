import permission from './permission'
import drag from './drag'
import { App } from 'vue-demi';

// 添加全局指令
const directives = [ permission, drag ]

export default {
    install(app: App){
        directives.map(item => {
            app.directive(item.key, item.value)
        })
    }
}