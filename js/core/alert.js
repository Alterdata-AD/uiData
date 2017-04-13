/*! uiData 0.5 | http://uidata.alterdata.com.br | (c) 2017 Alterdata Software | MIT License */
(function(UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            fade: true,
            duration: 200,
            trigger: '.ud-alert-close'
        },

        boot: function() {

            // init code
            UI.$html.on('click.alert.uidata', '[data-ud-alert]', function(e) {

                var ele = UI.$(this);

                if (!ele.data('alert')) {

                    var alert = UI.alert(ele, UI.Utils.options(ele.attr('data-ud-alert')));

                    if (UI.$(e.target).is(alert.options.trigger)) {
                        e.preventDefault();
                        alert.close();
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on('click', this.options.trigger, function(e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function() {

            var element       = this.trigger('close.ud.alert'),
                removeElement = function () {
                    this.trigger('closed.ud.alert').remove();
                }.bind(this);

            if (this.options.fade) {
                element.css('overflow', 'hidden').css("max-height", element.height()).animate({
                    height         : 0,
                    opacity        : 0,
                    paddingTop    : 0,
                    paddingBottom : 0,
                    marginTop     : 0,
                    marginBottom  : 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }
        }

    });

})(UIData);
