<h1 align="center">vuetify-admin</h1>

## 简介

[vuetify-admin](https://github.com/master-nan/vuetify-admin) 是在我另一个项目[vue-thinkphp-admin](https://github.com/master-nan/vue-thinkphp-admin)的基础上将[element-ui](https://github.com/ElemeFE/element)换成了[vuetify](https://github.com/vuetifyjs/vuetify)并改进了部分代码逻辑以及数据库部分修改。

- [项目地址](https://github.com/master-nan/vuetify-admin)
 

## 准备

本项目使用了[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/)、[vuetify](https://github.com/vuetifyjs/vuetify) 以及 [thinkphp5.0](https://github.com/top-think/framework/tree/master)。

## 目录

主要目录结构和文件简介

```
  vue-tinkphp-admin
  |-client                  客户端
  |  |-build            
  |  |-config           
  |  |-src                   主体内容
  |  |  |-api                接口文件目录  
  |  |  |-assest             资源文件目录
  |  |  |-components
  |  |  |-filters            全局过滤文件目录
  |  |  |-lang               国际化
  |  |  |-router             路由文件目录
  |  |  |-store              全局状态管理目录
  |  |  |-utils              工具类目录
  |  |  |  |-components.js   所有路由component在此目录引入，配合后台权限使用
  |  |  |  |-http.js         引入axios，提供get/post/put/delete方法，如需更多自行增加
  |  |  |  └─index.js        全局一些公共方法
  |  |  |-ivews              所有页面目录
  |  |  └─...    
  |  └─static    
  |-server                   服务的
  |  |-application           应用目录
  |  |  |-admin              模块目录
  |  |  |  |-controller      控制器目录
  |  |  |  |-model           模型目录
  |  |  |  |-validate        验证目录
  |  |  |  |-common.php      模块下的公共方法
  |  |  |  └─...            
  |  |  |─public             WEB目录（对外访问目录）
  |  |  |  |-uploads         上传目录          
  |  |  |  |─index.php       入口文件
  |  |  |  └─...
  |  |-sql                   数据库文件目录
  |  └─...
```

## 说明

本项目侧边栏支持三级目录，但是由于[vuetify](https://github.com/vuetifyjs/vuetify)没有级联选择器，所以在后台添加目录时暂时只支持二级。
其他如目录、功能等与[vue-thinkphp-admin](https://github.com/master-nan/vue-thinkphp-admin)基本类似，可以参考。本项目新增了国际化，以及后台名称设置，更多全局配置可以自行添加。

## 注意

项目部署中遇到问题，请参考[vue-thinkphp-admin](https://github.com/master-nan/vue-thinkphp-admin)。

## 最后

如果本项目发现bug请提出，我会第一时间进行修复。这个项目我自己也会在其他项目中使用，如有其他通用功能还会继续更新。

## 最后的最后

如果你喜欢这个项目，或者这个项目对你当前工作有所帮助，请给`star`谢谢!

## 许可证

[MIT](./LICENSE)

Copyright (c) 2018-8 master-nan
