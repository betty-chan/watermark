+function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    /* AMD. Register as an anonymous module.
    *  define([], factory);
    */
    define([], factory());
  } else if (typeof module === 'object' && module.exports) {
    /*Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.*/
    module.exports = factory();
  } else {
    /*Browser globals (root is window)*/
    root['watermark'] = factory();
  }
}(this, function () {
  /*全局变量声明*/
  var watermark = {}
  var globalSetting;
  var watermarkDom;
  /*初始化水印，添加load和resize事件*/
  watermark.init = function ({
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
  }) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    watermarkDom = new MutationObserver(callback);
    globalSetting = {
      watermark_id,
      watermark_prefix,
      watermark_txt,
      watermark_x,
      watermark_y,
      watermark_rows,
      watermark_cols,
      watermark_x_space,
      watermark_y_space,
      watermark_font,
      watermark_color,
      watermark_fontsize,
      watermark_alpha,
      watermark_width,
      watermark_height,
      watermark_angle,
      watermark_parent_width,
      watermark_parent_height,
      watermark_parent_node,
      monitor,
    };
    loadMark();
    window.addEventListener('onload', loadMark);
    window.addEventListener('resize', loadMark);
  };
  //移除水印
  watermark.remove = function remove() {
    watermarkDom.disconnect();
    window.removeEventListener('onload', loadMark);
    window.removeEventListener('resize', loadMark)
    var watermark_element = document.getElementById(globalSetting.watermark_id);
    var _parentElement = watermark_element.parentNode;
    _parentElement.removeChild(watermark_element);
  };
  //加载水印
  function loadMark() {
    var watermark_element = document.getElementById(globalSetting.watermark_id);
    //如果元素存在则移除
    watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element);
    //设置水印挂载的父元素的id
    var watermark_parent_element = document.getElementById(globalSetting.watermark_parent_node);
    var watermark_hook_element = watermark_parent_element || document.body;
    //获取页面宽度
    var page_width = Math.max(watermark_hook_element.scrollWidth, watermark_hook_element.clientWidth);
    //获取页面长度
    var page_height = Math.max(watermark_hook_element.scrollHeight, watermark_hook_element.clientHeight);
    var page_offsetTop = 0, page_offsetLeft = 0;
    if (watermark_hook_element) {
      page_offsetTop = watermark_hook_element.offsetTop || 0;
      page_offsetLeft = watermark_hook_element.offsetLeft || 0;
      if (globalSetting.watermark_parent_width || globalSetting.watermark_parent_height) {
        globalSetting.watermark_x = globalSetting.watermark_x + page_offsetLeft;
        globalSetting.watermark_y = globalSetting.watermark_y + page_offsetTop;
      }
    }
    //创建水印外壳div
    var otdiv = document.getElementById(globalSetting.watermark_id);
    var shadowRoot = null;
    if (!otdiv) {
      otdiv = document.createElement('div');
      otdiv.id = globalSetting.watermark_id;
      otdiv.setAttribute('style', 'pointer-events: none !important; display: block !important');
      /*判断浏览器是否支持attachShadow方法*/
      if (typeof otdiv.attachShadow === 'function') {
        shadowRoot = otdiv.attachShadow({ mode: 'open' });
      } else {
        shadowRoot = otdiv;
      }
      /*将shadow dom随机插入body内的任意位置*/
      var nodeList = watermark_hook_element.children;
      var index = Math.floor(Math.random() * (nodeList.length - 1));
      if (nodeList[index]) {
        watermark_hook_element.insertBefore(otdiv, nodeList[index]);
      } else {
        watermark_hook_element.appendChild(otdiv);
      }
    } else if (otdiv.shadowRoot) {
      shadowRoot = otdiv.shadowRoot;
    }

    /*三种情况下会重新计算水印列数和x方向水印间隔：1、水印列数设置为0，2、水印宽度大于页面宽度，3、水印宽度小于于页面宽度*/
    globalSetting.watermark_cols = parseInt((page_width - globalSetting.watermark_x) / (globalSetting.watermark_width + globalSetting.watermark_x_space));
    var temp_watermark_x_space = parseInt((page_width - globalSetting.watermark_x - globalSetting.watermark_width * globalSetting.watermark_cols) / (globalSetting.watermark_cols));
    globalSetting.watermark_x_space = temp_watermark_x_space ? globalSetting.watermark_x_space : temp_watermark_x_space;
    /*三种情况下会重新计算水印行数和y方向水印间隔：1、水印行数设置为0，2、水印长度大于页面长度，3、水印长度小于于页面长度*/
    globalSetting.watermark_rows = parseInt((page_height - globalSetting.watermark_y) / (globalSetting.watermark_height + globalSetting.watermark_y_space));
    var temp_watermark_y_space = parseInt((page_height - globalSetting.watermark_y - globalSetting.watermark_height * globalSetting.watermark_rows) / (globalSetting.watermark_rows));
    globalSetting.watermark_y_space = temp_watermark_y_space ? globalSetting.watermark_y_space : temp_watermark_y_space;

    var allWatermarkWidth, allWatermarkHeight;
    allWatermarkWidth = globalSetting.watermark_x + globalSetting.watermark_width * globalSetting.watermark_cols + globalSetting.watermark_x_space * (globalSetting.watermark_cols - 1);
    allWatermarkHeight = globalSetting.watermark_y + globalSetting.watermark_height * globalSetting.watermark_rows + globalSetting.watermark_y_space * (globalSetting.watermark_rows - 1);
    if (!watermark_parent_element) {
      allWatermarkWidth += page_offsetLeft;
      allWatermarkHeight += page_offsetTop;
    }

    var x, y;
    for (var i = 0; i < globalSetting.watermark_rows; i++) {
      y = globalSetting.watermark_y + (page_height - allWatermarkHeight) / 2 + (globalSetting.watermark_y_space + globalSetting.watermark_height) * i;
      if (watermark_parent_element) {
        y += page_offsetTop;
      }
      for (var j = 0; j < globalSetting.watermark_cols; j++) {
        x = globalSetting.watermark_x + (page_width - allWatermarkWidth) / 2 + (globalSetting.watermark_x_space + globalSetting.watermark_width) * j;
        if (watermark_parent_element) {
          x += page_offsetLeft;
        }
        shadowRoot.appendChild(setDiv(globalSetting.watermark_prefix + i + j, x, y));
      }
    }

    if (globalSetting.monitor) {
      let option = {
        'childList': true,
        'attributes': true,
        'subtree': true,
        'attributeFilter': ['style'],
        'attributeOldValue': true
      };
      watermarkDom.observe(watermark_hook_element, option);
      watermarkDom.observe(document.getElementById(globalSetting.watermark_id).shadowRoot, option);
    }
  };
  //设置水印Div
  function setDiv(id, x, y) {
    var mask_div = document.createElement('div');
    mask_div.id = id;
    mask_div.style.left = x + 'px';
    mask_div.style.top = y + 'px';
    mask_div.appendChild(document.createTextNode(globalSetting.watermark_txt));
    mask_div.style.MozTransform = "rotate(-" + globalSetting.watermark_angle + "deg)";
    mask_div.style.msTransform = "rotate(-" + globalSetting.watermark_angle + "deg)";
    mask_div.style.OTransform = "rotate(-" + globalSetting.watermark_angle + "deg)";
    mask_div.style.transform = "rotate(-" + globalSetting.watermark_angle + "deg)";
    mask_div.style.position = "absolute";
    mask_div.style.overflow = "hidden";
    mask_div.style.zIndex = "9999999";
    mask_div.style.opacity = globalSetting.watermark_alpha;
    mask_div.style.fontSize = globalSetting.watermark_fontsize;
    mask_div.style.fontFamily = globalSetting.watermark_font;
    mask_div.style.color = globalSetting.watermark_color;
    mask_div.style.textAlign = "center";
    mask_div.style.width = globalSetting.watermark_width + 'px';
    mask_div.style.height = globalSetting.watermark_height + 'px';
    mask_div.style.display = "block";
    mask_div.style['-ms-user-select'] = "none";
    return mask_div;
  }
  //监听dom是否改变回调函数
  function callback(records) {
    if ((globalSetting && records.length === 1) || records.length === 1 && records[0].removedNodes.length >= 1) {
      loadMark();
      return;
    }
    // 监听父节点的尺寸是否发生了变化, 如果发生改变, 则进行重新绘制
    var watermark_parent_element = document.getElementById(globalSetting.watermark_parent_node);
    var recordOldValue = {
      width: 0,
      height: 0
    }
    if (watermark_parent_element) {
      var newWidth = getComputedStyle(watermark_parent_element).getPropertyValue('width');
      var newHeight = getComputedStyle(watermark_parent_element).getPropertyValue('height');
      if (newWidth !== recordOldValue.width || newHeight !== recordOldValue.height) {
        recordOldValue.width = newWidth;
        recordOldValue.height = newHeight;
        loadMark();
      }
    }
  };
  return watermark;
});