/*! uiData 0.5 | http://uidata.alterdata.com.br | (c) 2017 Alterdata Software | MIT License */
(function(addon) {

    var component;

    if (window.UIData) {
        component = addon(UIData);
    }

    if (typeof define == 'function' && define.amd) {
        define('uidata-form-select', ['uidata'], function(){
            return component || addon(UIData);
        });
    }

})(function(UI){

    "use strict";

    UI.component('formSelect', {

        defaults: {
            target: '>span:first',
            activeClass: 'ud-active'
        },

        boot: function() {
            // init code
            UI.ready(function(context) {

                UI.$('[data-ud-form-select]', context).each(function(){

                    var ele = UI.$(this);

                    if (!ele.data('formSelect')) {
                        UI.formSelect(ele, UI.Utils.options(ele.attr('data-ud-form-select')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.target  = this.find(this.options.target);
            this.select  = this.find('select');

            // init + on change event
            this.select.on({

                change: (function(){

                    var select = $this.select[0], fn = function(){

                        try {

                            if($this.options.target === 'input') {
                                $this.target.val(select.options[select.selectedIndex].text);
                            } else {
                                $this.target.text(select.options[select.selectedIndex].text);
                            }

                        } catch(e) {}

                        $this.element[$this.select.val() ? 'addClass':'removeClass']($this.options.activeClass);

                        return fn;
                    };

                    return fn();
                })(),

                focus: function(){ $this.target.addClass('ud-focus') },
                blur: function(){ $this.target.removeClass('ud-focus') },
                mouseenter: function(){ $this.target.addClass('ud-hover') },
                mouseleave: function(){ $this.target.removeClass('ud-hover') }
            });

            this.element.data("formSelect", this);
        }
    });

    return UI.formSelect;
});
