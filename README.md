# ttyh
天天有货-微信公众平台-前端项目

## 环境配置

1. 安装 NodeJs
2. 安装 git 客户端
3. 安装 cnpm
4. 安装微信开发者工具

## 项目开发启动步骤

### Linux/Unix/OSX

1. `git clone {git_url}`
2. `cd ttyh`
3. `npm run dev`

### Windows

1. 在 git bash 中，切换到项目根目录，运行如下命令
2. `cnpm install`
3. `cd ./node_modules/zepto`
4. `cnpm install`
5. `MODULES='zepto event ajax form ie fx' npm run dist`
6. `cd ../../`
7. `./node_modules/.bin/webpack-dev-server --hot --inline`
8. Chrome 打开: `http://localhost:8080/login.html`

## 项目发布

1. `git clone {git_url}`
2. `cd ttyh`
3. `npm start`
4. 上传 `assets` 目录下的非 `.html` 文件到静态服务器, `.html` 文件用于服务端输出


## 环境

1. 线上接口地址: `http://m.ttyhuo.com`
2. 测试接口地址: `http://api.ttyhuo.com:85`

## Bug 临时记录

1. 测试环境无法使用登录成功，但是，没有写入 cookie 到测试环境的域
