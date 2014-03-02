;(function(window) {
    function ModelUrl(){
        this.href = "";
        this.events = [];
        this.currentEventId = 0;
        
        function __construct(){} 
        __construct();
    }
    
    ModelUrl.prototype.setHref = function(href){
        href = this.stripQueryStringAndHashFromUrl(href);
        if (href.length > 0){
            if (this.isValidUrl(href)){
                this.href = href;
                return true;
            }
        }
        return false;
    }
    
    ModelUrl.prototype.getHref = function(){
        return this.href;
    }
    
    ModelUrl.prototype.isValidUrl = function(url){
        var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        return urlregex.test(url);
    }
    
    ModelUrl.prototype.stripQueryStringAndHashFromUrl = function(url) {
        if (url.indexOf("?"))
            url = url.split("?")[0];
        if (url.indexOf("#"))
            url = url.split("#")[0];
        return url;
    }
    
    ModelUrl.prototype.addEvent = function(event){
        this.events.push(event);
        this.currentEventId = this.events.length - 1;
    }
    
    ModelUrl.prototype.getEventss = function(){
        return this.events;
    }
    
    ModelUrl.prototype.getCurrentEvent = function(){
        return this.events[this.currentEventId];
    }
    
    ModelUrl.prototype.createJSON = function(){
        var json = {href: this.href};
        json.events = [];
        for(key in this.events){
            json.events[key] = this.events[key].createJSON();
        }
        return json;
    }
    
    window.ModelUrl = ModelUrl;
}(window));