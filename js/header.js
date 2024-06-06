$(document).ready(function () {
  var $menuBtn = $('.header-nav-menubtn')
  var $menu = $('.header-nav-menu')
  var $menuItem = $('.header-nav-menu-item')
  var $submenu = $('.header-nav-submenu')
  var isMobile = $menuBtn.is(':visible')

  var isMenuShow = false
  var isSubmenuShow = false

  function resetMenuHeight() {
    $menuItem.velocity(
      {
        height: $menuItem.outerHeight()
      },
      {
        complete: function () {
          $submenu.css({ display: 'none', opacity: 0 })
        }
      }
    )
  }

  $(window).on(
    'resize',
    Stun.utils.throttle(function () {
      isMobile = $menuBtn.is(':visible')
      if (isMobile) {
        $submenu.removeClass('hide--force')

        if (isSubmenuShow) {
          resetMenuHeight()
          isSubmenuShow = false
        }
      } else {
        $submenu.css({ display: 'none', opacity: 0 })
      }
    }, 200)
  )

  var isNightModeFocus = true
  var $nightMode = $('.mode')

  $(document).on('click', function () {
    if ($menu.is(':visible')) {
      if (isMobile && isSubmenuShow) {
        resetMenuHeight()
        isSubmenuShow = false
      }
      $menu.css({ display: 'none' })
      isMenuShow = false
    }
    if (isNightModeFocus) {
      $nightMode.removeClass('mode--focus')
      isNightModeFocus = false
    }
  })

  Stun.utils.pjaxReloadHeader = function () {
    $menuBtn = $('.header-nav-menubtn')
    $menu = $('.header-nav-menu')
    $menuItem = $('.header-nav-menu-item')
    $submenu = $('.header-nav-submenu')
    isMobile = $menuBtn.is(':visible')

    isMenuShow = false
    isSubmenuShow = false

    function getNightMode() {
      var nightMode = false
      try {
        if (parseInt(Stun.utils.Cookies().get(NIGHT_MODE_COOKIES_KEY))) {
          nightMode = true
        }
      } catch (err) {
        /* empty */
      }
      return nightMode
    }

    if (CONFIG.nightMode && CONFIG.nightMode.enable) {
      var isNightMode = false
      var NIGHT_MODE_COOKIES_KEY = 'night_mode'
      $nightMode = $('.mode')
      isNightModeFocus = true

      if (getNightMode()) {
        $nightMode.addClass('mode--checked')
        $nightMode.addClass('mode--focus')
        $('html').addClass('nightmode')
        isNightMode = true
      } else {
        isNightMode = false
      }
      $('.mode').on('click', function (e) {
        e.stopPropagation()
        isNightMode = !isNightMode
        isNightModeFocus = true
        Stun.utils.Cookies().set(NIGHT_MODE_COOKIES_KEY, isNightMode ? 1 : 0)
        $nightMode.toggleClass('mode--checked')
        $nightMode.addClass('mode--focus')
        $('html').toggleClass('nightmode')
      })
    }

    $menuBtn.on('click', function (e) {
      e.stopPropagation()
      if (isMobile && isMenuShow && isSubmenuShow) {
        resetMenuHeight()
        isSubmenuShow = false
      }
      if (!isMenuShow) {
        isMenuShow = true
      } else {
        isMenuShow = false
      }
      $menu.velocity('stop').velocity(
        {
          opacity: isMenuShow ? 1 : 0
        },
        {
          duration: isMenuShow ? 200 : 0,
          display: isMenuShow ? 'block' : 'none'
        }
      )
    })

    // Whether to allow events to bubble in the menu.
    var isBubbleInMenu = false
    $('.header-nav-submenu-item').on('click', function () {
      isBubbleInMenu = true
    })

    $menuItem.on('click', function (e) {
      if (!isMobile) {
        return
      }
      var $submenu = $(this).find('.header-nav-submenu')
      if (!$submenu.length) {
        return
      }
      if (!isBubbleInMenu) {
        e.stopPropagation()
      } else {
        isBubbleInMenu = false
      }

      var menuItemHeight = $menuItem.outerHeight()
      var submenuHeight =
        menuItemHeight + Math.floor($submenu.outerHeight()) * $submenu.length
      var menuShowHeight = 0

      if ($(this).outerHeight() > menuItemHeight) {
        isSubmenuShow = false
        menuShowHeight = menuItemHeight
      } else {
        isSubmenuShow = true
        menuShowHeight = submenuHeight
      }
      $submenu.css({ display: 'block', opacity: 1 })
      // Accordion effect.
      $(this)
        .velocity('stop')
        .velocity({ height: menuShowHeight }, { duration: 300 })
        .siblings()
        .velocity({ height: menuItemHeight }, { duration: 300 })
    })

    $menuItem.on('mouseenter', function () {
      var $submenu = $(this).find('.header-nav-submenu')
      if (!$submenu.length) {
        return
      }
      if (!$submenu.is(':visible')) {
        if (isMobile) {
          $submenu.css({ display: 'block', opacity: 1 })
        } else {
          $submenu.removeClass('hide--force')
          $submenu
            .velocity('stop')
            .velocity('transition.slideUpIn', { duration: 200 })
        }
      }
    })

    $menuItem.on('mouseleave', function () {
      var $submenu = $(this).find('.header-nav-submenu')
      if (!$submenu.length) {
        return
      }
      if (!isMobile) {
        $submenu.addClass('hide--force')
        isSubmenuShow = false
      }
    })
  }

  Stun.utils.pjaxReloadScrollIcon = function () {
    if (CONFIG.header && CONFIG.header.scrollDownIcon) {
      $('.header-banner-arrow').on('click', function (e) {
        e.stopPropagation()
        $('#container').velocity('scroll', {
          offset: $('#header').outerHeight()
        })
      })
    }
  }

  // Initializaiton
  Stun.utils.pjaxReloadHeader()
  Stun.utils.pjaxReloadScrollIcon()

  const isNotJump = !!localStorage.getItem('not_jump')
  if (isNotJump) {
    return;
  }
  // add
  var url = window.location.href;
  var isPost = url.includes('/posts/');
  var jumpUrl = 'https://www.kitety.com/';
  if (isPost) {
    var allPostsData = [{ "title": "CS 61A(Part 10) - Tree Structure", "url": "article/cs-61a-10" }, { "title": "游览民大", "url": "article/smu-2023-04" }, { "title": "毕棚沟和双桥沟旅行记录", "url": "article/journey-2023-02" }, { "title": "Docker解压乱码问题修改", "url": "article/docker-lang" }, { "title": "网易新闻的2022年度盘点", "url": "article/netease-news-summary-2022" }, { "title": "MongoDB学习笔记", "url": "article/study-mongodb" }, { "title": "CS 61A(Part-8) - Sequences & Data Abstraction", "url": "article/cs-61a-8" }, { "title": "CS 61A(Part 7) - Recursion Example", "url": "article/cs-61a-7" }, { "title": "CS 61A(Part 6) - Recursion", "url": "article/cs-61a-6" }, { "title": "CS 61A(Part 5) - Higher Order Function", "url": "article/cs-61a-5" }, { "title": "CS 61 A (Part 4) - Environment Diagrams", "url": "article/cs-61a-4" }, { "title": "CS 61 A (Part 3) - Control", "url": "article/cs-61a-3" }, { "title": "CS 61 A (Part 2) - Function", "url": "article/cs-61a-2" }, { "title": "CS 61 A (Part 1) - Expression", "url": "article/cs-61a-1" }, { "title": "Mysql 学习笔记", "url": "article/mysql-study-note" }, { "title": "Nestjs学习笔记", "url": "article/nestjs-study-notes" }, { "title": "RXJS入门分享之Observable、Operators", "url": "article/observable-and-operators-shared-by-rxjs-entry" }, { "title": "oh-my-zsh中的git alias整理", "url": "article/git-alias-in-ohmyzsh" }, { "title": "RXJS学习", "url": "article/rxjs-learning" }, { "title": "记录一次前端报错的问题排查", "url": "article/record-a-front-end-error-troubleshooting" }, { "title": "足球诗人：贺炜经典解说台词语录", "url": "article/football-poet-he-weis-classic-commentary-poems" }, { "title": "关于画点连线的思考", "url": "article/thoughts-on-drawing-dotted-lines" }, { "title": "8个小技巧让你成为更好的开发", "url": "article/8-tips-to-make-you-a-better-developer" }, { "title": "2020年末启示", "url": "article/end-of-2020-inspiration" }, { "title": "VSCODE JS调试技巧", "url": "article/vscode-js-debugging-skills" }, { "title": "Git修改Commit信息", "url": "article/git-modify-commit-information" }, { "title": "实现自己的React之渲染Class Component", "url": "article/realize-your-own-react-rendering-class-component" }, { "title": "实现自己的React之渲染原生DOM", "url": "article/realize-your-own-react-rendering-native-dom" }, { "title": "实现自己的React之渲染字符串和数字", "url": "article/realize-your-own-react-rendering-strings-and-numbers" }, { "title": "实现自己的React之基础准备", "url": "article/basic-preparation-for-implementing-your-own-react" }, { "title": "Github在线IDE初体验", "url": "article/github-online-ide-first-experience" }, { "title": "Github和Gitee同步中的坑", "url": "article/pitfalls-in-github-and-gitee-synchronization" }, { "title": "请珍惜你的社交信用", "url": "article/please-cherish-your-social-credit" }, { "title": "TS学习及type-challenges实操", "url": "article/ts-learning-and-typechallenges-practice" }, { "title": "hexo添加动态背景", "url": "article/hexo-add-dynamic-background" }, { "title": "CICD实战之Jenkins构建前端镜像并上传到制品库", "url": "article/cicd-actual-combat-jenkins-builds-a-frontend-image-and-uploads-it-to-the-product-library" }, { "title": "CICD实战之Nexus制品库的介绍与安装", "url": "article/introduction-and-installation-of-nexus-product-library-cicd-actual-combat" }, { "title": "再学一次JS原型", "url": "article/learn-js-prototype-again" }, { "title": "CICD实战之Jenkins Gitlab 实现前端构建", "url": "article/cicd-actual-combat-jenkins-gitlab-to-achieve-frontend-construction" }, { "title": "CICD实战之Nginx搭建", "url": "article/cicd-actual-combat-nginx-construction" }, { "title": "CICD实战之Gitlab搭建", "url": "article/cicd-actual-combat-gitlab-construction" }, { "title": "CICD实战之Jenkins搭建", "url": "article/cicd-actual-combat-jenkins-construction" }, { "title": "CICD实战之基本介绍", "url": "article/basic-introduction-to-cicd-combat" }, { "title": "mysql基础知识（一）", "url": "article/mysql-basic-knowledge-1" }, { "title": "一首找了五年的歌", "url": "article/a-song-that-has-been-searched-for-five-years" }, { "title": "培养自己的主人翁意识", "url": "article/cultivate-your-own-sense-of-ownership" }, { "title": "CSS 伪类合集分享", "url": "article/css-pseudoclass-collection-sharing" }, { "title": "Your connection is not private | 您的连接不是私密连接的解决办", "url": "article/your-connection-is-not-private-solution" }, { "title": "Chrome Network面板解析", "url": "article/chrome-network-panel-analysis" }, { "title": "Chrome Console面板解析", "url": "article/chrome-console-panel-analysis" }, { "title": "HTTP协议原理笔记", "url": "article/http-protocol-principle-notes" }, { "title": "Chrome开发者工具总览", "url": "article/overview-of-chrome-developer-tools" }, { "title": "Chrome Elements面板解析", "url": "article/chrome-elements-panel-analysis" }, { "title": "走，再走一波干海子", "url": "article/go-another-wave-of-dry-sea" }, { "title": "春日的太阳", "url": "article/spring-sun" }, { "title": "JS箭头函数三连问：为何用、怎么用、何时用", "url": "article/three-consecutive-questions-about-js-arrow-functions-why-how-and-when" }, { "title": "Hello World", "url": "article/hello-world" }]
    const title = $('.post-title')
    if (title.length > 0) {
      const titleText = title.text();
      const data = allPostsData.find(item => item.title.includes(titleText))
      if (data && data.url) {
        jumpUrl += data.url
      }
    }
  }
  $.confirm({
    boxWidth: Math.min(500, document.body.clientWidth),
    useBootstrap: false,
    autoClose: "cancel|10000",
    closeIcon: true,
    title: "需要跳转吗？",
    content: "目前博客已经迁移到了新的地址，推荐您跳转到新地址!",
    buttons: {
      confirm: {
        text: "OK，立即跳转",
        btnClass: "btn-blue",
        action: function () {
          window.location.href = jumpUrl
        }
      },
      cancel: {
        text: "取消",
        action: function () { }
      },
      never: {
        text: "不再提醒",
        action: function () {
          localStorage.setItem('not_jump', 'not_jump')
        }
      }
    }
  });
})
