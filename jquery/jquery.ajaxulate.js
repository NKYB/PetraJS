/*
 *  Project: jQuery ajaxULate
 *  Description: cross domain jsonP generic ajax request
 *  Author: eel
 *  License: EPv2
 *  
 *  PHP Example
 *  
 *  <?php
 *  $callback = htmlentities($_GET['callback']); 
 *  $action = htmlentities($_GET['action']);
 *  $data = htmlentities($_GET['data']);
 *  header('Content-type: application/javascript');
 *  echo $callback . "(" . return_data_REPLACE_WITH_YOUR_CODE . ");";
 */
;(function ( $, window, document, undefined ) {
    var pluginName = "ajaxULate";
    var defaults = {
        url: 'ajax.php',
        action: '',
        json: '',
        data: {},
        dataType: 'jsonp',
        success_handler: function(){},
        error_handler: function(){}
    };
    
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    
    Plugin.prototype = {
        init: function(){
            var jsonpCallback = 'jsonpCallback_' + Math.floor((Math.random()*99999999)+10000000);
            $.ajax({
                url: this.options.url,
                dataType: this.options.dataType,
                jsonpCallback: jsonpCallback,
                contentType: 'application/javascript',
                context: this,
                data: {
                    action:     this.options.action, 
                    json:       this.options.json,
                    data:       this.options.data
                },
                success: function(response){
                    this.options.success_handler(response);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    this.options.error_handler(jqXHR, textStatus, errorThrown);
                }
            });
        }
    };

    $.fn[pluginName] = function ( options ) {
        return new Plugin( this, options );
    };

})( jQuery, window, document );