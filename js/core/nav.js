/*! uiData 0.5 | http://uidata.alterdata.com.br | (c) 2017 Alterdata Software | MIT License */
(function(UI) {

    "use strict";

    UI.component('nav', {

        defaults: {
            toggle: '>li.ud-parent > a[href="#"]',
            lists: '>li.ud-parent > ul',
            multiple: false
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-ud-nav]', context).each(function() {
                    var nav = UI.$(this);

                    if (!nav.data('nav')) {
                        var obj = UI.nav(nav, UI.Utils.options(nav.attr('data-ud-nav')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on('click.ud.nav', this.options.toggle, function(e) {
                e.preventDefault();
                var ele = UI.$(this);
                $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
            });

            this.update();

            UI.domObserve(this.element, function(e) {
                if ($this.element.find($this.options.lists).not('[role]').length) {
                    $this.update();
                }
            });
        },

        update: function() {

            var $this = this;

            this.find(this.options.lists).each(function() {

                var $ele   = UI.$(this).attr('role', 'menu'),
                    parent = $ele.closest('li'),
                    active = parent.hasClass("ud-active");

                if (!parent.data('list-container')) {
                    $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
                    parent.data('list-container', $ele.parent()[active ? 'removeClass':'addClass']('ud-hidden'));
                }

                // Init ARIA
                parent.attr('aria-expanded', parent.hasClass("ud-open"));

                if (active) $this.open(parent, true);
            });
        },

        open: function(li, noanimation) {

            var $this = this, element = this.element, $li = UI.$(li), $container = $li.data('list-container');

            if (!this.options.multiple) {

                element.children('.ud-open').not(li).each(function() {

                    var ele = UI.$(this);

                    if (ele.data('list-container')) {
                        ele.data('list-container').stop().animate({height: 0}, function() {
                            UI.$(this).parent().removeClass('ud-open').end().addClass('ud-hidden');
                        });
                    }
                });
            }

            $li.toggleClass('ud-open');

            // Update ARIA
            $li.attr('aria-expanded', $li.hasClass('ud-open'));

            if ($container) {

                if ($li.hasClass('ud-open')) {
                    $container.removeClass('ud-hidden');
                }

                if (noanimation) {

                    $container.stop().height($li.hasClass('ud-open') ? 'auto' : 0);

                    if (!$li.hasClass('ud-open')) {
                        $container.addClass('ud-hidden');
                    }

                    this.trigger('display.ud.check');

                } else {

                    $container.stop().animate({
                        height: ($li.hasClass('ud-open') ? getHeight($container.find('ul:first')) : 0)
                    }, function() {

                        if (!$li.hasClass('ud-open')) {
                            $container.addClass('ud-hidden');
                        } else {
                            $container.css('height', '');
                        }

                        $this.trigger('display.ud.check');
                    });
                }
            }
        }
    });


    // helper

    function getHeight(ele) {

        var $ele = UI.$(ele), height = 'auto';

        if ($ele.is(':visible')) {
            height = $ele.outerHeight();
        } else {

            var tmp = {
                position: $ele.css('position'),
                visibility: $ele.css('visibility'),
                display: $ele.css('display')
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

})(UIData);
