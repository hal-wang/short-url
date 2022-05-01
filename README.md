# short-url

能够使用自己的域名，简化 url

示例网站：<https://s.hal.wang>

例如

1. 知乎任意一个详情页
   - 短地址： <https://s.hal.wang/zhihu>
   - 原地址： `https://zhuanlan.zhihu.com/p/91947139`
2. 一键部署地址
   - 短地址： <https://s.hal.wang/sud>
   - 原地址： `https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fshort-url&branch=main`

## 改用自己的域名，你需要做：

1. 一键部署 [![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fshort-url&branch=main)

2. 配置 HTTP 访问服务

   - 添加自定义域名，如 `s.hal.wang`
   - 添加触发路径 `/w`，关联资源为静态托管，以开启网站功能，如 `s.hal.wang/w` 。（可选，不设置则不使用网站）

## 注意事项

1. API 生成短链接中的域名，是根据调用 API 时头部的 `short-url-origin`。因此调用 API 需要注意头部参数。
2. 跳转使用 302，因为可能存在限制访问次数的短链接。如果使用 301 则无法正确统计。
3. 随机部分，默认是 4 位，如果 4 位的冲突较多，则生成 5 位。以此类推，长度不限。

## 二次开发

如果现有功能不能满足，你可以进行二次开发

### API

在 `short-url-api` 下创建文件 `.env.local`，内容如下

```
SCF_NAMESPACE=cloudbase环境id
SECRET_KEY=腾讯云 secret key
SECRET_ID=腾讯云 secret id
```

#### 运行 API

先安装依赖，在 `short-url-api` 下执行

```bash
yarn install
```

再使用 vscode 打开 `short-url-api`，直接 F5 开始调试

或在 `short-url-api` 目录下执行

```bash
yarn dev
```

### Web

先安装依赖，在 `short-url-web` 下执行

```bash
yarn install
```

再执行下面命令运行

```bash
yarn dev:test
```

或使用已发布的接口，需要修改 `short-url-web/.env.development` 文件中的 `VITE_GLOB_PROXY_API_URL`

然后运行

```bash
yarn dev
```

### 发布

可以本地使用 `@cloudbase/cli` 发布，也可以使用 GitHub Actions 持续集成

#### cli 发布

在项目根目录下创建 `.env.local` （注意是项目根目录，不是 API 或 Web 下）

内容如下

```
ENV_ID=cloudbase环境id
```

在项目根目录下运行以下命令发布

```bash
npm run deploy
```

#### GitHub Actions

仓库增加 Secrets，在 `Settings -> Secrets -> Actions`，点击 `New repository secret` 按钮

- TENCENT_SECRET_ID: 腾讯云 secret id
- TENCENT_SECRET_KEY: 腾讯云 secret key
- ENV: 与 `cli 发布` 的 `.env.local` 文件内容相同

配置完成后，每次 main 分支提交代码就会自动发布到 CloudBase

发布进度可在仓库 `Actions` 中看到
