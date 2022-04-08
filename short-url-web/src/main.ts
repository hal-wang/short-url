import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import 'ant-design-vue/dist/antd.css';
import '/@/design/index.less';
import 'virtual:windi.css';
import 'virtual:svg-icons-register';
import { registerGlobComp } from './components/registerGlobComp';

const app = createApp(App);
setupStore(app);
setupRouter(app);
registerGlobComp(app);
app.mount('#app');
