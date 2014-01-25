/*
 *  Project: jQuery Formulate
 *  Description: Forms Framework
 *  Author: eel
 *  License: EPv2
 */
;(function ( $, window, document, undefined ) {
    var pluginName = "formULate";
    var defaults = {
        label_style: '',
        error_style: '', 
        read_only: false,
        complete_url_redirect: '',
        model_url: 'model.php',
        model_save_action: '',
        model_load_action: '',
        clone: {flag: false, field: ''},
        log_handler: function(msg){}
    };
    
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this._form_elements = [];
        this._default_element = {
            id : '',
            label : '',
            type : 'hidden',
            json : {},
            input_style : '',
            element_style : '',
            option_list : [],
            default_value : '',
            value : '',
            error_json : '{}',
            min : 0,
            max : 100,
            children_count: 0,
            form: [],
            parent: this.element,
            click_action: this._save,
            auto_complete: [],
            add_class: 'title-inverse',
            is_link: false
        };
    }

    Plugin.prototype = {
        add: function(options){
            this._form_elements[options.id] = $.extend({}, this._default_element, options );
            if (this._form_elements[options.id].value == '' && this._form_elements[options.id].default_value != '')
                this._form_elements[options.id].value = this._form_elements[options.id].default_value;
        },
        render: function(params){
            this._model(this.options.model_load_action,params,function(self, response){
                if (response != null){
                    //var model = JSON.parse(response);
                    model = response;
                    for (var id in self._form_elements){
                        
                        /*
                         * Support list
                         */
                        if (self._form_elements[id].type == 'list' ){
                            var breakFlag = false;
                            for (var i=0;i<1000;i++){
                                var parent = '#' + id + '-item-' + self._form_elements[id].children_count;
                                var the_count = self._form_elements[id].children_count;
                                for (var key in self._form_elements[id].form){
                                    var form_id = id + '-' + self._form_elements[id].form[key].id + '-' + i;
                                    
                                    if (model[form_id]){
                                        var element = $.extend({},self._form_elements[id].form[key]);
                                        element.id = id + '-' + self._form_elements[id].form[key].id + '-' + the_count;
                                        element.value = model[form_id];
                                        element.parent = parent;
                                        if (key == 0){
                                            self.add({id: element.id + '-header', label: self._form_elements[id].label + ' #' + (parseInt(self._form_elements[id].children_count) + 1), type: 'header', parent: element.parent, add_class: 'title-danger', element_style: 'text-align: left;background-color:green;height:52px;'});
                                            if (!self.options.read_only)
                                                self.add({id: element.id + '-delete_button', label: 'Delete', type: 'button', parent: '#' + element.id + '-header', element_style: 'float:right;padding-top:0px;font-size:16px;', click_action: self._delete_list_row});
                                            self._form_elements[id].children_count++;
                                        }
                                        self.add(element);
                                    } else {
                                        //breakFlag = true;
                                    }
                                }
                                if (breakFlag)
                                    break;
                            }
                        }
                        
                        if (model[id] != '')
                            self._form_elements[id].value = model[id];
                        if (model[id] == '' && self._form_elements[id].default_value != '')
                            self._form_elements[id].value = self._form_elements[id].default_value;
                    }
                }
                self._render();
            });
        },
        _model: function(action,params,callback){
            $.ajax({
                context:this,
                url: this.options.model_url,
                dataType: 'jsonp',
                jsonpCallback: 'jsonpCallback',
                contentType: 'application/json',
                data: {
                    action:   action, 
                    json:     JSON.stringify(params)
                }
            }).done(function( response ) {
                callback(this, response, params);
            });
        },
        _fade:function(dom_name,msg,msg_color,redirect){
            $(dom_name).html(msg);
            $(dom_name).css('color',msg_color);
            var url = this.options.complete_url_redirect;
            $(dom_name).fadeIn(1000, function(){
                $(dom_name).fadeOut('slow', function(){
                    if (redirect)
                        window.app.traffic(url);
                        //document.location.href=url;
                });
            });
        },
        _delete_list_row: function(button){
            button.preventDefault();
            var selector = $(button.currentTarget);
            var list = $(selector).attr('id').split('-');
            var list_name = list[0];
            var selected_id = list[2];
            
            $('#' + list_name ).find('div').each(function(){
                if ($(this).attr('id')){
                    var list_form = $(this).attr('id').split('-');
                    var list_form_id = list_form[2];
                    if (selected_id == list_form_id){
                        $('#' + list_name + '-item-' + selected_id).remove();
                    } else if (selected_id < list_form_id){
                        var html = $('#' + list_name + '-item-' + list_form_id).find('.header > span').html();
                        html = html.replace(' #' + (parseInt(list_form_id) + 1) , ' #' + parseInt(list_form_id));
                        $('#' + list_name + '-item-' + list_form_id).find('.header > span').html( html );
                    }
                }
            });
            return false;
        },
        _save: function(button){
            button.preventDefault();
            var button_msg_selector = this._get_button_msg_selector(button);
            if (this._validate()){
                var form_data = this._get_form_data();
                this._save_ajax(form_data, button_msg_selector);
            } else {
                this._save_error_msg(button_msg_selector);
            }
            return false;
        },
        _get_button_msg_selector: function(button){
            return '#' + $(button.currentTarget).attr('id') + '_msg';
        },
        _get_form_data: function(){
            var form_data = {};
            for (var id in this._form_elements){
                var element = this._form_elements[id];
                form_data[id] = this._get_form_element_value(element);
            }
            return form_data;
        },
        _save_ajax: function(form_data,el_name){
            this._model(this.options.model_save_action,form_data,function(self, response, params){
                self.options.log_handler(self.options.model_save_action,params);
                self._save_success_msg(el_name,self);
            });
        },
        _save_success_msg: function(el_name,self){
            self._fade(el_name,'(Saved)','green',true);
        },
        _save_error_msg: function(el_name){
            this._fade(el_name,'(Error)','red',false);
        },
        _validate: function(){
            var is_valid = true;
            for (var id in this._form_elements){
                var element = this._form_elements[id];
                if (element.error_json.required != undefined){
                    if (this._get_form_element_value(element) == ''){
                        is_valid = false;
                        var html = '';
                        html += '<div style="' + this.options.error_style + '">';
                        html +=     element.error_json.required_msg;
                        html += '</div>';
                        $('#' + element.id + '-error').html(html);
                    }
                }
            }
            return is_valid;
        },
        _get_form_element_value: function(element){
            var element_value = '';
            if (element.type == 'radio'){
                element_value = $("input[name='" + element.id + "']:checked").val();
            } else if (element.type == 'slider'){
                element_value = $("div[name='" + element.id + "']").text();
            } else if (element.type == 'textarea'){
                element_value = $("textarea[name='" + element.id + "']").val();
            } else {
                if ($("input[name='" + element.id + "']").length ) {
                    element_value = $("input[name='" + element.id + "']").val();
                } else {
                    element_value = $("select[name='" + element.id + "']").val();
                }
            }
            return element_value;
        },
        _row_start: function(){
            return '<div class="row">';
        },
        _row_end: function(){
            return '<div class="clear"></div></div>';
        },
        _label: function(label){
            return '<div class="label" style="' + this.options.label_style + '">' + label + '</div>';
        },
        _label_list: function(selector, label, count){
            return $(selector).append( '<div class="header" style="text-align: left;background-color:green;">' + label + ' #' + count + '</div>' );
        },
        _render: function(){
            this.element.html( '' );
            for (var id in this._form_elements){
                var element = this._form_elements[id];
                this._render_element(element);
            }
            if (this.options.clone.flag == true){
                $("input[name='" + this.options.clone.field + "']").val('');
            }
        },
        _render_element: function(el){
             /*
             * Render HTML
             */
            var html = '';
            switch(el.type){
                case 'header':
                    html += '<h4 style="margin-top: 10px;" id="' + el.id + '"  class="widgettitle '+ el.add_class + '">' + el.label + '</h4>'
                    break;
                case 'hidden':
                    html += '<input type="hidden" name="' + el.id + '" value="' + el.value + '" >';
                    break;
                case 'text':
                    html += '   <div style="margin-top: 10px;margin-bottom: 10px;">';
                    html += '       <div style="float:left;width:200px;;text-align:right;"><label>' + el.label + '</label></div>';
                    if (!this.options.read_only){
                        if (el.auto_complete.length > 0){
                            html += '<div style="float:left;padding-left:20px;width:50%;">';
                            html += '       <select data-placeholder="Choose a Value..." style="width:350px" class="chzn-select" id="' + el.id + '" name="' + el.id + '">';
                            html += '           <option value="' + el.value + '">' + el.value + '</option>';
                            for (var id in el.auto_complete){
                                html += '       <option value="' + el.auto_complete[id] + '">' + el.auto_complete[id] + '</option>';
                            }
                            html += '       </select>';
                            html += '</div>';
                        } else {
                            html += '   <div style="float:left;padding-left:20px;width:50%;">';
                            html += '           <input type="text" id="' + el.id + '" name="' + el.id + '" value="' + el.value + '" class="input-xlarge glowing-border" placeholder="<no value>">';
                            html += '           <span class="help-inline" id="' + el.id + '-error"></span>';
                            html += '   </div>';
                        }
                    } else {
                        html += '       <div style="float:left;padding-left:20px;width:50%;margin-top:6px;">';
                        html +=             el.value;
                        html += '       </div>';
                    }
                    html += '       <div style="clear:both;"></div>';
                    html += '   </div>';
                    break;
                case 'textarea':
                    html += '   <div style="margin-top: 10px;margin-bottom: 10px;">';
                    html += '       <div style="float:left;width:200px;;text-align:right;"><label>' + el.label + '</label></div>';
                    if (!this.options.read_only){
                        html += '   <div style="float:left;padding-left:20px;width:50%;">';
                        html += '       <textarea id="' + el.id + '" name="' + el.id + '" type="text" cols="80" rows="5" class="span5">';
                        html +=             el.value;
                        html +=         '</textarea>';
                        html += '       <label id="' + el.id + '-error" for="' + el.id + '" generated="true" class="error" style=""></label>';
                        html += '   </div>';
                    } else {
                        html += '       <div style="float:left;padding-left:20px;width:50%;margin-top:6px;word-wrap:break-word;">';
                        html +=             el.value;
                        html += '       </div>';
                    }
                    html += '       <div style="clear:both;"></div>';
                    html += '   </div>';
                    break;
                case 'radio':
                    html += '   <div style="margin-top: 10px;margin-bottom: 10px;">';
                    html += '       <div style="float:left;width:200px;;text-align:right;"><label>' + el.label + '</label></div>';
                    if (!this.options.read_only){
                         html += '<div style="float:left;padding-left:20px;width:50%;margin-top:6px;">';
                         for (var option_list_key in el.option_list){
                            var checked = '';
                            if (el.value == option_list_key){
                                checked = 'checked="checked"';
                            }
                            html += '       <input type="radio" id="' + el.id + '_' + option_list_key + '" value="' + option_list_key + '" name="' + el.id + '"  ' + checked + ' />';
                            html += el.option_list[option_list_key] + '&nbsp;&nbsp;';
                        }
                         html += '   </div>';
                    } else {
                        html += '       <div style="float:left;padding-left:20px;width:50%;margin-top:6px;">';
                        html +=             el.value;
                        html += '       </div>';
                    }
                    html += '       <div style="clear:both;"></div>';
                    html += '   </div>';
                    break;
                case 'slider':
                    html += '   <div style="margin-top: 10px;margin-bottom: 10px;">';
                    html += '       <div style="float:left;width:200px;;text-align:right;"><label>' + el.label + '</label></div>';
                    if (!this.options.read_only){
                        html += '<div style="float:left;padding-left:20px;width:50%;margin-top:6px;">';
                        html += '   <div id="' + el.id + '_slider" class="slider" style="float:left;width:50%;" ></div>';
                        html += '   <div id="' + el.id + '_readout" type="slider" style="float:left;margin-left:10px;" name="' + el.id + '" class="slider_readout">';
                        html += '       ' + (el.value == "" ? '0' : el.value);
                        html += '   </div>';
                        html += '   <div style="clear:both"></div>';
                        html += '</div>';
                    } else {
                        html += '       <div style="float:left;padding-left:20px;width:50%;margin-top:6px;">';
                        html +=             el.value;
                        html += '       </div>';
                    }
                    html += '       <div style="clear:both;"></div>';
                    html += '   </div>';
                    break;
                case 'button':
                    if (!this.options.read_only){
                        html += '<div style="text-align:right;padding-top:20px;' + el.element_style + '">';
                        html += '  <span id="' + el.id + '_msg" class="msg" style="display:none;color:green;padding-top:10px;"></span>';
                        html += '  <button id="' + el.id + '" class="btn btn-primary"> <i class="iconfa-ok"></i>  &nbsp; ' + el.label + '</button>';
                        html += '</div>';
                    }
                    break;
                case 'list':
                    if (!this.options.read_only){
                        html += '<div style="padding-top:20px;padding-bottom:20px;">';
                        //html += '  <button id="' + el.id + '_button">New ' + el.label + '</button>';
                        html += '  <a id="' + el.id + '_button" class="btn"> <i class="icon-plus"></i>  &nbsp; ' + el.label + '</a>';
                        html += '</div>';
                    }
                    html += '<div id="' + el.id + '" style="">';
                    for (var id=0;id<el.children_count;id++){
                        html += '<div id="' + el.id + '-item-' + id + '" style=""></div>';
                    }
                    html += '</div>';
                    break;
            }
            $(el.parent).append( html );
            
            /*
             * Render Javascript
             */
            switch(el.type){
                case 'header':
                    break;
                case 'hidden':
                    break;
                case 'text':
                    if (!this.options.read_only){
                        if (el.auto_complete.length > 0){
                            $('#' + el.id).chosen({allow_custom_value: true});
                        } else {
                            $('#' + el.id).uniform();
                        }
                    }
                    break;
                case 'button':
                    $('#' + el.id).click($.proxy(el.click_action, this));
                    break;
                case 'textarea':
                    if (el.is_link){
                        $('#' + el.id).linkULate();
                    }
                    break;
                case 'radio':
                    $("input[name='" + el.id + "']").uniform();
                    break;
                case 'slider':
                    $( "#" + el.id + "_slider" ).slider({
                        value:  (el.value == "" ? '0' : parseInt(el.value)),
                        min: el.min,
                        max: el.max,
                        slide: function( event, ui ) {
                            $(this).parent().children('.slider_readout').html( "" + ui.value );
                        }
                    });
                    break;
                case 'list':
                    $('#' + el.id + '_button').click($.proxy(function () {
                            var element = this._form_elements[el.id];
                            var parent = el.id + '-item-' + parseInt(this._form_elements[el.id].children_count);
                            for (var id in element.form){
                                var element_form = $.extend({},element.form[id]);
                                element_form.id = el.id + '-' + element.form[id].id + '-' + element.children_count;
                                element_form.parent = '#' + parent;
                                element_form.value='';
                                if (id == 0){
                                    $('#' + el.id).append( '<div id="' + parent + '" style=""></div>' );
                                    this.add({id: element_form.id + '-header', label: el.label + ' #' + (parseInt(element.children_count) + 1), type: 'header', add_class: 'title-danger', parent: element_form.parent, element_style: 'text-align: left;background-color:green;height:52px;'});
                                    this._render_element(this._form_elements[element_form.id + '-header']);
                                    this.add({id: element_form.id + '-delete_button', label: 'Delete', type: 'button', parent: '#' + element_form.id + '-header', element_style: 'float:right;padding-top:0px;font-size:16px;', click_action: this._delete_list_row});
                                    this._render_element(this._form_elements[element_form.id + '-delete_button']);
                                }
                                this.add(element_form);
                                this._render_element(this._form_elements[element_form.id]);
                            }
                            this._form_elements[el.id].children_count++;
                            return false;
                        },this,el.id));
                    
                    

                    break;
            }
        }
    };

    $.fn[pluginName] = function ( options ) {
        return new Plugin( this, options );
    };

})( jQuery, window, document );