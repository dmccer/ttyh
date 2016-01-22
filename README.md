# ttyh
天天有货-微信公众平台-前端项目

## 项目开发启动步骤

1. `git clone {git_url}`
2. `cd ttyh`
3. `npm run dev`


## 项目发布

1. `git clone {git_url}`
2. `cd ttyh`
3. `npm start`
4. 上传 `assets` 目录下的非 `.html` 文件到静态服务器, `.html` 文件用于服务端输出

## 接口文档

域名: `http://m.ttyhuo.com`

### 发布货源

*Url*: `/mvc/product_add_json`  
*Method*: `POST`  
*Content-Type*: `application/x-www-form-urlencoded`  
*Params*:

```javascript
  {
    fromCity: String, // 出发地，如: '上海 浦东新区'
    toCity: String, // 到达地, 同上
    loadLimit: Number, // 载重, 如: 12.1
    truckLength: Number, // 车长, 如: 7.1
    truckType: Number, // 车型, 参见 truckType 对照表
    title: String, // 货物种类, 如: '冰激凌'
    memo: String // 备注, 如: 'bulabula....'
  }
```
*Response*:

```javascript
{
  code: 0, // 操作结果, 参见 code 对照表
  msg: '' // 操作结果提示, 如: '发布货源成功'
}
```
