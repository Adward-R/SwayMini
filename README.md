# SwayMini 设计文档
====
——适合手机显示的HTML5网页生成工具

---- 
# 1. 引言

# 2. 总体设计
## 2.1 需求规定
- 对于多种手机屏幕尺寸的适配
## 2.2 运行环境
## 2.3 体系架构
### 2.3.1 逻辑架构
本B/S体系软件在逻辑（或者开发分工）上可以简单分为前端和后端：

	- 前端（Browser）：HTML 5, Bootstrap 3, jQuery, JavaScript
	- 后端（Server）：Python 2.7.9, Django 1.8

### 2.3.2 功能架构
- url
- 界面概略图

### 2.3.3 开发架构
本B/S体系软件的项目层级目录实际上呈现为如下的标准Django Project：

	├── db.sqlite3
	├── djcode
	│   ├── __init__.py
	│   ├── apps
	│   ├── configs
	│   ├── demo_views.py
	│   ├── settings.py
	│   ├── static
	│   │   ├── css
	│   │   │   ├── bootstrap-theme.css
	│   │   │   ├── bootstrap-theme.min.css
	│   │   │   ├── bootstrap.css
	│   │   │   └── bootstrap.min.css
	│   │   ├── users
	│   │   │   └── test_user
	│   │	 │       └── 20150430181015
	│   │   │           ├── latest.html
	│   │   │           └── previous.html
	│   │   ├── fonts
	│   │   │   ├── glyphicons-halflings-regular.eot
	│   │   │   ├── glyphicons-halflings-regular.svg
	│   │   │   ├── glyphicons-halflings-regular.ttf
	│   │   │   └── glyphicons-halflings-regular.woff
	│   │   └── js
	│   │       ├── bootstrap.js
	│   │       ├── bootstrap.min.js
	│   │       ├── csrftoken.js
	│   │       ├── jquery.cookie.js
	│   │       └── jquery.min.js
	│   ├── templates
	│   │   └── index.html
	│   ├── urls.py
	│   ├── wsgi.py
	└── manage.py

其中：

 - Django核心组件：
	- settings.py 包含了项目的资源路径等关键配置信息；
	- urls.py 包含了从Browser端访问时的URL匹配规则，即2.3.2部分内容；
	- wsgi.py 包含部署到生产服务器上时的接口module配置（比如mod\_wsgi之于Apache，uwsgi之于Nginx），暂时用不到；
	- demo\_views.py 包含了Django后端处理不同URL请求时调用的view函数（也可以是其他名字，在urls.py中引用到即可）；
- templates：view函数通过渲染html模板来呈现网页内容，模板文件夹的位置在settings.py中指定；
- static：存放日志、用户数据、js、css、字体等静态资源，其位置在settings.py中指定；
- users：存放用户数据，包括图片、流媒体、文档日志、版本历史等，其中按“用户-\>文档”两层结构分别存放资源，文档以时间戳作唯一标识（文档名用作显示而非存储）；
- 因为只需要部署一个特定功能的APP到特定平台，app和config文件夹可以留空以便拓展。

# 3. 详细设计
## 3.1 用户场景描述

## 3.2 前后端映射
### 全局参数：
当前user\_name，当前doc\_id

用户操作 | URL | 后端操作 | 前端更动
---|---|---|---
访问开始引导界面|`.../`|通过view渲染模板
用户登录|`.../`|查询用户资料数据库判断是否匹配
登录失败| `.../login_error`|渲染登录错误信息页面
登录成功| `.../home`|记下`user_name`作为参数，渲染用户主面板的模板，显示“新建”选项和过往存档的可编辑页面列表（从`…/users/user_name/`获取文件夹名字列表）
选择“新建”|`.../edit/`, POST: `timestamp, user_name`|获取当前的`timestamp`，建立`.../users/{$user_name}/{$timestamp}/`文件夹，并在其中新建一个默认的空白页面模板`latest.html`，然后将其通过view函数渲染到Browser端（包括导航栏和JS脚本）
选择一个过往的存档进行编辑|`.../edit/`, POST: `user_name, doc_id`|将`.../users/{$user_name}/{$timestamp}/latest.html`作为模板渲染（包括导航栏和JS脚本）
（除上传资源外所有编辑页面动作）| `.../edit/`|  | 
（上传图片）|`.../upload/`, POST: `user_name, doc_id`|获取当前的`timestamp`，把图片文件传到Server端`.../users/{$user_name}/{$doc_id}/{$timestamp}.jpg`保存（或者其他格式）|根据Server端保存的图片资源地址，用JS即时更改Container的HTML代码来引用之 
点击导航栏的“保存”|Ajax:`.../save/`, POST: `user_name, doc_id, document.innerHTML`|将`.../users/{$user_name}/{$doc_id}/`文件夹下的`latest.html`重命名为`previous.html`，再把接收到的Browser端POST来的页面body代码存储为`latest.html`|将页面除控件和脚本外的body代码发送到后端
点击导航栏的“撤销”|Ajax:`.../discard/`, POST: `user_name, doc_id`|渲染`.../users/{$user_name}/{$doc_id}/latest.html`|撤销所有未保存更改，显示最新commit版本的页面
点击导航栏的“回滚”|Ajax:`... /rollback/`, POST: `user_name, doc_id`|将`.../users/{$user_name}/{$doc_id}/`文件夹下的`latest.html`删除，重命名`previous.html`为`latest.html`，渲染`latest.html`模板|显示上一个commit版本的页面

---- 
# 没想好

拓展功能：图片库，流媒体资源库
 