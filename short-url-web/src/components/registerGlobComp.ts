import type { App } from 'vue';
import {
  Carousel,
  Form,
  Input,
  Layout,
  Select,
  Table,
  Upload,
  Modal,
  Divider,
  Popconfirm,
  InputNumber,
  Image,
  Button,
  DatePicker,
} from 'ant-design-vue';

export function registerGlobComp(app: App) {
  app
    .use(Button)
    .use(Input)
    .use(Layout)
    .use(Form)
    .use(Select)
    .use(Upload)
    .use(Carousel)
    .use(Table)
    .use(Modal)
    .use(Divider)
    .use(Popconfirm)
    .use(InputNumber)
    .use(Image)
    .use(DatePicker);
}
