/*
 *  Project: jQuery Formulate
 *  Description: Forms Framework
 *  Author: eel
 *  License: EPv2
 */
;(function ( $, window, document, undefined ) {
    var pluginName = "tempULate";
    var defaults = {
        el: 'body',
        name: 'header',
        url: 'template.php',
        params: {},
        action: 'replace'
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
            console.log('brr: ',this._name, this.options.name);
            
            $.ajax({
                context:this,
                url: this.options.url,
                type: 'POST',
                data: {
                    template_name:      this.options.name, 
                    json:               JSON.stringify(this.options.params)
                }
            }).done(function( response ) {
                switch(this.options.action){
                    case 'replace':
                        $(this.options.el).html( response );
                        break;
                    case 'prepend':
                        $(this.options.el).prepend( response );
                        break;
                    case 'append':
                        $(this.options.el).append( response );
                        break;
                };
            });
        }
    };

    $.fn[pluginName] = function ( options ) {
        return new Plugin( this, options );
    };

})( jQuery, window, document );