function fancyBoxFix() {
  setTimeout(() => {
    $(document)
      .find("img[data-original]")
      .each(function () {
        $(this).parent().attr("href", $(this).attr("data-original"));
      });
  });
}
$(function () {
  fancyBoxFix();
  // pjax
  // Pjax 完成后，重新加载上面的函数
  document.addEventListener("pjax:complete", function (e) {
    // 重载整个 JS 文件
    $("script.pjax-reload").each(function () {
      $(this).parent().append($(this).remove());
    });
    fancyBoxFix();
    if (typeof ga !== "undefined") {
      ga("set", "location", window.location.href);
      ga("send", "pageview");
    }
    // 一些话页面的刷新
    if (
      location.href.indexOf("shuoshuo") > -1 &&
      location.href.indexOf("#reloaded") == -1
    ) {
      location.href = location.href + "#reloaded";
      location.reload();
    }
    if (e && e.title === "请求的资源找不到了！| 别样") {
      window.location.reload();
    }
  });
});
