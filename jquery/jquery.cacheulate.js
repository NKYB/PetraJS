/*
 *  Project: jQuery cacheULate
 *  Description: cross domain jsonP get cache value
 *  Author: eel
 *  License: EPv2
 *  
 *  Requires: jquery.ajaxulate.js
 *  
 *  Examples
 *  $.cacheULate({url:window.app.URL_PHP_MODELS, key: 'key', json: {value: 'this is a value'}});
 *  $.cacheULate({url:window.app.URL_PHP_MODELS, key: 'key'});
 */
;(function($) {
    $.cacheULate = function(options) {
        var defaults = {
            expired: 4000,
            url: 'ajax.php',
            key: 'default',
            json: {},
            success_handler: function(){},
            error_handler: function(){}
        };
        this.options = $.extend( {}, defaults, options );
        $().ajaxULate({
            url: this.options.url,
            action: 'cache',
            json: JSON.stringify({key: this.options.key, json: this.options.json}),
            success_handler: $.proxy(function(response){
                this.options.success_handler(response);
            },this),
            error_handler: $.proxy(function(jqXHR, textStatus, errorThrown){
                this.options.error_handler(jqXHR, textStatus, errorThrown);
            },this)
        });
    }
})( jQuery);