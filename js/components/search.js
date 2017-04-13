/*! uiData 0.5 | http://uidata.alterdata.com.br | (c) 2017 Alterdata Software | MIT License */
(function(addon) {

    var component;

    if (window.UIData) {
        component = addon(UIData);
    }

    if (typeof define == 'function' && define.amd) {
        define('uidata-search', ['uidata'], function(){
            return component || addon(UIData);
        });
    }

})(function(UI){

    "use strict";

    UI.component('search', {
        defaults: {
            msgResultsHeader   : 'Search Results',
            msgMoreResults     : 'More Results',
            msgNoResults       : 'No results found',
            template           : '<ul class="ud-nav ud-nav-search ud-autocomplete-results">\
                                      {{#msgResultsHeader}}<li class="ud-nav-header ud-skip">{{msgResultsHeader}}</li>{{/msgResultsHeader}}\
                                      {{#items && items.length}}\
                                          {{~items}}\
                                          <li data-url="{{!$item.url}}">\
                                              <a href="{{!$item.url}}">\
                                                  {{{$item.title}}}\
                                                  {{#$item.text}}<div>{{{$item.text}}}</div>{{/$item.text}}\
                                              </a>\
                                          </li>\
                                          {{/items}}\
                                          {{#msgMoreResults}}\
                                              <li class="ud-nav-divider ud-skip"></li>\
                                              <li class="ud-search-moreresults" data-moreresults="true"><a href="#" onclick="jQuery(this).closest(\'form\').submit();">{{msgMoreResults}}</a></li>\
                                          {{/msgMoreResults}}\
                                      {{/end}}\
                                      {{^items.length}}\
                                        {{#msgNoResults}}<li class="ud-skip"><a>{{msgNoResults}}</a></li>{{/msgNoResults}}\
                                      {{/end}}\
                                  </ul>',

            renderer: function(data) {

                var opts = this.options;

                this.dropdown.append(this.template({items:data.results || [], msgResultsHeader:opts.msgResultsHeader, msgMoreResults: opts.msgMoreResults, msgNoResults: opts.msgNoResults}));
                this.show();
            }
        },

        boot: function() {

            // init code
            UI.$html.on('focus.search.uidata', '[data-ud-search]', function(e) {
                var ele =UI.$(this);

                if (!ele.data('search')) {
                    UI.search(ele, UI.Utils.options(ele.attr('data-ud-search')));
                }
            });
        },

        init: function() {
            var $this = this;

            this.autocomplete = UI.autocomplete(this.element, this.options);

            this.autocomplete.dropdown.addClass('ud-dropdown-search');

            this.autocomplete.input.on("keyup", function(){
                $this.element[$this.autocomplete.input.val() ? 'addClass':'removeClass']('ud-active');
            }).closest("form").on("reset", function(){
                $this.value = '';
                $this.element.removeClass('ud-active');
            });

            this.on('selectitem.ud.autocomplete', function(e, data) {
                if (data.url) {
                  location.href = data.url;
                } else if(data.moreresults) {
                  $this.autocomplete.input.closest('form').submit();
                }
            });

            this.element.data('search', this);
        }
    });
});
