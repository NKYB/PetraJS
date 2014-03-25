;(function(window) {
    var TabManager = function() {

        if ( TabManager.prototype._singletonInstance ) {
          return TabManager.prototype._singletonInstance;
        }
        TabManager.prototype._singletonInstance = this;
        
        this.parentEl = 'body';
        this.tabs = [];
        this.addTab = function(id, text, status, clickHandler){
            var tab = new Tab();
            tab.id = id;
            tab.text = text;
            tab.status = status;
            if (clickHandler)
                tab.clickHandler = clickHandler;
            this.tabs.push( tab );
        }
        
        this.modifyTab = function(id, key, value){
            for (var tabIndex in this.tabs){
                if (this.tabs[tabIndex].id == id){
                    this.tabs[tabIndex][key] = value;
                    this.render();
                    break;
                }
            }
        }
        
        this.render = function(){
            if (this.tabs.length > 0){
                var html = '';
                html += '<ul class="nav nav-tabs" style="font-size: 20px;">';
                for (var key in this.tabs){
                    var tab = this.tabs[key];
                    html += '<li id="' + tab.id + '" class="' + tab.status + '">';
                    html += '   <a href="#">' + tab.text + '</a>';
                    html += '</li>';
                }
                html += '</ul>';
                $( this.parentEl ).html( html );
                for (var key in this.tabs){
                    var tab = this.tabs[key];
                    if (tab.status == Tab.STATUS_NORMAL){
                        $( this.parentEl + ' > ul > #' + tab.id + ' > a' ).click(function(event){
                            event.preventDefault();
                            tab.clickHandler( tab );
                        });
                    }
                }
            }
        }
    }
    window.TabManager = TabManager;
}(window));

;(function(window) {
    function Tab(){
        this.id = 'tab';
        this.text = 'Tab';
        this.status = this.STATUS_NORMAL;
        this.clickHandler = function( tab ){};

        function __construct(){} 
        __construct();
    }

    Tab.STATUS_NORMAL = '';
    Tab.STATUS_ACTIVE = 'active';
    Tab.STATUS_DISABLED = 'disabled';
    
    window.Tab = Tab;
}(window));