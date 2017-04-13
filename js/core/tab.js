/*! uiData 0.5 | http://uidata.alterdata.com.br | (c) 2017 Alterdata Software | MIT License */
(function(UI) {

    "use strict";

    UI.component('tab', {

        defaults: {
            target    : '>li:not(.ud-tab-responsive, .ud-disabled)',
            connect   : false,
            active    : 0,
            animation : false,
            duration  : 200,
            swiping   : true
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-ud-tab]', context).each(function() {

                    var tab = UI.$(this);

                    if (!tab.data('tab')) {
                        var obj = UI.tab(tab, UI.Utils.options(tab.attr('data-ud-tab')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.current = false;

            this.on('click.ud.tab', this.options.target, function(e) {

                e.preventDefault();

                if ($this.switcher && $this.switcher.animating) {
                    return;
                }

                var current = $this.find($this.options.target).not(this);

                current.removeClass('ud-active').blur();

                $this.trigger('change.ud.tab', [UI.$(this).addClass('ud-active'), $this.current]);

                $this.current = UI.$(this);

                // Update ARIA
                if (!$this.options.connect) {
                    current.attr('aria-expanded', 'false');
                    UI.$(this).attr('aria-expanded', 'true');
                }
            });

            if (this.options.connect) {
                this.connect = UI.$(this.options.connect);
            }

            // init responsive tab
            this.responsivetab = UI.$('<li class="ud-tab-responsive ud-active"><a></a></li>').append('<div class="ud-dropdown ud-dropdown-small"><ul class="ud-nav ud-nav-dropdown"></ul><div>');

            this.responsivetab.dropdown = this.responsivetab.find('.ud-dropdown');
            this.responsivetab.lst      = this.responsivetab.dropdown.find('ul');
            this.responsivetab.caption  = this.responsivetab.find('a:first');

            if (this.element.hasClass('ud-tab-bottom')) this.responsivetab.dropdown.addClass('ud-dropdown-up');

            // handle click
            this.responsivetab.lst.on('click.ud.tab', 'a', function(e) {

                e.preventDefault();
                e.stopPropagation();

                var link = UI.$(this);

                $this.element.children('li:not(.ud-tab-responsive)').eq(link.data('index')).trigger('click');
            });

            this.on('show.ud.switcher change.ud.tab', function(e, tab) {
                $this.responsivetab.caption.html(tab.text());
            });

            this.element.append(this.responsivetab);

            // init UIData components
            if (this.options.connect) {
                
                this.switcher = UI.switcher(this.element, {
                    toggle    : '>li:not(.ud-tab-responsive)',
                    connect   : this.options.connect,
                    active    : this.options.active,
                    animation : this.options.animation,
                    duration  : this.options.duration,
                    swiping   : this.options.swiping
                });
            }

            UI.dropdown(this.responsivetab, {mode: 'click', preventflip: 'y'});

            // init
            $this.trigger('change.ud.tab', [this.element.find(this.options.target).not('.ud-tab-responsive').filter('.ud-active')]);

            this.check();

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function(){
                if ($this.element.is(':visible'))  $this.check();
            }, 100));

            this.on('display.ud.check', function(){
                if ($this.element.is(':visible'))  $this.check();
            });
        },

        check: function() {

            var children = this.element.children('li:not(.ud-tab-responsive)').removeClass('ud-hidden');

            if (!children.length) {
                this.responsivetab.addClass('ud-hidden');
                return;
            }

            var top          = (children.eq(0).offset().top + Math.ceil(children.eq(0).height()/2)),
                doresponsive = false,
                item, link, clone;

            this.responsivetab.lst.empty();

            children.each(function(){

                if (UI.$(this).offset().top > top) {
                    doresponsive = true;
                }
            });

            if (doresponsive) {

                for (var i = 0; i < children.length; i++) {

                    item  = UI.$(children.eq(i));
                    link  = item.find('a');

                    if (item.css('float') != 'none' && !item.attr('ud-dropdown')) {

                        if (!item.hasClass('ud-disabled')) {

                            clone = UI.$(item[0].outerHTML);
                            clone.find('a').data('index', i);

                            this.responsivetab.lst.append(clone);
                        }

                        item.addClass('ud-hidden');
                    }
                }
            }

            this.responsivetab[this.responsivetab.lst.children('li').length ? 'removeClass':'addClass']('ud-hidden');
        }
    });

})(UIData);
