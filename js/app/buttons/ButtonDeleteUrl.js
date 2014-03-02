;(function(window) {
    function ButtonDeleteUrl(){
        this.setId('BtnDeleteUrl');
        this.setLabel('Add Url');
        this.setClickHandler(function(event){
            var modal = new ModalDeleteUrl();
        });
        function __construct(){} 
        __construct();
    }
    
    ButtonDeleteUrl.prototype = new Button();

    window.ButtonCreateUrl = ButtonDeleteUrl;
}(window));