;(function(window) {
    function ModelUrlGroup(){
        this.urls = [];
        this.currentUrlId = 0;
        function __construct(){} 
        __construct();
    }
    
    ModelUrlGroup.prototype.addUrl = function(url){
        this.urls.push(url);
        this.currentUrlId = this.urls.length - 1;
    }
    
    ModelUrlGroup.prototype.getUrls = function(){
        return this.urls;
    }
    
    ModelUrlGroup.prototype.setCurrentUrl = function(currentUrlId){
        this.currentUrlId = currentUrlId;
    }
    
    ModelUrlGroup.prototype.getCurrentUrl = function(){
        return this.urls[this.currentUrlId];
    }
    
    ModelUrlGroup.prototype.createJSON = function(){
        return this.urls;
    }
    
    ModelUrlGroup.prototype.loadJSON = function(json){
        this.urls = json;
    }
    
    window.ModelUrlGroup = ModelUrlGroup;
}(window));