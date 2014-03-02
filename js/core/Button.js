;(function(window) {
    function Button(){
        this.id = 'button';
        this.label = 'Button';
        this.cssClass = 'btn btn-primary';
        this.clickHandler = function(event){};

        function __construct(){} 
        __construct();
    }
    
    Button.prototype.setId = function(id){
        this.id = id;
    }
    
    Button.prototype.setLabel = function(label){
        this.label = label;
    }
    
    Button.prototype.setCssClass = function(cssClass){
        this.cssClass = cssClass;
    }
    
    Button.prototype.setClickHandler = function(clickHandler){
        this.clickHandler = clickHandler;
        $('body').on('click', '#' + this.id, $.proxy(function(event){
            this.clickHandler(event);
        },this));
    }
    
    Button.prototype.render = function(){
        var html  = '';
        html += '<button type="button" class="' + this.cssClass + '" id="' +  this.id + '">' +  this.label + '</button>';
        return html;
    }
    
    window.Button = Button;
}(window));