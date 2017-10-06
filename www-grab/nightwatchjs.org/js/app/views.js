domino.views.currentView = '';
domino.views.metaTagEl = document.getElementsByTagName('meta')[1];
domino.views.metaTagContent = domino.views.metaTagEl.content;

domino.views.metaTagTwitterImg = $('meta[name="twitter:image"]').attr('content');

domino.views.define('index', function(view) {

  this.indexView = function(view_script) {
    if (domino.views.currentView == 'index') {
      return;
    }
    view_script.no_render = true;
    view_script.$container = '#index-container';
    document.title = 'Nightwatch.js | Node.js powered End-to-End testing framework';

    this.initHelper('transition').render();
    this.initHelper('carbonad').render('#index-container');
    domino.views.currentView = 'index';
    if (document.documentElement.getAttribute('data-uri') != '../index.html') {
      document.documentElement.setAttribute('data-uri', '../index.html');
    }
  };

});
$('.carbonad').on('click', 'a', function(ev) {
  ev.stopPropagation();
});

domino.views.define('gettingstarted', function(view) {
  this.indexView = function(view_script) {
    if (domino.views.currentView == 'gettingstarted') {
      return;
    }

    view_script.$container = '#gettingstarted-container';
    view_script.no_render = true;
    document.title = 'Getting%20Started%20_%20Nightwatch.html';

    this.initHelper('transition').render();
    this.initHelper('bs.scrollspy').render({
      target : '#gettingstarted-container .bs-sidebar',
      offset : 85
    });

    this.initHelper('sidebar').render('#gettingstarted-container');
    this.initHelper('carbonad').render('#gettingstarted-container');
    domino.views.currentView = 'gettingstarted';
    if (document.documentElement.getAttribute('data-uri') != '/gettingstarted') {
      document.documentElement.setAttribute('data-uri', '/gettingstarted');
    }
  };
});

domino.views.define('guide', function(view) {

  this.init = function() {};

  this.indexView = function(view_script) {
    if (domino.views.currentView == 'guide') {
      return;
    }
    view_script.$container = '#guide-container';
    view_script.no_render = true;
    document.title = 'Developer%20Guide%20_%20Nightwatch.html';

    this.initHelper('transition').render();
    this.initHelper('bs.scrollspy').render({
      target : '#guide-container .bs-sidebar',
      offset : 50
    });

    this.initHelper('sidebar').render('#guide-container');
    this.initHelper('carbonad').render('#guide-container');
    domino.views.currentView = 'guide';
    if (document.documentElement.getAttribute('data-uri') != '/guide') {
      document.documentElement.setAttribute('data-uri', '/guide');
    }
  };

});

domino.views.define('api', function(view) {
  this.init = function() {
    this.transition = this.initHelper('transition');
    this.carbonAds = this.initHelper('carbonad');
    this.sourcecolor = this.initHelper('sourcecolor')
  };

  function api(view_script, scollspy) {
    view_script.$container = '#api-container';

    this.initHelper('transition').render(function() {
      if (scollspy) {
        this.initHelper('bs.scrollspy').render({
          target : '#api-container .bs-sidebar',
          offset : 580,
          spyAttribute : 'data-spy'
        });

        this.initHelper('sourcecolor').render();
        this.initHelper('sidebar').render('#api-container');
      }


    }, view_script);
  }

  this.methodView = function(view_script) {
    window.scrollTo(0, 0);

    domino.views.currentView = '$method';

    view_script.$container = '#apimethod-container';
    //view_script.no_render = true;

    document.title = (this.$scope && this.$scope.methodName ? this.$scope.methodName + ' | ' : '') + 'API Reference | Nightwatch.js';

    this.transition.render();

    setTimeout(function() {
      if ($('ul li[name="'+ this.$scope.methodName +'"]').length > 0) {
        var $top = $('ul li[name="'+ this.$scope.methodName +'"]')[0].offsetTop - 90;
        if ($top > 100) {
          $('#protocol-menu')[0].scrollTop = $top;
        }
      }
    }.bind(this), 500);

    if ($('#apimethod-container .carbonad').length) {
      this.carbonAds.render('#apimethod-container');
      this.sourcecolor.render();
    } else {
      var self = this;
      $('body').on('DOMNodeInserted', '#apimethod-container', function listener(ev) {
        if (ev.target === $('#apimethod-container .jumbotron')[0]) {
          self.carbonAds.render('#apimethod-container');
          self.sourcecolor.render();
          $('body').off('DOMNodeInserted', '#apimethod-container');
        }
      });
    }

    if (this.$scope.method && this.$scope.method.descr) {
      domino.views.metaTagEl.content = this.$scope.method.descr.replace(/<\/?[^>]+(>|$)/g, '') + ' | API Reference - Nightwatch.js';
    }

    if (document.documentElement.getAttribute('data-uri') != '/api/$method') {
      document.documentElement.setAttribute('data-uri', '/api/$method');
    }

  };

  this.indexView = function(view_script) {
    //window.scrollTo(0, 0);
    if (domino.views.currentView == 'api') {
      return;
    }
    document.title = 'API%20Reference%20_%20Nightwatch.html';
    view_script.no_render = true;

    this.initHelper('transition').render();
    this.initHelper('bs.scrollspy').render({
      target : '#api-container .bs-sidebar',
      offset : 50
    });

    this.initHelper('sidebar').render('#api-container');
    this.initHelper('carbonad').render('#api-container');
    domino.views.currentView = 'api';
    if (document.documentElement.getAttribute('data-uri') != '/api') {
      document.documentElement.setAttribute('data-uri', '/api');
    }
  };

});

domino.views.define('contact', function(view) {

  this.indexView = function(view_script) {
    if (domino.views.currentView == 'contact') {
      return;
    }
    window.scrollTo(0, 0);
    view_script.$container = '#contact-container';
    view_script.no_render = true;
    document.title = 'Contact%20_%20Nightwatch.html';
    domino.views.metaTagEl.content = 'Contact - ' + domino.views.metaTagContent;
    this.initHelper('transition').render();
    this.initHelper('carbonad').render('#contact-container');
    domino.views.currentView = 'contact';
    if (document.documentElement.getAttribute('data-uri') != '/contact') {
      document.documentElement.setAttribute('data-uri', '/contact');
    }
  };

});

domino.viewhelpers.define('sidebar', function() {

  this.init = function() {
    this.sideBar = null;
  };

  this.render = function(container) {
    if (this.sideBar) {
      this.sideBar.data('bs.affix', null);
      this.sideBar = null;
    }

    this.sideBar = $(container).find('.bs-sidebar');
    this.sideBar.affix({
      offset: {
        top: 180,
        bottom: 100
      }
    });
  };

});

domino.viewhelpers.define('bs.scrollspy', function() {
  this.init = function(element) {
    element = element || $(document.body);
    if (!(element instanceof jQuery)) {
      element = $(element);
    }
    this.spyElem = element;
  };

  this.render = function(opts) {
    if (this.spyElem.data('bs.scrollspy')) {
      $(opts.target).off('click');
      this.spyElem.data('bs.scrollspy', null);
    }


    $(opts.target).on('click', 'a', function(ev) {
      ev.stopPropagation();
    });

    this.spyElem.scrollspy(opts);
  };
});


domino.viewhelpers.define('sourcecolor', function() {
  this.render = function(element) {
    setTimeout(function() {
      Prism.highlightAll();
    }, 0);
  };
});

domino.viewhelpers.define('carbonad', function() {

  this.render = function(selector) {
    $('.carbonad').html('');
    $('#_carbonads_projs').remove();

    $('link').eq(5).nextAll('script').each(function() {
      if (this.src.indexOf('twitter.com') === -1) {
        $(this).remove();
      }
    })

    var carbonAd = document.createElement('script');
    carbonAd.async = true;
    carbonAd.setAttribute('type', 'text/javascript');
    carbonAd.setAttribute('id', '_carbonads_js');

    setTimeout(function() {
      carbonAd.setAttribute('src', 'http://cdn.carbonads.com/carbon.js?zoneid=1673&amp;serve=C6AILKT&amp;placement=nightwatchjsorg');
      $(selector + ' .carbonad').append(carbonAd);
    }.bind(this), 0);
  };
});

domino.viewhelpers.define('transition', function() {

  this.render = function(callback, opts) {
    var pathname = location.pathname;
    var currentSectionPath = '../index.html';

    if (pathname != "../index.html") {
      var parts = pathname.split('../index.html');
      parts.shift();
      parts = parts.map(function(a){
        return a.replace(/.+\.html$/,'$method')
      });
      pathname = '/' + parts[0];
      currentSectionPath = '/' + parts.join('../index.html');
    }

    var currentMenuItem = $('.navbar ul li.active');
    var activeMenuItem = $('.navbar ul li a[href="'+ pathname +'"]').parent();
    if (currentMenuItem !== activeMenuItem) {
      currentMenuItem.removeClass('active');
      activeMenuItem.addClass('active');
    }

    var $view = this.view;

    var currentSection = $('section[data-page-uri]:visible');
    var element = $('section[data-page-uri="'+ currentSectionPath +'"]');

    if (currentSection.get(0) === element.get(0)) {
      if (typeof callback == 'function') {
        opts.render = function renderModified() {
          callback.call($view);
        };
      }
      return;
    }

    currentSection.hide();
    window.scrollTo(0, 0);
    element.fadeIn('normal', function() {
      if (typeof callback == 'function') {
        return callback.call($view);
      }
    });
  };
});
