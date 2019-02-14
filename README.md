# 框架背景

框架综合使用了Agile系列框架和chestnut系列框架，实现全栈前后端代码同构开发。

前端支持webpack和requirejs构建项目。后端也可在生产环境中使用webpack打包压缩和代码混淆。

## Agile系列框架

[agile-ce框架](https://github.com/nandy007/agile-ce)：提供基于jQuery的MVVM框架，用于界面与数据分离

[agile-ui框架](https://github.com/nandy007/agile-ui)：提供标准JS DOM的原生扩展，实现UI组件化开发。

[aui-loader框架](https://github.com/nandy007/aui-loader)：提供*.aui文件的编译，生成符合agile-ui框架定义的组件类，可以在webpack和requirejs中使用。

[aui-h5框架](https://github.com/nandy007/aui-h5)：基于agile-ui框架封装的h5组件，能够快速方便的构建web应用。


## chestnut系列框架

chestnut框架是基于Nodejs的KOA2框架进行封装的web服务快速开发框架。

[chestnut-utils框架](https://github.com/nandy007/chestnut-utils)：提供数据库（mysql，postgresql、oracle、sqlserver）基本操作封装、网络请求类封装（页面抓取）、页面内容拣选（基于cheerio的服务端类jQuery框架）封装、常用编解码封装等。

[chestnut-router框架](https://github.com/nandy007/chestnut-router)：提供基于KOA2路由的封装，简化调用。

[chestnut-app框架](https://github.com/nandy007/chestnut-app)：综合其他chestnut框架，提供快速搭建web服务框架。


# 框架结构

整个框架采用webpack进行构建，同时也包含requirejs中的使用示例。

## 目录说明

### build目录

webpack配置文件目录。包含app和server两个文件分别构建前端代码和后端代码。

请注意看内部说明和注释。


### app目录

前端源码目录，其子目录按照子项目排列，每个子项目需要创建一个自己的目录。

每一个项目目录结构包含：

**assets**：资源目录，一般存放公共的图片、css、less（统一变量定义和皮肤定义）资源等。皮肤使用请参考*pages/Frame.aui*文件

**components**：项目用到的aui组件，一般是粒度较细的组件。需要符合agile-ui框架规则，具体参考*pages/Frame.aui*文件内说明

**pages**：项目的页面级的aui组件，一般是路由跳转页对应的文件，粒度较粗，需要符合agile-ui框架规则，具体看*pages/Frame.aui*文件内说明

**resources**：国际化资源目录，其子目录为各个语言目录，语言目录下放置语言配置文件

**routers**：路由配置文件，路由配置需要符合aui-h5框架的路由规则。具体参考*routers/index.js*内的文件说明

**main.js**：入口文件之一，请注意看内部说明和注释。

**aui.js**：入口文件之一，用于requirejs构建*.aui加载器，请注意看内部说明和注释。


注：每个app项目根目录下的子文件（js后缀）的都是入口文件。打包规则可以看webpack.config.app.js文件


### server目录

后端代码目录，整个结构需要符合chestapp-app框架要求（取决于config文件配置），其子目录按照子项目排列，每个子项目需要创建一个自己的目录。

后端服务符合MVC架构。

每一个项目目录结构包含：

**models**：M层代码，处理数据逻辑。

**controllers**：C层代码，业务控制层逻辑。

**routers**：访问路由配置

**views**：V层代码，页面展现逻辑，由于现在一般以富客户端形式开发，页面展现在app中编写，一般views用不到，或者少用

**static**：静态文件目录，存放一些静态资源

**filters**：过滤器配置，与routers/*.js配合使用。可在路由中使用过滤器，也可以配置默认过滤器，具体看*router.filter.js*文件


**configs**：配置文件，其中config.js为配置入口，config.default.js为开发环境配置，config.prod.js为生产环境配置。codes目录为错误码配置文件，内含国际化语言配置。

注意看config.*.js文件说明。

配置文件中的rootPath配置后，可以不用配置routerPath、viewPath、staticPath，默认配置指向${rootPath}/routers、${rootPath}/views、${rootPath}/static目录，也可以自行配置。

**utils**：工具类，比如数据库分页的封装等。

**app.js**：服务端入口文件，名称不可改动，调用chestnut-app框架初始化web服务。


### public目录

开发时的静态资源目录，最终打包后到dist下每个项目目录的static目录下。

public目录跟app和server目录一样，下面的子目录也是每个项目的静态资源。一般为公共的js、css和图片等。

app开发时的编译文件也指向public目录，具体可以看*webpack.config.app.js*配置


### logs目录

服务端日志目录，按照项目名和日期生成文件，注意备份和清理。


### uploads目录

文件上传临时目录，注意清理。

### dist目录

app和server最终编译后的目录，也是按照项目目录排放


### environment目录

build需要依赖的环境目录，一般不需要关心


### scripts目录

运行需要的脚本目录，一般不需要关心


# 如何使用

## 安装

执行下面命令拷贝工程到本地：

```bash
git clone https://github.com/nandy007/project_h5.git
```

进入到project_h5目录，执行下面命令安装：

```bash
npm install
```

## 开发

### 启动前端服务

```bash
npm run app ${projectName}
```

请将${projectName}替换为具体的项目目录名称，比如：

```bash
npm run app demo
```

即启动demo项目，如果不指定，则所有app项目均启动。当项目超过3个时不建议同时启动。

前端启动统一端口为3100，可自行在webpack.config.app.js中修改。

启动后前端资源访问地址相对路径为：http://127.0.0.1:3100/${projectName}/

比如：前端项目demo的访问地址为：http://127.0.0.1:3100/demo/index.html

资源访问路径取决于webpack.config.app中的配置，请详细看配置，了解构建后的目录结构


### 启动后端服务

```bash
npm run server ${projectName}
```

请将${projectName}替换为具体的项目目录名称，必须指定项目！！！

后端服务的启动端口在各个项目的config.*.js文件中定义。

启动后，后端接口访问相对路径为：http://127.0.0.1:${port}/${projectPath}，

比如demo项目的login接口访问地址：http://127.0.0.1:7001/demo/access/login


## 打包

### 打包前端

```bash
npm run pack:app ${projectName}
```

请将${projectName}替换为具体的项目目录名称。若不指定，则打包所有app项目。

### 打包后端

```bash
npm run pack:server ${projectName}
```

请将${projectName}替换为具体的项目目录名称。若不指定，则打包所有server项目。


### 打包全部

```bash
npm run pack
```

同时打包app、server下的所有项目。


## 生产环境启动

只有打包后才存在生产环境的启动。

启动脚本：

```bash
npm run start ${projectName}
```
请将${projectName}替换为具体的项目目录名称，必须指定项目！！！

打包后启动的生产环境前后端代码在同一项目下，一个项目启动一个端口，端口在config.prod.js中配置


# 在require.js中使用

require.js中使用agile框架主要是指将编写的*.aui文件可用于require.js中，以及一些前端路由机制在require.js中的使用。

aui-loader框架既是webpack中aui的加载器，也是require.js中的加载器。

所以，再require.js中配置aui的加载器为aui-loader/dist/aui.js即可。

但是单独的加载器中是不包含aui-h5组件的，为了能够在加载器中默认加载aui-h5组件，我们在demo示例中增加app/demo/aui.js文件将aui-loader和aui-h5的部分组件打包成一个文件

在public/demo/amd.html中调用，在public/demo/assets/js/main.js进行配置使用此文件