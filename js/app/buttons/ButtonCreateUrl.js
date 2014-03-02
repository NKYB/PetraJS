;(function(window) {
    function ButtonCreateUrl(){
        this.setId('BtnCreateUrl');
        this.setLabel('Add Url');
        this.setClickHandler(function(event){
            var modal = new ModalCreateUrl();
        });
        function __construct(){} 
        __construct();
    }
    
    ButtonCreateUrl.prototype = new Button();

    window.ButtonCreateUrl = ButtonCreateUrl;
}(window));