/*
 *  Project: jQuery linkULate
 *  Description: Link Validator Cross Site
 *  Author: eel
 *  License: EPv2
 */
;(function ( $, window, document, undefined ) {
    var pluginName = "linkULate";
    var defaults = {
        render_msg:         true,
        msg_parent_el:      '',
        msg_el_id:          pluginName + '_' + Math.floor((Math.random()*99999999)+10000000),
        timeout:            4000,
        style_error:        'margin: 10px;color: red;',
        style_success:      'margin: 10px;color: green;',
        msg_too_short:      'Invalid Link: The link is too short.',
        msg_invalid_format: 'Invalid Link: The link has a invalid format. (required: http:// https://)',
        msg_broken_link:    'Broken Link: Link could not be found.',
        msg_timeout:        'Link Timeout: Link could not be reached in under 4 seconds.',
        msg_valid_link:     'Valid link.'
    };
    
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.valid_status = false;
        this.init();
    }
    
    Plugin.prototype = {
        init: function(el){
            if (this.options.msg_parent_el == ''){
                $(this.element).after( '<span id="' + this.options.msg_el_id + '" style="' + this.options.style_error + '"></span>' );
            } else {
                $(this.options.msg_parent_el).html( '<span id="' + this.options.msg_el_id + '" style="' + this.options.style_error + '"></span>' );
            }
            var default_msg = this.options.msg;
            var self = this;
            $(this.element).change(function(){
                var url = $(this).val();
                $(el).next().html( '' );
                if (url.length == 0){
                    //nop
                } else if (!self.validate_length(url)){
                    self.render_msg($(this),self.options.msg_too_short,self.options.style_error);
                }
                else if (!self.validate_regex(url)){
                    self.render_msg($(this),self.options.msg_invalid_format,self.options.style_error);
                } else {
                    self.validate_ajax($(this), self, url)
                }
            });
        },
        render_msg: function(el,msg,style){
            if (this.options.render_msg){
                var html = '';
                html +=     msg;
                $('#' + this.options.msg_el_id).attr('style',style);
                $('#' + this.options.msg_el_id).html( msg );
            }
        },
        validate_length: function(url){
            return (url.length > 4);
        },
        validate_regex: function(url){
            return (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url));
        },
        validate_ajax: function(el, self, url){
            var jsonpCallback = 'jsonpCallback_' + Math.floor((Math.random()*99999999)+10000000);
            $.ajax({
                url: url,
                dataType:       'jsonp',
                jsonpCallback:  jsonpCallback,
                timeout:        self.options.timeout,
                success: function(){
                    self.render_msg(el,'Valid link.');
                },
                error:function(jqXHR, textStatus, errorThrown){
                    if (textStatus == "timeout"){ 
                        self.render_msg(el, self.options.msg_timeout, self.options.style_error);
                    } else if (textStatus == "error"){
                        self.render_msg(el, self.options.msg_broken_link, self.options.style_error);
                    } else {
                        this.valid_status = true;
                        self.render_msg(el, self.options.msg_valid_link, self.options.style_success);
                    }
                }
            });
        }
    };

    $.fn[pluginName] = function ( options ) {
        return new Plugin( this, options );
    };

})( jQuery, window, document );