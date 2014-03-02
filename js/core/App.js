/**
 * House cleaning incase there's a console.log left in the prod code and
 * the browser doesn't support the command
 */
if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}
console.log('App Console Activated!');

;(function(window) {
    function App(){
        App.GET_MODEL = 'GET_MODEL';
        App.SET_MODEL = 'SET_MODEL';
        
        this.urlBackendModels  = 'ajax_model.php';
        
        this.models = [];
        
        this.events = [];

        function __construct(){} 
        __construct();
    }
    
    App.prototype.loadView = function(view){
        view.show();
    };
    
    App.prototype.on = function(event_name,fn){
        this.events[event_name] = fn;
    }
    
    App.prototype.trigger = function(event_name){
        this.events[event_name]();
    }
    
    App.prototype.setModel = function(model_name, model){
        model = this.handleEmptyModel(model_name, model, this);
        this.models[model_name] = model;
    }
    
    App.prototype.getModel = function(model_name){
        return $.extend(new window[model_name](), this.models[model_name]);
    }
    
    App.prototype.loadModel = function(model_name, success_handler, error_handler){
        var self = this;
        this.ajax(App.GET_MODEL, model_name, {}, function(model){
                model = self.handleEmptyModel(model_name, model, self);
                self.setModel(model_name, model);
                success_handler(model);
            }, 
            error_handler
        );
    }
    
    App.prototype.saveModel = function(model_name, model, success_handler, error_handler){
        this.ajax(App.SET_MODEL, model_name, this.models[model_name], success_handler, error_handler);
    }
    
    App.prototype.handleEmptyModel = function(model_name, model, self){
        return self.isEmpty(model) ? new window[model_name]() : model;
    }
    
    App.prototype.ajax = function(action, model_name, model, success_handler, error_handler){
        $.ajax({
            url: this.urlBackendModels,
            dataType: "json",
            type: "POST",
            data: {
                    action: action,
                    model_name: model_name,
                    model: JSON.stringify(model)
            },
            success: success_handler,
            error: error_handler
        });
    }
    
    App.prototype.isEmpty = function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }
    
    window.App = App;
}(window));