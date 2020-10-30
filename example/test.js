(function () {
    var showMarkText = "测试水印11111";
    var showText = showMarkText + window.location.host;
    watermark.init({ watermark_txt: showText, watermark_width: 300 });
    setTimeout(() => {
        watermark.remove()
    }, 10000)
})()