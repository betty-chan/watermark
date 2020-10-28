### 1.介绍
`watermark.js`是基于DOM对象实现的BS系统的水印，确保系统保密性，安全性，降低数据泄密风险，简单轻量，支持多属性配置，动态计算水印，水印防被删（监听水印组件元素删除并重新添加，监听改变水印的属性并重新添加）。

特性：
+ 多属性配置，简单易上手
+ 动态计算水印
+ 水印防被删
+ 支持2种导入使用：本地引用，npm引用
+ 水印测试工具：testTool工具
+ 内置2种全局API方法：init(), remove()。
+ 原理：pointer-events事件穿透属性，Shadow DOM(影子DOM)，opacity等

注意：基于本项目源码从事科研、论文、系统开发，请在文中或系统中表明来自于本项目的内容和创意。 

## 2.引入

### 2.1 本地引入

第一步：获取组件

第二步：在需要使用的页面引入文件"watermark.js":
```
<script type="text/javascript" src="./watermark.js"></script>
```

### 2.2 npm引入

第一步：npm获取水印组件包： 
```
npm install watermark
```
第二步：引入水印模块：

```
import watermark from 'watermark'
```

## 3、方法

### 3.1 watermark.init(setting);
在页面加载完毕后初始化水印，添加load和resize事件。其中setting为需要配置的属性
例如：
```js
watermark.init({ watermark_txt: "测试水印，1021002301，测试水印，100101010111101" });
``` 


### 3.2 watermark.remove();
手动移除水印
例如：
```js
watermark.remove();
``` 

## 4、属性配置
```
  watermark_id = 'wm_div_id',//水印总体的id
  watermark_prefix = 'mask_div_id',//小水印的id前缀
  watermark_txt = "",//水印的内容
  watermark_x = 20, //水印起始位置x轴坐标
  watermark_y = 20, //水印起始位置Y轴坐标
  watermark_rows = 0,//水印行数
  watermark_cols = 0, //水印列数
  watermark_x_space = 50,//水印x轴间隔
  watermark_y_space = 50, //水印y轴间隔
  watermark_font = "微软雅黑",//水印字体
  watermark_color = "black",//水印字体颜色
  watermark_fontsize = '18px', //水印字体大小
  watermark_alpha = 0.15,//水印透明度，要求设置在大于等于0.005
  watermark_width = 100,//水印长度
  watermark_height = 100,//水印高度
  watermark_angle = 15, //水印倾斜度数
  watermark_parent_width = 0,//水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
  watermark_parent_height = 0,//水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
  watermark_parent_node = null,//水印插件挂载的父元素element,不输入则默认挂在body上
  monitor = true,  //monitor 是否监控， true: 不可删除水印; false: 可删水印。
```
常用属性有：`watermark_txt`,`watermark_color`,`watermark_fontsize`,`watermark_alpha`,`watermark_angle`，`watermark_width`,`watermark_height`

## 5、版本及功能
+ 版本v 1.0.0
    - 1、支持文本水印；
    - 2、支持本地js，未发布npm包；
    - 2、支持浏览器：Chrome，Firefox，Safari；
    - 3、支持api
    - 4、防删功能，监听前端页面手动删除水印挂载的父元素，或删除影子DOM里的单个水印，当删除时会自动添加新水印
    - 5、支持AMD，CommonJs，ES6 module模块规范；
    - 6、支持浏览器：Chrome，Firefox，Safari，IE9及以上； 

## 6、其他

欢迎使用[watermark-dom](https://github.com/saucxs/watermark-dom)插件，功能：给B/S网站系统加一个很浅的dom水印插件。

欢迎使用[captcha-mini](https://github.com/saucxs/captcha)插件，功能：生成验证码的插件，使用js和canvas生成的

欢迎使用[watermark-image](https://github.com/saucxs/watermark-image)插件，目前功能：图片打马赛克

一些使用文章介绍：

【1】https://juejin.im/post/5cb686f451882532c1535199

【2】http://www.chengxinsong.cn/post/34
