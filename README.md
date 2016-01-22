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

### 我发布的货源列表

*Url*: `/mvc/xxxx`  
*Method*: `GET`  
*Params*:

```javascript
// cookie 标示当前用户
{
	pageIndex: Number, // 页码, 起始页为 0, 如: 1
	pageSize: Number // 每页记录条数, 默认为 10 条, 如: 10
}
```
*Response*:

```javascript
[
	{
		product: {
			productID: Number, // 货物id
			createTime: Number, // 发布时间戳
			fromCity: String, // 出发地
			toCity: String, // 到达地
			truckType: String, // 车型, 如: 厢式
			truckLength: Number, // 车长, 如: 9.6
			loadLimit: Number, // 载重, 如: 17.5
			title: String, // 货物种类
			memo: String, // 备注
		}
	}
]
```

### 搜索货源

*Url*: `/mvc/searchProductsForH5`  
*Method*: `GET`  
*Params*:

```javascript
// cookie 标识当前用户
{
	fromCity: String, // 出发城市, 空格分割省市县, 如: '上海 浦东新区'
	toCity: String, // 到达城市, 同上
	truckTypeFlag: String, // 车型标识码集, 逗号分割车型标示码, 如: '1,3,6'
	loadLimitFlag: String, // 载重标识码集, 逗号分割载重标识码, 如: '2,4',
	truckLengthFlag: String, // 车长标识码集, 逗号分割车长标识码, 如: '3,5'
	pageIndex: Number, // 页码, 起始页为 0, 如: 1
	pageSize: Number // 每页记录条数, 默认为 10 条, 如: 10
}
```
*Response*:

```javascript
// 实名认证和公司认证信息
[
	{
		providerUserName: String, // 货主姓名
		provideUserImgUrl: String, // 货主图像 url
		product: {
			productID: Number, // 货源ID
			createTime: Number, // 发布时间戳
			fromCity: String, // 出发地
			toCity: String, // 到达地
			truckType: String, // 车型, 如: 厢式
			truckLength: Number, // 车长, 如: 9.6
			loadLimit: Number, // 载重, 如: 17.5
			title: String, // 货物种类
			memo: String, // 备注
			provideUserMobileNo: String // 手机号
			provideUserID: Number // 货主ID
		}
	}
]
```

### 货源详情

*Url*: `/mvc/searchProductsForH5`  
*Method*: `GET`  
*Params*:

```javascript
// cookie 标识当前用户
{
	productID: Number // 货源ID
}
```
*Response*:

```javascript
{}
```


